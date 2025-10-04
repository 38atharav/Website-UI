// Mobile Menu Toggle

// Mobile Sidebar Toggle
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.querySelector('.nav-menu-toggle');
    const closeBtn = document.getElementById('sidebarCloseBtn');

    // Open sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Optional: close sidebar when clicking a menu item
    sidebar.querySelectorAll('.sidebar-menu h4, .sidebar-bottom .sidebar-row').forEach(item => {
        item.addEventListener('click', closeSidebar);
    });
});

// Carousel Logic
const carousel = document.getElementById('carousel');
let currentIndex = 0;

// Function to calculate the number of cards visible based on screen width
// **NOTE:** This function is now only used for the desktop maxIndex calculation. 
// Mobile view will slide by 1.
function getCardsPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 992) {
        return 5;
    } else if (screenWidth > 600) {
        return 4;
    } else if (screenWidth > 400) {
        return 3;
    } else {
        // We'll treat this as 1 card per view for sliding, 
        // but the CSS will visually show 3 cards.
        return 1; 
    }
}

function updateCarousel() {
    if (!carousel || carousel.children.length === 0) return;

    const firstCard = carousel.children[0];
    const totalCards = carousel.children.length;
    
    // Use offsetWidth for reliable card width
    const cardWidth = firstCard.offsetWidth; 
    const carouselStyle = window.getComputedStyle(carousel);
    const gap = parseFloat(carouselStyle.gap) || 0; 
    
    // Crucial: Total distance to slide is the width of ONE card plus the gap.
    const totalCardWidth = cardWidth + gap;

    const cardsPerView = getCardsPerView();
    let maxIndex;

    if (window.innerWidth <= 660) {
        // Mobile/Focused View: Max index is total cards minus 1 (slide by 1)
        maxIndex = Math.max(0, totalCards - 1);
        // Enforce the 3-dot (maxIndex 2) limit for mobile
        maxIndex = Math.min(maxIndex, 2); 
    } else {
        // Desktop View: Max index is total cards minus cardsPerView (slide by group)
        maxIndex = Math.max(0, totalCards - cardsPerView);
    }

    // Ensure currentIndex doesn't exceed the new maxIndex
    currentIndex = Math.min(currentIndex, maxIndex);

    // Calculate the centering offset for mobile view (if needed)
    let centerOffset = 0;
    if (window.innerWidth <= 660) {
        // To visually center the first card, we need to translate by 
        // half the container width minus half the card width.
        // Given the new CSS, we use a fixed offset based on the container padding/margin.
        // A rough estimate to center is 50% of the container width minus 50% of the card width.
        const containerWidth = carousel.parentElement.offsetWidth;
        centerOffset = (containerWidth / 2) - (cardWidth / 2) - gap; 
    }
    
    // Apply the translation
    // In mobile, we subtract the centerOffset to align the first card
    const translateX = window.innerWidth <= 660 
        ? (currentIndex * totalCardWidth) - centerOffset
        : currentIndex * totalCardWidth;


    carousel.style.transform = `translateX(-${translateX}px)`;
    
    // --- NEW: Update the center card class ---
    Array.from(carousel.children).forEach(card => card.classList.remove('center-card'));

    // Add class to the new center card
    if (carousel.children[currentIndex]) {
        carousel.children[currentIndex].classList.add('center-card');
    }
    
    updateDots();
}

// Responsive dots: calculate dot count dynamically
function updateDots() {
    if (!carousel) return;
    const totalCards = carousel.children.length;
    let cardsPerView = getCardsPerView();
    let dotsContainer = document.getElementById('dots');
    
    let dotCount;

    if (window.innerWidth <= 660) {
        // Mobile: Dot count must be capped at 3
        dotCount = Math.min(totalCards, 3);
        // Note: The click events will still be limited by the maxIndex=2
    } else {
        // Desktop: Base number of slides available
        dotCount = Math.max(1, totalCards - cardsPerView + 1); 
    }

    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < dotCount; i++) {
        const dotEl = document.createElement('span');
        dotEl.classList.add('dot');
        if (i === currentIndex) dotEl.classList.add('active'); 
        
        dotEl.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dotEl);
    }
}

window.addEventListener('resize', () => {
    currentIndex = 0; 
    updateCarousel();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel(); 
});

// Hero Ring Swap Logic
const rings = [
    {
        elem: document.getElementById('ring-left'),
        getEl() { return this.elem; },
    },
    {
        elem: document.getElementById('ring-center'),
        getEl() { return this.elem; },
    },
    {
        elem: document.getElementById('ring-right'),
        getEl() { return this.elem; },
    }
];

function updateDetails() {
    // Always set the center ring's details
    const center = rings.find(r => r.elem.classList.contains('center')).getEl();
    document.getElementById('hero-title').textContent = center.dataset.title;
    document.getElementById('hero-price').textContent = '$' + center.dataset.price;
    document.querySelector('.hero-headline-bg').textContent = center.dataset.title;
}
updateDetails();

function swapRings(idx) {
    const centerRing = rings.find(r => r.elem.classList.contains('center'));
    const clickedRing = rings[idx];
    
    if (clickedRing === centerRing) return; 

    // Determine the position of the center ring (0 or 2)
    const centerIndex = rings.indexOf(centerRing);
    
    // Determine the position of the clicked ring
    const clickedIndex = rings.indexOf(clickedRing);

    // Swap position-based classes
    centerRing.elem.classList.remove('main', 'center');
    clickedRing.elem.classList.add('main', 'center');

    if (clickedRing.elem.classList.contains('left')) {
        centerRing.elem.classList.add('side', 'left');
        clickedRing.elem.classList.remove('side', 'left');
    } else { 
        centerRing.elem.classList.add('side', 'right');
        clickedRing.elem.classList.remove('side', 'right');
    }
    [rings[centerIndex], rings[clickedIndex]] = [rings[clickedIndex], rings[centerIndex]];
    
    updateDetails();
}

rings[0].getEl().onclick = () => swapRings(0);
rings[2].getEl().onclick = () => swapRings(2);
document.getElementById('ring-center').onclick = () => {}; 

updateDetails();