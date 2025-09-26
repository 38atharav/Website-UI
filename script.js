// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelector('.items');
    const menuToggle = document.querySelector('.nav-menu-toggle');

    menuToggle.addEventListener('click', () => {
        navItems.classList.toggle('active');
        // Toggle icon between menu and close
        if (navItems.classList.contains('active')) {
            menuToggle.classList.remove('ri-menu-3-line');
            menuToggle.classList.add('ri-close-line');
        } else {
            menuToggle.classList.remove('ri-close-line');
            menuToggle.classList.add('ri-menu-3-line');
        }
    });

    // Close menu when a link is clicked (optional)
    navItems.querySelectorAll('h4').forEach(item => {
        item.addEventListener('click', () => {
            navItems.classList.remove('active');
            menuToggle.classList.remove('ri-close-line');
            menuToggle.classList.add('ri-menu-3-line');
        });
    });
});

// Carousel Logic
const carousel = document.getElementById('carousel');
let currentIndex = 0;

// Function to calculate the number of cards visible based on screen width
function getCardsPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 992) {
        return 5;
    } else if (screenWidth > 600) {
        return 4;
    } else if (screenWidth > 400) {
        return 3;
    } else {
        return 2;
    }
}

function updateCarousel() {
    // Get the actual width of a card (including margin/gap)
    const firstCard = carousel.children[0];
    if (!firstCard) return;
    
    // Get the calculated style for 'min-width' and 'gap'
    const style = window.getComputedStyle(firstCard);
    const cardWidth = parseFloat(style.minWidth); // 160px from CSS (desktop)
    const carouselStyle = window.getComputedStyle(carousel);
    const gap = parseFloat(carouselStyle.gap); // 24px from CSS (desktop)
    const totalCardWidth = cardWidth + gap;

    // Ensure currentIndex is within bounds
    const totalCards = carousel.children.length;
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    currentIndex = Math.min(currentIndex, maxIndex);

    carousel.style.transform = `translateX(-${currentIndex * totalCardWidth}px)`;
    
    // Update dots after carousel moves
    updateDots();
}

// Responsive dots: calculate dot count dynamically
function updateDots() {
    const totalCards = carousel.children.length;
    const cardsPerView = getCardsPerView();
    const dotCount = Math.max(1, totalCards - cardsPerView + 1);
    const dotsContainer = document.getElementById('dots');
    
    // Clear existing dots
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
    // Reset index to 0 on resize to prevent being stuck out of view
    currentIndex = 0; 
    updateCarousel();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel(); // Calls updateDots internally
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
    
    if (clickedRing === centerRing) return; // Don't swap on center click

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
    } else { // must be right
        centerRing.elem.classList.add('side', 'right');
        clickedRing.elem.classList.remove('side', 'right');
    }
    
    // Swap the elements in the rings array *references*
    [rings[centerIndex], rings[clickedIndex]] = [rings[clickedIndex], rings[centerIndex]];
    
    updateDetails();
}

rings[0].getEl().onclick = () => swapRings(0);
rings[2].getEl().onclick = () => swapRings(2);
// The center ring should be rings[1] *after* the initial DOM structure, 
// so this should be rings[1].getEl().onclick = () => {}; 
// but it is safer to find the one with the center class
document.getElementById('ring-center').onclick = () => {}; 

updateDetails();