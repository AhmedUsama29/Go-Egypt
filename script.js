// Custom JavaScript for Go Egypt About Page

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const elementsToAnimate = document.querySelectorAll('.team-member, .feature-icon, h2, .story-image');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Play button click handler
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Add your video play logic here
            alert('Video player would open here');
        });
    }

    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    // Add your search logic here
                    console.log('Searching for:', searchTerm);
                    alert(`Searching for: ${searchTerm}`);
                }
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(248, 249, 250, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });

    // Social icons hover effect
    const socialIcons = document.querySelectorAll('.social-icons i');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Button click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Console welcome message
    console.log('%c🏺 Welcome to Go Egypt! 🏺', 'color: #ffc107; font-size: 20px; font-weight: bold;');
    console.log('%cExplore the wonders of ancient and modern Egypt with us!', 'color: #2c3e50; font-size: 14px;');
});

// Utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navbarCollapse.classList.toggle('show');
}

// Export functions for global use
window.GoEgypt = {
    scrollToTop,
    toggleMobileMenu
};

// Additional functionality

// Enhanced search with suggestions
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const suggestions = [
            'Cairo', 'Giza Pyramids', 'Luxor', 'Aswan', 'Alexandria',
            'Red Sea', 'Sinai', 'Valley of Kings', 'Abu Simbel', 'Karnak Temple'
        ];
        
        searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length > 2) {
                const matches = suggestions.filter(item => 
                    item.toLowerCase().includes(value)
                );
                // You can implement dropdown suggestions here
                console.log('Search suggestions:', matches);
            }
        });
    }
}

// Team member modal functionality
function initializeTeamModals() {
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const name = this.querySelector('h5').textContent;
            const position = this.querySelector('p').textContent;
            
            // Create modal content (you can expand this)
            const modalContent = `
                <div class="modal fade" id="teamModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${name}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p><strong>Position:</strong> ${position}</p>
                                <p>More details about ${name} would go here...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Remove existing modal if any
            const existingModal = document.getElementById('teamModal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Add new modal
            document.body.insertAdjacentHTML('beforeend', modalContent);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('teamModal'));
            modal.show();
        });
    });
}

// Performance optimization - lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[src*="placeholder"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add loading animation
                img.style.opacity = '0.5';
                
                // Simulate loading delay
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                }, 200);
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeTeamModals();
    initializeLazyLoading();
    
    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        console.log('🎉 Go Egypt About page fully loaded!');
    });
});

// Error handling for missing images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Image+Not+Found';
            this.alt = 'Image not available';
        });
    });
});

// Accessibility improvements
function enhanceAccessibility() {
    // Add keyboard navigation for team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.setAttribute('tabindex', '0');
        member.setAttribute('role', 'button');
        member.setAttribute('aria-label', `View details for ${member.querySelector('h5').textContent}`);
        
        member.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);