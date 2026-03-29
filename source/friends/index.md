---
layout: friends
title: 友链
---

<div id="friend-links">
  <div class="friend-links-container">
    <div class="friend-links-nav">
      <button class="nav-btn active" data-category="all">全部</button>
    </div>
    <div class="friend-links-list">
    </div>
  </div>
</div>

<script>
const friendLinksData = [
  {
    title: "57U's blog",
    description: "神5哥的博客",
    url: "https://blog.57u.tech",
    avatar: "https://avatars.githubusercontent.com/u/62684955",
    category: "技术类"
  },
  {
    title: "leeinx's blog",
    description: "leeinx的博客",
    url: "https://leeinx.com",
    avatar: "https://q1.qlogo.cn/g?b=qq&nk=2188349576&src_uin=www.jlwz.cn&s=0",
    category: "技术类"
  },
  {
    title: "Luxynth",
    description: "我心匪石不可转",
    url: "https://luxynth.cn",
    avatar: "https://luxynth.cn/assets/images/avatar.jpg",
    category: "技术类"
  },
  {
    title: "医路前行",
    description: "一个医学博士的思想碎片",
    url: "https://www.janyoung.cn",
    avatar: "https://www.janyoung.cn/tx_janyoung%20.jpg",
    category: "生活类"
  },
  {
    title: "PK",
    description: "we need a real revolution for ourselves.",
    url: "https://rustlove.blog",
    avatar: "https://foruda.gitee.com/avatar/1735578534702305405/15325054_rustlove_1735578534.png",
    category: "已失效"
  },
  {
    title: "gnahz's blog",
    description: "高数大佬的博客",
    url: "https://sunkindream.github.io",
    avatar: "https://sunkindream.github.io/images/640.jpg",
    category: "技术类"
  },
  {
    title: "小鱼日记",
    description: "杂乱无章的日记",
    url: "https://youweiyu.github.io",
    avatar: "https://avatars.githubusercontent.com/u/147398040?s=400&u=0feae2c94751140542d6e062ebe2321ce20af534&v=4",
    category: "学术类"
  },
  {
    title: "MarkBai的数字自留地",
    description: "一个IT&DIY爱好者的折腾日志",
    url: "https://blog.051088.xyz/",
    avatar: "https://blog-img.051088.xyz/avatar_big.png",
    category: "技术类"
  },
  {
    title: "SNOWS",
    description: "welcome to the real world. it sucks, you're gonna love it",
    url: "https://snows.chat",
    avatar: "https://foruda.gitee.com/avatar/1756797583886460777/12127599_hxs-12138_1756797583.png",
    category: "技术类"
  },
  {
    title: "小元博客",
    description: "这是一个技术分享和娱乐性的网站，它们记录着我的所思所想，在这里你能看见有关前端或是一些其它乱七八糟的技术思路分享，也能看见我的一些吐槽和有趣的分享，总之很欢迎您的光顾。",
    url: "https://reblog.cn",
    avatar: "https://reblog.cn/upload/img/web-user.jpeg",
    category: "技术类"
  },
];

function renderFriendLinks() {
  const container = document.querySelector('#friend-links');
  const nav = container.querySelector('.friend-links-nav');
  const list = container.querySelector('.friend-links-list');

  const allCategories = [...new Set(friendLinksData.map(item => item.category))];
  const normalCategories = allCategories.filter(cat => cat !== "已失效");
  let categories = ["all", ...normalCategories];
  if (allCategories.includes("已失效")) categories.push("已失效");

  nav.innerHTML = categories.map(cat =>
    `<button class="nav-btn ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
      ${cat === 'all' ? '全部' : cat}
    </button>`
  ).join('');

  renderLinksByCategory('all');

  nav.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      nav.querySelector('.nav-btn.active').classList.remove('active');
      btn.classList.add('active');
      renderLinksByCategory(btn.dataset.category);
    });
  });

  function renderLinksByCategory(category) {
    const filtered = category === 'all'
      ? friendLinksData.filter(item => item.category !== "已失效")
      : friendLinksData.filter(item => item.category === category);

    list.innerHTML = filtered.map((item, i) => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="friend-link-item ${item.category === '已失效' ? 'expired' : ''}">
        <div class="friend-avatar-wrap">
          <img alt="${item.title}" class="friend-avatar"
               onerror="this.src='/image/failavatar.png'">
        </div>
        <div class="friend-info">
          <h3 class="friend-title">${item.title}</h3>
          <p class="friend-desc">${item.description}</p>
        </div>
        ${item.category === '已失效' ? '<span class="expired-badge">已失效</span>' : ''}
      </a>
    `).join('');

    // 手动设置 src，绕过主题懒加载
    list.querySelectorAll('.friend-avatar').forEach((img, i) => {
      img.src = filtered[i].avatar;
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderFriendLinks);
} else {
  renderFriendLinks();
}
</script>

<style>
#friend-links {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px;
}

.friend-links-nav {
  margin-bottom: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-btn {
  padding: 7px 20px;
  border: 1.5px solid #e0e0e0;
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  color: #555;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  border-color: #ff9500;
  color: #ff9500;
  background: rgba(255, 149, 0, 0.06);
}

.nav-btn.active {
  background: linear-gradient(135deg, #ff9500, #ff6b00);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(255, 149, 0, 0.35);
}

.friend-links-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.friend-link-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.friend-link-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,149,0,0.04), rgba(255,107,0,0.02));
  opacity: 0;
  transition: opacity 0.2s;
}

.friend-link-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #ffd699;
}

.friend-link-item:hover::before {
  opacity: 1;
}

.friend-link-item.expired {
  opacity: 0.55;
  filter: grayscale(0.4);
}

.friend-avatar-wrap {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: border-color 0.2s;
}

.friend-link-item:hover .friend-avatar-wrap {
  border-color: #ff9500;
}

.friend-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-title {
  margin: 0 0 5px;
  font-size: 1em;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.friend-link-item:hover .friend-title {
  color: #ff9500;
}

.friend-desc {
  margin: 0;
  color: #888;
  font-size: 0.85em;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expired-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.72em;
  padding: 2px 8px;
  background: #f0f0f0;
  color: #999;
  border-radius: 999px;
}

@media (max-width: 480px) {
  .friend-links-list {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="apply-section">
  <h4>添加友链</h4>
  <p>添加完本站友链后可给我 <a href="mailto:jeanhua_official@outlook.com">发送邮件</a> 或 <a href="https://github.com/jeanhua/Blog/issues/new?template=frends-link.md" target="_blank" rel="noopener">点击这里</a> 前往 GitHub 申请友链，审核通过后更新显示。</p>
  <h4>站点信息</h4>
  <div class="site-info">
    <div class="site-info-item"><span class="label">网站名称</span><span>jeanhua's blog</span></div>
    <div class="site-info-item"><span class="label">邮箱</span><span>jeanhua_official@outlook.com</span></div>
    <div class="site-info-item"><span class="label">网站链接</span><span>https://blog.jeanhua.cn</span></div>
    <div class="site-info-item"><span class="label">网站描述</span><span>jeanhua的个人博客</span></div>
    <div class="site-info-item"><span class="label">网站头像</span><span>https://q1.qlogo.cn/g?b=qq&nk=2207739460&s=0</span></div>
  </div>
</div>

<style>
.apply-section {
  max-width: 860px;
  margin: 40px auto 0;
  padding: 0 16px;
}

.apply-section h4 {
  font-size: 1.05em;
  font-weight: 600;
  color: #333;
  margin: 24px 0 10px;
  padding-left: 10px;
  border-left: 3px solid #ff9500;
}

.apply-section p {
  color: #666;
  font-size: 0.95em;
  line-height: 1.7;
}

.apply-section a {
  color: #ff9500;
  text-decoration: none;
}

.apply-section a:hover {
  text-decoration: underline;
}

.site-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 16px 20px;
}

.site-info-item {
  display: flex;
  gap: 16px;
  font-size: 0.9em;
  color: #555;
}

.site-info-item .label {
  min-width: 70px;
  color: #999;
  font-weight: 500;
}
</style>
