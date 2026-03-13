async function loadSidebar(activeMenuId) {
  try {
    const response = await fetch('../components/common/sidebar.html');
    const html = await response.text();

    document.getElementById('sidebar-root').innerHTML = html;

    if (activeMenuId) {
      const activeItem = document.getElementById(activeMenuId);
      if (activeItem) {
        activeItem.style.background = '#eef2ff';
        activeItem.style.color = '#4f46e5';
        activeItem.style.fontWeight = '700';
      }
    }
  } catch (error) {
    console.error('사이드바 컴포넌트를 불러오는 데 실패했습니다.', error);
  }
}
