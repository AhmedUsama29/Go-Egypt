import { Component ,OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit, AfterViewInit{

  ngOnInit(): void {
    console.log('🏺 Welcome to Go Egypt! 🏺');
  }

  ngAfterViewInit(): void {
    // Smooth scrolling
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        const targetElement = targetId ? document.getElementById(targetId) : null;
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Fade in animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elementsToAnimate = document.querySelectorAll('.team-member, .feature-icon, h2, .story-image');
    elementsToAnimate.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });

    // Play button
    const playButton = document.querySelector<HTMLElement>('.play-button');
    if (playButton) {
      playButton.addEventListener('click', () => {
        alert('Video player would open here');
      });
    }

    // Team hover
    const teamMembers = document.querySelectorAll<HTMLElement>('.team-member');
    teamMembers.forEach(member => {
      member.addEventListener('mouseenter', () => {
        member.style.transform = 'translateY(-10px)';
        member.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      });
      member.addEventListener('mouseleave', () => {
        member.style.transform = 'translateY(0)';
        member.style.boxShadow = 'none';
      });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector<HTMLElement>('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.backgroundColor = 'rgba(248, 249, 250, 0.95)';
          navbar.style.backdropFilter = 'blur(10px)';
        } else {
          navbar.style.backgroundColor = '';
          navbar.style.backdropFilter = '';
        }
      }
    });

    // Social icons hover
    const socialIcons = document.querySelectorAll<HTMLElement>('.social-icons i');
    socialIcons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.3) rotate(10deg)';
      });
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      });
    });

    // Buttons ripple effect
    const buttons = document.querySelectorAll<HTMLElement>('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', e => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = (e as MouseEvent).clientX - rect.left - size / 2;
        const y = (e as MouseEvent).clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Lazy loading
    const images = document.querySelectorAll<HTMLImageElement>('img[src*="placeholder"]');
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.style.opacity = '0.5';
          setTimeout(() => {
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
          }, 200);
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));

    // Error handling for images
    const allImages = document.querySelectorAll<HTMLImageElement>('img');
    allImages.forEach(img => {
      img.addEventListener('error', () => {
        img.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Image+Not+Found';
        img.alt = 'Image not available';
      });
    });
  }

  // Utility functions
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navbarCollapse?.classList.toggle('show');
  }
}
