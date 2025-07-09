// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const yearElement = document.getElementById('year');
const typingText = document.querySelector('.typing-text');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const loadingScreen = document.querySelector('.loading-screen');

// Data
let activitiesData = []; // Renamed to avoid conflict with activity variable in render function
let courseCertificates = [];
let competitionCertificates = [];
let projects = [];
let skills = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    yearElement.textContent = new Date().getFullYear();

    // Show loading screen
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Initialize animations after loading
            initAnimations();
        }, 500);
    }, 1500);

    // Load data
    fetchData();

    // Initialize typing animation
    initTypingAnimation();

    // Initialize tab functionality
    initTabs();

    // Initialize event listeners
    initEventListeners();
});

// Fetch data from JSON
function fetchData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            activitiesData = data.activities; // Assign to activitiesData
            courseCertificates = data.certificates.filter(cert => cert.type === 'course');
            competitionCertificates = data.certificates.filter(cert => cert.type === 'competition');
            projects = data.projects;
            skills = data.skills;

            // Render data
            renderOrganizations(); // Renamed to better reflect content
            renderCertificates();
            renderProjects();
            renderSkills();
        })
        .catch(error => console.error('Error loading data:', error));
}

// Render organizations with accordion functionality
function renderOrganizations() {
    const organizationsGrid = document.getElementById('organizations-grid');
    organizationsGrid.innerHTML = ''; // Clear existing content

    // Group activities by organization
    const groupedOrganizations = {};
    activitiesData.forEach(activity => { // Use activitiesData here
        if (!groupedOrganizations[activity.organization]) {
            groupedOrganizations[activity.organization] = {
                name: activity.organization,
                period: activity.organizationPeriod,
                logo: activity.logo, // Mengambil properti logo dari data
                activities: []
            };
        }
        groupedOrganizations[activity.organization].activities.push(activity);
    });

    // Render organization cards with accordion
    Object.values(groupedOrganizations).forEach(org => {
        const orgCard = document.createElement('div');
        orgCard.className = 'organization-card';
        orgCard.innerHTML = `
            <div class="organization-header">
                <div class="organization-title-wrapper">
                    ${org.logo ? `<img src="${org.logo}" alt="Logo ${org.name}" class="organization-logo">` : ''}
                    <h3 class="organization-title">${org.name}</h3>
                </div>
                <span class="organization-period">${org.period}</span>
                <i class="fas fa-chevron-down chevron"></i>
            </div>
            <div class="organization-content">
                ${org.activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-date">
                            <span>${activity.date}</span>
                        </div>
                        <div class="activity-details">
                            <h4 class="activity-name">${activity.title}</h4>
                            <p class="activity-description">${activity.description}</p>
                            ${activity.images && activity.images.length > 0 ? `
                                <div class="activity-gallery">
                                    ${activity.images.map((img, index) => `
                                        <div class="gallery-item" data-caption="${activity.title} - Photo ${index + 1}">
                                            <img src="assets/images/${img}" alt="${activity.title}">
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        organizationsGrid.appendChild(orgCard);

        // Add click event to toggle organization content
        const header = orgCard.querySelector('.organization-header');
        const content = orgCard.querySelector('.organization-content');

        header.addEventListener('click', () => {
            const isActive = orgCard.classList.contains('active');

            // Close all other open accordions
            document.querySelectorAll('.organization-card.active').forEach(openCard => {
                if (openCard !== orgCard) {
                    openCard.classList.remove('active');
                    gsap.to(openCard.querySelector('.organization-content'), { maxHeight: 0, duration: 0.5, ease: "power2.out" });
                }
            });

            // Toggle current accordion
            orgCard.classList.toggle('active');
            if (orgCard.classList.contains('active')) {
                gsap.to(content, { maxHeight: content.scrollHeight, duration: 0.5, ease: "power2.inOut" });
            } else {
                gsap.to(content, { maxHeight: 0, duration: 0.5, ease: "power2.out" });
            }
        });
    });

    // Initialize gallery modal after activities are rendered
    initGalleryModal();
}


// Render certificates
function renderCertificates() {
    const courseGrid = document.getElementById('course-grid');
    const competitionGrid = document.getElementById('competition-grid');

    courseGrid.innerHTML = ''; // Clear existing
    competitionGrid.innerHTML = ''; // Clear existing
    
    courseCertificates.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.className = 'certificate-card';
        certCard.innerHTML = `
            <div class="certificate-img-container">
                <img src="assets/images/${cert.image}" alt="${cert.title}" class="certificate-img">
            </div>
            <div class="certificate-content">
                <h3 class="certificate-title">${cert.title}</h3>
                <span class="certificate-issuer">${cert.issuer}</span>
                <span class="certificate-date">Completed: ${cert.date}</span>
            </div>
        `;
        courseGrid.appendChild(certCard);
    });

    competitionCertificates.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.className = 'certificate-card';
        certCard.innerHTML = `
            <div class="certificate-img-container">
                <img src="assets/images/${cert.image}" alt="${cert.title}" class="certificate-img">
            </div>
            <div class="certificate-content">
                <h3 class="certificate-title">${cert.title}</h3>
                <span class="certificate-issuer">${cert.issuer}</span>
                <span class="certificate-date">${cert.date}</span>
                <span class="certificate-achievement">${cert.achievement}</span>
            </div>
        `;
        competitionGrid.appendChild(certCard);
    });
}

// Render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = ''; // Clear existing
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        let mediaContent = '';
        if (project.mediaType === 'image') {
            mediaContent = `<img src="assets/images/${project.media}" alt="${project.title}" class="project-img">`;
        } else if (project.mediaType === 'video') {
            // Ensure YouTube embed URL is correct
            const embedUrl = project.media.includes("youtube.com/embed/") ? project.media : `https://www.youtube.com/embed/$${project.media.split('v=')[1] || project.media}`;
            mediaContent = `
                <iframe 
                    class="project-video" 
                    src="${embedUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        }
        
        let codePreview = '';
        if (project.code && project.code.content) {
            codePreview = `
                <div class="code-preview">
                    <div class="code-header">
                        <div class="code-filename">
                            <i class="fas fa-file-code"></i>
                            <span>${project.code.filename}</span>
                        </div>
                        <span class="code-date">${project.code.date}</span>
                    </div>
                    <pre class="code-content"><code>${escapeHTML(project.code.content)}</code></pre>
                </div>
            `;
        }
        
        projectCard.innerHTML = `
            <div class="project-media">
                ${mediaContent}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i> View Code</a>` : ''}
                </div>
                ${codePreview}
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Helper to escape HTML for code snippets
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}


// Render skills
function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = ''; // Clear existing
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill';
        skillElement.textContent = skill;
        skillsContainer.appendChild(skillElement);
    });
}

// Initialize typing animation
function initTypingAnimation() {
    const texts = [
        "I'm Maulana Abdul Fathah, an Information Technology student at Universitas Pembangunan Panca Budi Medan.",
        "I'm deeply passionate about penetration testing and Red Team operations.",
        "With experience in both frontend and backend technologies, I build secure and efficient digital solutions."
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000); // Pause at end of text
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length; // Move to next text
            setTimeout(type, 500); // Pause before typing next text
        } else {
            const speed = isDeleting ? 50 : 100;
            setTimeout(type, speed);
        }
    }
    
    if (typingText) {
        setTimeout(type, 1000);
    }
}

// Initialize tabs
function initTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding panel
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });
}

// Initialize gallery modal
function initGalleryModal() {
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.querySelector('.modal-caption');
    const closeBtn = document.querySelector('.modal-close');
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore body scroll
    });
    
    // Close when clicking outside image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore body scroll
        }
    });
    
    // Add click events to all gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            modalImg.src = item.querySelector('img').src;
            modalCaption.textContent = item.getAttribute('data-caption') || '';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when modal is open
        });
    });
}

// Initialize animations
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#00e676" }, /* primary-color */
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#00e676", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
    
    // Hero section animations
    gsap.from('.hero-content', {
        duration: 1.5,
        y: 80,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.hero-image', {
        duration: 1.5,
        y: 80,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.5
    });
    
    // Note: The ::after pseudo-element can't be directly animated by GSAP.
    // If you want to animate the underline, you'd need a separate element for it
    // or use CSS transitions triggered by JS classes.
    // For now, removing the GSAP animation for hero-title span::after.
    
    // Floating shapes animation
    gsap.to('.shape-1', {
        y: 30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    gsap.to('.shape-2', {
        y: -40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2
    });
    
    gsap.to('.shape-3', {
        x: 30,
        y: 20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
    });
    
    gsap.to('.shape-4', {
        x: -20,
        y: -20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 3
    });
    
    // Section animations
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Organization cards animation (adjusting for accordion)
    // We will animate the card itself, the content animation is handled by toggle logic
    gsap.utils.toArray('.organization-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1
        });
    });
    
    // Certificate cards animation
    gsap.utils.toArray('.certificate-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1
        });
    });
    
    // Project cards animation
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1
        });
    });
}

// Initialize event listeners
function initEventListeners() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
}