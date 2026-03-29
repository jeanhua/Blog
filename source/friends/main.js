let friendLinksData = [];

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

// 先请求数据，再在 DOM 就绪后渲染
fetch('/friends/friends.json')
    .then(res => res.json())
    .then(f => {
        friendLinksData = f;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderFriendLinks);
        } else {
            renderFriendLinks();
        }
    })
    .catch(err => {
        console.error('加载 friends.json 失败:', err);
    });