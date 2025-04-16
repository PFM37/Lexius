function setSidebarWidth() {
    const vw = window.innerWidth;
    const sideBar = document.querySelector('.side-bar');
    sideBar.style.width = (vw * 0.01) + 'px'; // 1% of 100vw
}

// Set on load
setSidebarWidth();

// Update on resize
window.addEventListener('resize', setSidebarWidth);