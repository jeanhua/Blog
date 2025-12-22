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
  if (allCategories.includes("已失效")) {
    categories.push("已失效");
  }

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
    
    list.innerHTML = filtered.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="friend-link-item">
        <img srcset="${item.avatar}" alt="${item.title}" class="friend-avatar" loading="lazy">
        <div class="friend-info">
          <h3 class="friend-title">${item.title}</h3>
          <p class="friend-desc">${item.description}</p>
        </div>
      </a>
    `).join('');
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.friend-links-nav {
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn.active{
  background: #ff9500ff;
  color: white;
  border-color: #007bff;
}
.nav-btn:hover {
  background: #5c5c5cff;
  color: white;
  border-color: #007bff;
}

.friend-links-list {
  display: grid;
  gap: 16px;
}

.friend-link-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s;
}

.friend-link-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.friend-avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.friend-info {
  flex: 1;
}

.friend-title {
  margin: 0 0 6px;
  font-size: 1.1em;
  color: #007bff;
}

.friend-desc {
  margin: 0;
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}
</style>


<h4>添加友链</h4>
添加完本站友链后可留言或给我<a href="mailto:jeanhua_official@outlook.com">发送邮件</a>或<a style="color:blue" href="https://github.com/jeanhua/Blog/issues/new?template=frends-link.md">点击这里</a>前往github申请友链, 审核通过后更新显示
<br><br><h4>站点信息</h4>
网站名称: jeanhua的博客<br>邮箱: jeanhua_official@outlook.com<br>网站链接: https://www.blog.jeanhua.cn<br>网站描述: jeanhua的个人博客<br>网站头像: https://q1.qlogo.cn/g?b=qq&nk=2207739460&s=0