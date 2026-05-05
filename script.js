// Select all elements for animation
const animatedElements = document.querySelectorAll('.scroll-left, .hero-content');

// Function to check visibility
function revealOnScroll() {
    const windowHeight = window.innerHeight;

    animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add('show');
        }
    });
}

// ========================= //
// 💎 DYNAMIC GRID SIZING
// ========================= //
function initializeCollectionsGrid() {
    const grid = document.getElementById('collectionsGrid');
    if (!grid) return;

    const boxes = grid.querySelectorAll('.box');
    
    boxes.forEach(box => {
        const cols = box.dataset.cols || '1';
        const rows = box.dataset.rows || '1';
        
        box.style.setProperty('--cols', cols);
        box.style.setProperty('--rows', rows);
    });
}

// Run on scroll
window.addEventListener('scroll', revealOnScroll);

// Run once on page load (important)
window.addEventListener('load', () => {
    revealOnScroll();
    initializeCollectionsGrid();
});