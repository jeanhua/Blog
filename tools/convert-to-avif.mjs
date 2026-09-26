// 将 PNG/JPG/WebP 图片转换为 AVIF，并同步更新文章与配置中的引用路径。
// 注意：不能放在 scripts/ 目录，Hexo 会把它当作插件脚本自动加载而报错。
// 用法：
//   node tools/convert-to-avif.mjs              # 转换 source/ 下所有图片
//   node tools/convert-to-avif.mjs a.png b.jpg  # 只转换指定图片
//   node tools/convert-to-avif.mjs --staged     # 转换 git 已暂存的图片并重新暂存（pre-commit 钩子调用）
// 可用环境变量：AVIF_QUALITY（默认 62）、AVIF_EFFORT（默认 4，范围 0-9）
// 输出带标签的行：AVIF=已转换 KEEP=保留原图 REF=更新了引用 SKIP/FAIL=未转换
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const QUALITY = Number(process.env.AVIF_QUALITY ?? 62);
const EFFORT = Number(process.env.AVIF_EFFORT ?? 4);
const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const REF_EXT = new Set(['.md', '.html', '.yml', '.yaml', '.js']);

const toPosix = (p) => p.split(path.sep).join('/');
const fmt = (n) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + 'MB' : (n / 1024).toFixed(0) + 'KB');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

async function collectTargets() {
  if (process.argv.includes('--staged')) {
    const buf = execFileSync(
      'git',
      ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z',
        ':(icase)*.png', ':(icase)*.jpg', ':(icase)*.jpeg', ':(icase)*.webp'],
      { cwd: ROOT, maxBuffer: 16 * 1024 * 1024 },
    );
    return buf.toString().split('\0').filter(Boolean).map((p) => path.resolve(ROOT, p));
  }
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  if (args.length) return args.map((p) => path.resolve(p));
  return walk(path.join(ROOT, 'source')).filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()));
}

// oldRel -> newRel（以 source/ 为站点根，与文章里 /image/... 的引用一致），转换完成后统一替换
const replacements = new Map();
// --staged 模式下需要重新暂存的仓库根相对路径
const stagedPaths = new Set();
const changedRefs = [];
const failed = [];

async function convertOne(file) {
  const repoRel = toPosix(path.relative(ROOT, file));
  if (!repoRel.startsWith('source/')) {
    console.log(`SKIP\t${repoRel}\t不在 source/ 下，跳过`);
    return;
  }
  const siteRel = repoRel.replace(/^source\//, '');
  const target = file.replace(/\.(png|jpe?g|webp)$/i, '.avif');
  const targetRel = toPosix(path.relative(ROOT, target));
  try {
    const buf = await sharp(file).avif({ quality: QUALITY, effort: EFFORT }).toBuffer();
    const orig = fs.statSync(file).size;
    if (buf.length >= orig) {
      console.log(`KEEP\t${repoRel}\tAVIF 体积不减反增，保留原图`);
      return;
    }
    fs.writeFileSync(target, buf);
    fs.unlinkSync(file);
    replacements.set(siteRel, targetRel.replace(/^source\//, ''));
    stagedPaths.add(repoRel);
    stagedPaths.add(targetRel);
    console.log(`AVIF\t${repoRel} -> ${targetRel}\t${fmt(orig)} -> ${fmt(buf.length)}`);
  } catch (e) {
    failed.push(repoRel);
    console.log(`FAIL\t${repoRel}\t${e.message}`);
  }
}

function updateRefs() {
  const refFiles = walk(path.join(ROOT, 'source'))
    .filter((f) => REF_EXT.has(path.extname(f).toLowerCase()));
  for (const cfg of ['_config.yml', '_config.fluid.yml']) {
    const p = path.join(ROOT, cfg);
    if (fs.existsSync(p)) refFiles.push(p);
  }
  for (const f of refFiles) {
    let s = fs.readFileSync(f, 'utf8');
    const before = s;
    for (const [oldRel, newRel] of replacements) {
      // 引用可能是原样、URL 全编码、或仅空格编码为 %20 的混合形式
      s = s.replaceAll(oldRel, newRel)
        .replaceAll(encodeURI(oldRel), newRel)
        .replaceAll(oldRel.replaceAll(' ', '%20'), newRel);
    }
    if (s !== before) {
      fs.writeFileSync(f, s);
      changedRefs.push(toPosix(path.relative(ROOT, f)));
      console.log(`REF\t${toPosix(path.relative(ROOT, f))}`);
    }
  }
}

const files = await collectTargets();
const queue = [...files];
await Promise.all(
  Array.from({ length: Math.min(4, queue.length) }, async () => {
    while (queue.length) await convertOne(queue.shift());
  }),
);
if (replacements.size) updateRefs();

const before = files.reduce((n, f) => {
  try { return n + fs.statSync(f).size; } catch { return n; } // 已删除的原图
}, 0);
const kept = files.length - replacements.size - failed.length;
if (replacements.size) {
  console.log(`\n共转换 ${replacements.size} 张，保留原图 ${kept} 张，失败 ${failed.length} 张。`);
}

if (process.argv.includes('--staged')) {
  for (const p of [...stagedPaths, ...changedRefs]) execFileSync('git', ['add', '--', p], { cwd: ROOT });
}

if (failed.length) {
  console.error(`\n有 ${failed.length} 个文件转换失败，为避免丢图已中止。`);
  process.exit(1);
}
