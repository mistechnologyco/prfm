// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Optimized navbar scroll with throttling
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(14, 14, 14, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(14, 14, 14, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Parfüm Sprey Animasyonu
class PerfumeSprayEffect {
    constructor() {
        this.canvas = document.getElementById('heatMapCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.sprayParticles = [];
        this.lastMouseMove = 0;
        this.mouseMoveThrottle = 30;
        this.isAnimating = false;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.setupEventListeners();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Mouse hareketiyle parfüm spreyi
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - this.lastMouseMove > this.mouseMoveThrottle) {
                this.createSprayBurst(e.clientX, e.clientY, 'move');
                this.lastMouseMove = now;
            }
        });
        
        // Tıklamayla büyük sprey patlaması
        document.addEventListener('click', (e) => {
            this.createSprayBurst(e.clientX, e.clientY, 'click');
        });
    }
    
    createSprayBurst(x, y, type = 'move') {
        const particleCount = type === 'click' ? 15 : 8;
        const baseSize = type === 'click' ? 3 : 2;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = type === 'click' ? 2 + Math.random() * 3 : 1 + Math.random() * 2;
            const size = baseSize + Math.random() * 2;
            
            this.sprayParticles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - Math.random() * 2, // Yukarı doğru drift
                size: size,
                maxSize: size,
                life: 1.0,
                decay: 0.008 + Math.random() * 0.005,
                opacity: 0.8 + Math.random() * 0.2, // Artırıldı: 0.6 + 0.4 → 0.8 + 0.2
                color: this.getSprayColor()
            });
        }
        
        // Partikül limitini koru
        if (this.sprayParticles.length > 200) {
            this.sprayParticles.splice(0, 50);
        }
        
        if (!this.isAnimating) {
            this.startAnimation();
        }
    }
    
    getSprayColor() {
        // Parfüm spreyi renkleri - daha parlak beyaz/gümüş tonları
        const colors = [
            { r: 255, g: 255, b: 255 }, // Parlak beyaz
            { r: 255, g: 250, b: 255 }, // Parlak beyaz-mor
            { r: 250, g: 250, b: 255 }, // Parlak beyaz-mavi
            { r: 245, g: 245, b: 250 }  // Parlak gümüş
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    startAnimation() {
        this.isAnimating = true;
        this.animate();
    }
    
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    updateParticles() {
        for (let i = this.sprayParticles.length - 1; i >= 0; i--) {
            const particle = this.sprayParticles[i];
            
            // Hareket
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Gravity ve air resistance
            particle.vy += 0.05; // Hafif yerçekimi
            particle.vx *= 0.98; // Hava direnci
            particle.vy *= 0.98;
            
            // Boyut değişimi (yayılma)
            particle.size += 0.1;
            
            // Yaşam döngüsü
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.sprayParticles.splice(i, 1);
            }
        }
        
        if (this.sprayParticles.length === 0) {
            this.stopAnimation();
        }
    }
    
    drawSpray() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.sprayParticles.forEach(particle => {
            if (particle.life <= 0) return;
            
            const alpha = particle.life * particle.opacity * 0.6; // Artırıldı: 0.3 → 0.6
            
            // Gradient ile parfüm damlası efekti - daha parlak
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            
            gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.8})`); // Daha parlak orta
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.updateParticles();
        this.drawSpray();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Parfüm sprey efektini başlat
new PerfumeSprayEffect();

// Ultra-efficient lazy loading for product cards
const productObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            
            // Add optimized hover effects only when visible
            let hoverTimeout;
            card.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                this.style.transform = 'translateY(-3px)';
            });
            
            card.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    this.style.transform = 'translateY(0)';
                }, 50);
            });
            
            // Optimized click handler
            card.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-to-cart')) {
                    return;
                }
                
                const productUrl = this.dataset.productUrl;
                if (productUrl) {
                    window.open(productUrl, '_blank');
                }
            });
            
            // Stop observing this card
            productObserver.unobserve(card);
        }
    });
}, { 
    threshold: 0.05, // Reduced threshold
    rootMargin: '50px' // Load earlier
});

// Observe all product cards
document.querySelectorAll('.product-card').forEach(card => {
    productObserver.observe(card);
});

// Performance-optimized scroll animations
const observerOptions = {
    threshold: 0.05, // Reduced threshold
    rootMargin: '0px 0px -30px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target); // Stop observing after animation
        }
    });
}, observerOptions);

// Observe elements for scroll animations with reduced set
document.querySelectorAll('.feature, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)'; // Reduced movement
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease'; // Faster transition
    scrollObserver.observe(el);
});

// Separate observer for product cards with different settings
const productScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            productScrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.02, rootMargin: '100px' });

// Only animate visible product cards
document.querySelectorAll('.product-card').forEach((el, index) => {
    if (index < 12) { // Only first 12 cards get animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        productScrollObserver.observe(el);
    }
});

// CTA button interaction
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#products').scrollIntoView({
        behavior: 'smooth'
    });
});

// Clickable title functionality - "Öne Çıkan Ürünler" başlığı
document.addEventListener('DOMContentLoaded', function() {
    const clickableTitle = document.querySelector('.clickable-title');
    if (clickableTitle) {
        clickableTitle.addEventListener('click', function() {
            window.open('products.html', '_blank');
        });
        
        // Görsel geri bildirim için
        clickableTitle.style.cursor = 'pointer';
        clickableTitle.title = 'Tüm ürünleri yeni sekmede görüntüle';
    }
});

// Optimized quick view functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-view')) {
        e.stopPropagation();
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(14, 14, 14, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(14, 14, 14, 0.9);
            border: 1px solid rgba(164, 162, 162, 0.2);
            padding: 3rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            backdrop-filter: blur(20px);
        `;
        
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productUrl = productCard.dataset.productUrl;
        
        modalContent.innerHTML = `
            <h2 style="font-family: 'Playfair Display', serif; margin-bottom: 2rem; color: #A4A2A2; font-weight: 300; font-size: 2rem;">${productName}</h2>
            <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #5B5A5A, #A4A2A2); margin: 0 auto 2rem; border: 1px solid rgba(164, 162, 162, 0.2);"></div>
            <p style="color: #5B5A5A; margin-bottom: 2rem; line-height: 1.6;">Premium parfüm koleksiyonumuzdan özenle seçilmiş bu ürün, benzersiz notaları ile sizi büyüleyecek.</p>
            <p style="font-size: 1.5rem; font-weight: 300; color: #A4A2A2; margin-bottom: 2rem; font-family: 'Inter', sans-serif;">${productPrice}</p>
            <a href="${productUrl}" target="_blank" style="background: transparent; color: #A4A2A2; border: 1px solid #A4A2A2; padding: 1rem 2rem; font-weight: 400; cursor: pointer; margin-right: 1rem; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; display: inline-block;">Ürüne Git</a>
            <button class="close-modal" style="background: transparent; color: #5B5A5A; border: 1px solid #5B5A5A; padding: 1rem 2rem; font-weight: 400; cursor: pointer; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">Kapat</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                closeModal();
            }
        });
    }
});

// Ultra-smooth mouse movement effects
let mouseMoveTimeout;
let lastMouseMoveTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseMoveTime < 8) return; // Very frequent updates
    
    lastMouseMoveTime = now;
    
    if (mouseMoveTimeout) return;
    
    mouseMoveTimeout = setTimeout(() => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const luxuryOverlay = document.querySelector('.luxury-overlay');
        if (luxuryOverlay) {
            luxuryOverlay.style.transform = `translate(${(mouseX - 0.5) * 1}px, ${(mouseY - 0.5) * 1}px)`;
        }
        mouseMoveTimeout = null;
    }, 8); // Ultra-smooth at ~120fps
});

console.log('parfumes of t. - Optimized premium design loaded ✨');

// Ultra-efficient auto-update for product images with lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const productImages = {
        "42777677": "https://cdn.shopier.app/pictures_mid/perfumesoft_a418b0575027f72d39a36ae0aec4b60a.jpeg",
        "42765289": "https://cdn.shopier.app/pictures_mid/perfumesoft_ecac25131f9be1bf1eef6dd4dc6ea414.webp",
        "42765157": "https://cdn.shopier.app/pictures_mid/perfumesoft_a4b4ff0db5f2256f4c9061b33ad85f39.webp",
        "42764461": "https://cdn.shopier.app/pictures_mid/perfumesoft_1a4607f8a65037811bd877c7cf15ad7f.webp",
        "42764195": "https://cdn.shopier.app/pictures_mid/perfumesoft_763ebb79e0a44ea570d86bdc3f0d46a9.jpeg",
        "42763936": "https://cdn.shopier.app/pictures_mid/perfumesoft_ddfa03f7a934d7b6b61c88705c9cb9bb.webp",
        "42763675": "https://cdn.shopier.app/pictures_mid/perfumesoft_584cbbc87a3149d7adf793cfbeb57a97.webp",
        "42763519": "https://cdn.shopier.app/pictures_mid/perfumesoft_fce7d91003424911f88c63591668fc5a.jpg",
        "42763338": "https://cdn.shopier.app/pictures_mid/perfumesoft_ee842e4d77270d4650036275e800039c.jpg",
        "42760095": "https://cdn.shopier.app/pictures_mid/perfumesoft_2b9de7e625a97cdf7a1575877afb1c00.jpeg",
        "42760014": "https://cdn.shopier.app/pictures_mid/perfumesoft_48a208dee2b47829f53a8b778cb6069f.jpg",
        "42482966": "https://cdn.shopier.app/pictures_mid/perfumesoft_967a456fe0d15dcf301b6283664b365c.png",
        "42482959": "https://cdn.shopier.app/pictures_mid/perfumesoft_5d8b527a53561bed65bc89dee2cf7eef.jpg",
        "42482933": "https://cdn.shopier.app/pictures_mid/perfumesoft_512cf00309f18166a27dc24c5da3fc5d.jpg",
        "42482909": "https://cdn.shopier.app/pictures_mid/perfumesoft_06157c95427557d27fe460da39f0239e.png",
        "42482885": "https://cdn.shopier.app/pictures_mid/perfumesoft_563af00986ab9d5705c189b0a352224f.png",
        "42482859": "https://cdn.shopier.app/pictures_mid/perfumesoft_0733acde6b7dc91ef418a36f929cedff.png",
        "42482824": "https://cdn.shopier.app/pictures_mid/perfumesoft_f58182734620603cf10bd52168846c99.png",
        "42482808": "https://cdn.shopier.app/pictures_mid/perfumesoft_ddb66b7f094755326c63dc59b241abc9.png",
        "42482776": "https://cdn.shopier.app/pictures_mid/perfumesoft_282cd08ac4ad6ecfaf1b92df2f87bd9d.png",
        "42482301": "https://cdn.shopier.app/pictures_mid/perfumesoft_a5d326eb7eb312c06ac0a02fd44a9b5b.webp",
        "42482284": "https://cdn.shopier.app/pictures_mid/perfumesoft_0735a79203f33e046980061dfe2f9c21.png",
        "42482106": "https://cdn.shopier.app/pictures_mid/perfumesoft_beba9b091a42e2cf093dc49ac556e013.webp",
        "42482073": "https://cdn.shopier.app/pictures_mid/perfumesoft_074791c7c5ecad7d33538c4da1561034.webp",
        "42482022": "https://cdn.shopier.app/pictures_mid/perfumesoft_69dcc6f075ae137cf1d6f315be2983fd.webp",
        "42481869": "https://cdn.shopier.app/pictures_mid/perfumesoft_b0df2af1bab189891dba4c814fbbed87.webp",
        "42481739": "https://cdn.shopier.app/pictures_mid/perfumesoft_7e67170cf6919b6a1baa27d9085f9b9d.jpg",
        "42481670": "https://cdn.shopier.app/pictures_mid/perfumesoft_ab5b81fd0d10baad124343445630e1d1.jpg",
        "42481624": "https://cdn.shopier.app/pictures_mid/perfumesoft_d7b02036afe8a0f4d6953f64c67f514d.png",
        "42481419": "https://cdn.shopier.app/pictures_mid/perfumesoft_3dede2acf2fd538f96c1d121b0062fa0.webp",
        "42478077": "https://cdn.shopier.app/pictures_mid/perfumesoft_5cc78373f3ebe376ddae8b73a6b0d9fa.webp",
        "42477723": "https://cdn.shopier.app/pictures_mid/perfumesoft_26e1664c1bdce1654ce9cfbc02d08031.webp",
        "42449185": "https://cdn.shopier.app/pictures_mid/perfumesoft_d0129a0d5df2c048f452a81a23afcfc0.jpg",
        "42449157": "https://cdn.shopier.app/pictures_mid/perfumesoft_dda8e6a64adc5f10c6da58277be9891a.webp",
        "42449121": "https://cdn.shopier.app/pictures_mid/perfumesoft_62910c64874e1f5b514d88c17bcf60e8.png",
        "42449110": "https://cdn.shopier.app/pictures_mid/perfumesoft_15b49548241e9664ee873429ff045724.png",
        "42449095": "https://cdn.shopier.app/pictures_mid/perfumesoft_d1ab13ccba0f90bfed67d0f6ed2d8051.png",
        "42449039": "https://cdn.shopier.app/pictures_mid/perfumesoft_503e4f4aa7c4606791530a76b56fcdf7.png",
        "42448903": "https://cdn.shopier.app/pictures_mid/perfumesoft_09fbc2f18c4a6735fc4ded780ab378c4.png"
    };

    // Lazy load images only when cards are visible
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const url = card.dataset.productUrl;
                
                if (url) {
                    const productId = url.split('/').pop();
                    const imageUrl = productImages[productId];
                    
                    if (imageUrl) {
                        const productImage = card.querySelector('.product-image');
                        if (productImage && !productImage.style.backgroundImage) {
                            // Preload image before setting
                            const img = new Image();
                            img.onload = () => {
                                productImage.style.backgroundImage = `url('${imageUrl}')`;
                            };
                            img.src = imageUrl;
                        }
                    }
                }
                
                imageObserver.unobserve(card);
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    // Observe all product cards for image loading
    document.querySelectorAll('.product-card').forEach(card => {
        imageObserver.observe(card);
    });
});

// Gender filter on products page via URL hash (#kadin / #erkek)
document.addEventListener('DOMContentLoaded', function() {
    const productsPage = document.querySelector('.products-page');
    if (!productsPage) return;

    const hash = window.location.hash;
    if (hash !== '#kadin' && hash !== '#erkek') return;

    const gender = hash.replace('#', '');
    document.querySelectorAll('.products-grid .product-card').forEach(card => {
        const cardGender = card.dataset.gender;
        card.style.display = cardGender === gender ? '' : 'none';
    });
});