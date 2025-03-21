// Menu functionality for the travel blog
document.addEventListener('DOMContentLoaded', function() {
    // Track page visibility to handle tab switching
    let pageVisible = true;
    
    // Add visibility change detection
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pageVisible = false;
            console.log('Page hidden, slideshow paused');
            // We don't stop the slideshow here, just track visibility
        } else {
            pageVisible = true;
            console.log('Page visible again, ensuring slideshow is running');
            // Restart slideshow in all carousel instances
            const carouselTracks = document.querySelectorAll('.hero-carousel-track');
            if (carouselTracks.length > 0) {
                setupHeroCarousel();
            }
        }
    });
    
    // Hero Carousel Setup
    setupHeroCarousel();
    
    // Rest of the code...
    
    // Setup all other features
    setupMenuAndUI();
    
    // Handle form submissions
    setupFormSubmissions();

    loadCarouselData();
});

// Make sure carousel and menu are set up even if DOMContentLoaded has issues
window.addEventListener('load', function() {
    const carouselTrack = document.getElementById('carouselTrack');
    // Check if carousel was already set up during DOMContentLoaded
    if (carouselTrack && carouselTrack.children.length === 0) {
        console.log('Fallback: Setting up carousel on window.load');
        setupHeroCarousel();
    }
    
    // Ensure menu is set up correctly regardless of how page was loaded
    const menuButton = document.getElementById('nav-part1');
    if (menuButton) {
        // If setupMenuAndUI hasn't been called yet, or we need to reinitialize
        setupMenuAndUI();
    }
});

// Hero Carousel Setup Function
function setupHeroCarousel() {
    // Carousel data with images and their associated content
    const localCarouselItems = [
        {
            image: '../images/photo-1739606944848-97662c0430f0 (1).avif',
            title: 'Manali & Kashmir - ₹16,999',
            heading: 'Explore the Paradise ',
            subheading: 'Experience the serene beauty of north India',
            tags: ['Mountains', 'Nature', 'Adventure']
        },
        {
            image: '../images/photo-1590001155093-a3c66ab0c3ff.avif',
            title: 'Maldives - ₹65,999',
            heading: 'Discover Hidden Gems',
            subheading: 'Sun-kissed beaches await you',
            tags: ['Beach', 'Luxury', 'Island']
        },
        {
            image: '../images/premium_photo-1661929242720-140374d97c94.avif',
            title: 'Thailand - ₹31,999',
            heading: 'Explore Exotic Thailand',
            subheading: 'Experience vibrant culture and pristine beaches',
            tags: ['Culture', 'Beach', 'Adventure']
        },
        {
            image: '../images/photo-1510414842594-a61c69b5ae57.avif',
            title: 'Dubai - ₹49,999',
            heading: 'Luxury in the Desert',
            subheading: 'Experience modern marvels and traditional charm',
            tags: ['Luxury', 'Shopping', 'Adventure']
        }
    ];

    const carouselTrack = document.getElementById('carouselTrack');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const slideTemplate = document.getElementById('slide-template');
    
    if (!carouselTrack || !indicatorsContainer) {
        console.error('Carousel elements not found');
        return;
    }
    
    // Clear existing content
    carouselTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Create slides using the template
    localCarouselItems.forEach((item, index) => {
        // Create a new element from the template
        const slide = document.createElement('div');
        slide.className = 'hero-carousel-slide fade';
        slide.style.backgroundImage = `url('${item.image}')`;
        slide.style.display = 'none'; // Hide all slides initially
        
        // Create the content structure
        const content = `
            <div class="numbertext">${index + 1} / ${localCarouselItems.length}</div>
            <div class="hero-content">
               <h1>${item.heading}</h1>
                <h4>${item.subheading}</h4>
                <div class="card-content-white-bg">

                     <div class="card-title">${item.title}</div>
                
               
                   <div class="card-tags"></div>
                    <div class="read-more">→</div>
                </div>
            </div>
             <div class="hero-highlight">
                <h3>Book Your Seats Now                        </h3>
               
                <button class="cta-btn">Book now</button>
            </div>
           
        `;
        
        slide.innerHTML = content;
        
        // Add tags
        const tagsContainer = slide.querySelector('.card-tags');
        item.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });
        
        // Add the slide to the carousel
        carouselTrack.appendChild(slide);
        
        // Create indicator dot
        const indicator = document.createElement('span');
        indicator.className = 'hero-carousel-indicator';
        indicator.dataset.slideIndex = index;
        indicatorsContainer.appendChild(indicator);
    });
    
    // Add CSS for fade animation
    if (!document.getElementById('fade-animation-style')) {
        const fadeStyle = document.createElement('style');
        fadeStyle.id = 'fade-animation-style';
        fadeStyle.textContent = `
            @keyframes fade {
                from {opacity: 0.4}
                to {opacity: 1}
            }
            
            .fade {
                animation-name: fade;
                animation-duration: 1.5s;
            }
        `;
        document.head.appendChild(fadeStyle);
    }
    
    // Get all carousel elements
    const slides = carouselTrack.querySelectorAll('.hero-carousel-slide');
    const dots = indicatorsContainer.querySelectorAll('.hero-carousel-indicator');
    const prevButton = document.querySelector('.hero-carousel-nav.prev');
    const nextButton = document.querySelector('.hero-carousel-nav.next');
    const carouselContainer = document.querySelector('.hero-carousel-container');
    
    if (slides.length === 0) {
        console.error('No slides found');
        return;
    }
    
    // Global variables for slideshow control
    let slideIndex = 0;
    let slideInterval = null;
    
    // Function to show a specific slide
    function showSlide(n) {
        const slides = document.querySelectorAll('.hero-carousel-slide');
        const indicators = document.querySelectorAll('.hero-carousel-indicator');
        
        if (slides.length === 0) return;
        
        // Wrap around if we go beyond bounds
        if (n > slides.length) {
            slideIndex = 1;
        } else if (n < 1) {
            slideIndex = slides.length;
        } else {
            slideIndex = n;
        }
        
        console.log(`Showing slide ${slideIndex} of ${localCarouselItems.length}`);
        
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show the current slide and activate its indicator
        slides[slideIndex - 1].style.display = 'block';
        if (indicators[slideIndex - 1]) {
            indicators[slideIndex - 1].classList.add('active');
        }
    }
    
    // Start the automatic slideshow
    function startSlideshow() {
        // Clear any existing interval first
        stopSlideshow();
        
        // Set the slide interval
        slideInterval = setInterval(function() {
            slideIndex++;
            
            // Ensure we loop back to the first slide after the last one
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            
            showSlide(slideIndex);
            console.log('Auto-advancing to slide:', slideIndex + 1);
        }, 2000); // Use 2000ms (2 seconds) for better user experience
        
        console.log('Slideshow interval started with ID:', slideInterval);
    }
    
    // Function to stop the slideshow
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Initialize the first slide and ensure it's visible
    showSlide(0);
    
    // Make sure our first slide is actually visible
    slides[0].style.display = "block";
    dots[0].classList.add("active");
    
    // Force the slideshow to start after a small delay to ensure DOM is ready
    window.setTimeout(function() {
        startSlideshow();
        console.log('Forced slideshow start after timeout');
        
        // Test the slideshow is working by advancing to next slide after 2 seconds
        window.setTimeout(function() {
            if (slideIndex === 0) {
                // If still on first slide after 2 seconds, force advance to next slide
                slideIndex++;
                showSlide(slideIndex);
                console.log('Forced first slide change');
            }
        }, 2000);
    }, 500);
    
    // Previous button click handler
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            stopSlideshow();
            showSlide(slideIndex - 1);
            startSlideshow();
        });
    }
    
    // Next button click handler
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            stopSlideshow();
            showSlide(slideIndex + 1);
            startSlideshow();
        });
    }
    
    // Indicator dots click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlideshow();
            showSlide(index + 1);
            startSlideshow();
        });
    });
    
    // Pause slideshow on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopSlideshow);
        
        // Resume slideshow when mouse leaves
        carouselContainer.addEventListener('mouseleave', startSlideshow);
    }
    
    // Debug info
    console.log('Slideshow initialized with ' + slides.length + ' slides');
}

/**
 * Setup navigation menu and UI elements
 */
function setupMenuAndUI() {
    // Get the menu button and containers
    const menuButton = document.getElementById('nav-part1');
    const desktopMenu = document.getElementById('nav-part3');
    
    // Remove any existing dropdown menus to prevent duplication
    const existingMenus = document.querySelectorAll('.dropdown-menu');
    existingMenus.forEach(menu => menu.remove());
    
    // Create mobile dropdown menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'dropdown-menu-js';
    mobileMenu.style.display = 'none';
    
    // Define common menu structure for both mobile and desktop
    const menuItems = [
        { type: 'link', text: 'Home', url: '/', icon: 'bx bxs-home-alt-2' },
        { type: 'link', text: 'About Us', url: '/aboutus', icon: 'bx bxs-invader' },
        { 
            type: 'dropdown', 
            text: 'Our Services', 
            id: 'ourservices',
            icon: 'bx bxs-invader',
            items: [
                { text: 'Flight Tickets', url: '/Flight Tickets', icon: 'bx bxs-plane-alt' },
                { text: 'Apply For Passport Application', url: '/Apply For Passport Application', icon: 'bx bxs-id-card' },
                { text: 'Visa For All Countries', url: '/visa for all countries', icon: 'bx bxs-file-doc' },
                { text: 'Honeymoon Packages', url: '/honeymoonpackages', icon: 'bx bxs-heart' },
                { text: 'Forex Services', url: '/forex', icon: 'bx bx-money' }
            ]
        },
        { 
            type: 'dropdown', 
            text: 'Trips', 
            id: 'trips',
            icon: 'bx bxl-airbnb',
            items: [
                { text: 'Domestic Tours', url: '/Domestic Tours', icon: 'bx bxs-map' },
                { text: 'International Tours', url: '/International Tours', icon: 'bx bx-globe' }
            ]
        },
        { type: 'link', text: 'Contact Us', url: '/contactus', icon: 'bx bx-mail-send' }
    ];

    // Update URL paths to ensure spaces are properly encoded
    menuItems.forEach(item => {
        if (item.url) {
            item.url = item.url.replace(/ /g, '%20');
        }
        if (item.items) {
            item.items.forEach(subItem => {
                if (subItem.url) {
                    subItem.url = subItem.url.replace(/ /g, '%20');
                }
            });
        }
    });
    
    // Functions to generate menu HTML
    function generateMobileMenuHTML() {
        let html = '<div class="menu-section">';
        
        menuItems.forEach(item => {
            if (item.type === 'link') {
                html += `<a href="${item.url}" class="menu-item">${item.text}</a>`;
            } else if (item.type === 'dropdown') {
                html += `
                    <div class="menu-item has-submenu">
                        <span>${item.text}</span>
                        <div class="submenu" style="display: none;">
                `;
                
                item.items.forEach(subItem => {
                    html += `<a href="${subItem.url}" class="submenu-item"><i class='${subItem.icon}'></i> ${subItem.text}</a>`;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }
    
    function generateDesktopMenuHTML() {
        let html = '';
        
        menuItems.forEach(item => {
            if (item.type === 'link') {
                html += `<a href="${item.url}"><h3><span>${item.text}</span> <span><i class='${item.icon}'></i></span></h3></a>`;
            } else if (item.type === 'dropdown') {
                html += `<h3 id="${item.id}"><span>${item.text}</span> <span><i class='${item.icon}'></i></span></h3>`;
            }
        });
        
        return html;
    }
    
    // Populate mobile menu
    mobileMenu.innerHTML = generateMobileMenuHTML();
    
    // Populate desktop menu
    desktopMenu.innerHTML = generateDesktopMenuHTML();
    
    // Insert dropdown menu after the navigation
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(mobileMenu, nav.nextSibling);
    
    // Add CSS for consistent menu styling
    const menuStyles = document.createElement('style');
    menuStyles.textContent = `
        /* Desktop Menu Styles */
        #nav-part3.desktop-menu {
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 60%;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        
        #nav-part3.desktop-menu a i {
            font-size: 1.3rem;
            color: var(--text-color);
            font-weight: 900;
            margin-left: .5rem;
        }
        
        #nav-part3.desktop-menu a h3 {
            display: flex;
            align-items: center;
        }
        
        nav h3 {
            border: 1.5px solid var(--text-color);
            color: var(--text-color);
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 50px;
            cursor: pointer;
        }
        
        /* Mobile Menu Styles */
        .dropdown-menu-js {
            position: fixed;
            background-color: var(--bg-color);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 999;
            padding: 12px;
            transition: all 0.3s ease;
            border: 1px solid var(--border-color);
            max-height: calc(80vh - 70px);
            overflow-y: auto;
            width: 250px;
        }
        
        .menu-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .menu-item {
            display: block;
            padding: 8px 12px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 15px;
            transition: background-color 0.3s ease;
            position: relative;
        }
        
        .menu-item:hover {
            background-color: var(--card-bg);
        }
        
        .has-submenu {
            cursor: pointer;
            position: relative;
        }
        
        .has-submenu > span {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
        
        .has-submenu > span::after {
            content: '›';
            font-size: 18px;
            transform: rotate(90deg);
            transition: transform 0.3s ease;
        }
        
        .has-submenu.open > span::after {
            transform: rotate(270deg);
        }
        
        .submenu {
            position: relative;
            left: 0;
            top: 5px;
            background-color: var(--bg-color);
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 8px;
            width: 100%;
            border: 1px solid var(--border-color);
            margin-left: 10px;
            max-height: calc(60vh - 70px);
            overflow-y: auto;
        }
        
        .submenu-item {
            display: block;
            padding: 6px 12px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .submenu-item:hover {
            background-color: var(--card-bg);
        }
        
        /* Desktop Dropdowns */
        .desktop-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: var(--bg-color);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            padding: 15px;
            min-width: 220px;
            z-index: 1000;
            margin-top: 10px;
            display: none;
            border: 1px solid var(--border-color);
        }
        
        .desktop-dropdown a {
            display: block;
            padding: 10px 15px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 5px;
            margin: 5px 0;
            transition: all 0.2s ease;
        }
        
        .desktop-dropdown a:hover {
            background-color: rgba(26, 138, 158, 0.1);
            color: #1a8a9e;
            transform: translateX(5px);
        }
        
        #ourservices, #trips {
            cursor: pointer;
            position: relative;
        }
        
        #ourservices::after, #trips::after {
            content: '▼';
            font-size: 10px;
            margin-left: 5px;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        
        #ourservices.active::after, #trips.active::after {
            transform: rotate(180deg);
        }
        
        /* Responsive Styles */
        @media (max-width: 1024px) {
            #nav-part1 {
                display: flex !important;
                align-items: center;
                cursor: pointer;
            }
            
            #nav-part3.desktop-menu {
                display: none !important;
            }
            
            /* Ensure dropdown menu has correct z-index */
            .dropdown-menu-js {
                z-index: 1010;
            }
        }
        
        @media (min-width: 1025px) {
            #nav-part1 {
                display: none !important;
            }
            
            .dropdown-menu-js {
                display: none !important;
            }
            
            #nav-part3.desktop-menu {
                display: flex !important;
            }
        }
        
        @media (max-width: 768px) {
            .dropdown-menu-js {
                width: 240px;
                top: 65px;
                left: 15px;
            }
        }
        
        @media (max-width: 480px) {
            .dropdown-menu-js {
                width: 220px;
                left: 10px;
            }
        }
    `;
    
    document.head.appendChild(menuStyles);
    
    // Create desktop dropdowns
    const ourServicesDropdown = document.createElement('div');
    ourServicesDropdown.className = 'desktop-dropdown services-dropdown';
    
    const tripsDropdown = document.createElement('div');
    tripsDropdown.className = 'desktop-dropdown trips-dropdown';
    
    // Generate dropdowns content
    let ourServicesHTML = '<div class="Section-ourservices">';
    menuItems[2].items.forEach(item => {
        ourServicesHTML += `<a href="${item.url}">${item.text}</a>`;
    });
    ourServicesHTML += '</div>';
    
    let tripsHTML = '<div class="Section-trips">';
    menuItems[3].items.forEach(item => {
        tripsHTML += `<a href="${item.url}">${item.text}</a>`;
    });
    tripsHTML += '</div>';
    
    ourServicesDropdown.innerHTML = ourServicesHTML;
    tripsDropdown.innerHTML = tripsHTML;
    
    // Append dropdowns to the body
    document.body.appendChild(ourServicesDropdown);
    document.body.appendChild(tripsDropdown);
    
    // Toggle mobile menu
    menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        const isVisible = mobileMenu.style.display === 'block';
        
        // Toggle menu visibility
        mobileMenu.style.display = isVisible ? 'none' : 'block';
        
        // Position the menu - fixed positioning relative to menu button
        if (!isVisible) {
            const buttonRect = menuButton.getBoundingClientRect();
            const navRect = nav.getBoundingClientRect();
            
            // Set fixed position relative to the nav element
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = `${buttonRect.bottom}px`;
            
            // Adjust left position based on screen size
            if (window.innerWidth <= 480) {
                mobileMenu.style.left = '10px';
            } else if (window.innerWidth <= 768) {
                mobileMenu.style.left = '15px';
            } else {
                mobileMenu.style.left = '20px';
            }
        }
    });
    
    // Update menu position when scrolling
    window.addEventListener('scroll', function() {
        if (mobileMenu.style.display === 'block') {
            const buttonRect = menuButton.getBoundingClientRect();
            mobileMenu.style.top = `${buttonRect.bottom}px`;
        }
    });
    
    // Handle mobile submenu toggles
    const mobileSubmenus = mobileMenu.querySelectorAll('.has-submenu');
    mobileSubmenus.forEach(submenu => {
        submenu.addEventListener('click', function(event) {
            event.stopPropagation();
            const submenuContent = this.querySelector('.submenu');
            const hasOpenClass = this.classList.contains('open');
            
            // Close other submenus
            mobileSubmenus.forEach(item => {
                if (item !== this) {
                    item.classList.remove('open');
                    item.querySelector('.submenu').style.display = 'none';
                }
            });
            
            // Toggle current submenu
            if (!hasOpenClass) {
                this.classList.add('open');
                submenuContent.style.display = 'block';
            } else {
                this.classList.remove('open');
                submenuContent.style.display = 'none';
            }
        });
    });
    
    // Handle desktop menu dropdowns
    const ourservices = document.getElementById('ourservices');
    const trips = document.getElementById('trips');
    
    if (ourservices) {
        ourservices.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Position dropdown
            const rect = this.getBoundingClientRect();
            ourServicesDropdown.style.left = rect.left + 'px';
            ourServicesDropdown.style.top = (rect.bottom + window.scrollY) + 'px';
            
            // Toggle dropdown
            this.classList.toggle('active');
            trips.classList.remove('active');
            
            const isVisible = ourServicesDropdown.style.display === 'block';
            ourServicesDropdown.style.display = isVisible ? 'none' : 'block';
            tripsDropdown.style.display = 'none';
        });
    }
    
    if (trips) {
        trips.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Position dropdown
            const rect = this.getBoundingClientRect();
            tripsDropdown.style.left = rect.left + 'px';
            tripsDropdown.style.top = (rect.bottom + window.scrollY) + 'px';
            
            // Toggle dropdown
            this.classList.toggle('active');
            ourservices.classList.remove('active');
            
            const isVisible = tripsDropdown.style.display === 'block';
            tripsDropdown.style.display = isVisible ? 'none' : 'block';
            ourServicesDropdown.style.display = 'none';
        });
    }
    
    // Close all menus when clicking outside
    document.addEventListener('click', function(event) {
        // Close mobile menu and submenus
        if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.style.display = 'none';
            mobileSubmenus.forEach(item => {
                item.classList.remove('open');
                item.querySelector('.submenu').style.display = 'none';
            });
        }
        
        // Close desktop dropdowns
        if (ourservices && !ourservices.contains(event.target) && !ourServicesDropdown.contains(event.target)) {
            ourServicesDropdown.style.display = 'none';
            ourservices.classList.remove('active');
        }
        
        if (trips && !trips.contains(event.target) && !tripsDropdown.contains(event.target)) {
            tripsDropdown.style.display = 'none';
            trips.classList.remove('active');
        }
    });
    
    // Create and add WhatsApp floating button
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/+918886226565'; // Abhi Tours & Travels WhatsApp number
    whatsappButton.target = '_blank';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
        </svg>
    `;

    // Add styles for the WhatsApp button
    const whatsappStyle = document.createElement('style');
    whatsappStyle.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #25D366;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            margin: 15px;
        }

        .whatsapp-float:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            background-color: #22c15e;
        }

        .whatsapp-float svg {
            width: 28px;
            height: 28px;
            transition: all 0.3s ease;
        }

        .whatsapp-float:hover svg {
            transform: scale(1.1);
        }

        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 15px;
                right: 15px;
                width: 45px;
                height: 45px;
                margin: 10px;
            }

            .whatsapp-float svg {
                width: 24px;
                height: 24px;
            }
        }

        @media (min-width: 1200px) {
            .whatsapp-float {
                right: calc((100vw - 1200px) / 2 + 30px);
            }
        }
    `;

    document.head.appendChild(whatsappStyle);
    document.body.appendChild(whatsappButton);

    // Contact Form Popup Functionality
    const contactBtn = document.getElementById('contactBtn');
    const contactPopup = document.getElementById('contactPopup');
    const closeContactPopup = document.getElementById('closeContactPopup');
    const contactForm = document.getElementById('contactForm');

    if (contactBtn && contactPopup && closeContactPopup && contactForm) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactPopup.style.display = 'flex';
        });

        closeContactPopup.addEventListener('click', function() {
            contactPopup.style.display = 'none';
        });

        // Close popup when clicking outside
        contactPopup.addEventListener('click', function(e) {
            if (e.target === contactPopup) {
                contactPopup.style.display = 'none';
            }
        });

        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you can add your form submission logic
            // For now, we'll just close the popup
            alert('Thank you for your message! We will contact you soon.');
            contactPopup.style.display = 'none';
            contactForm.reset();
        });
    }

    // Also update resize event handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            // Hide mobile menu
            mobileMenu.style.display = 'none';
            
            // Show desktop navigation
            if (desktopMenu) {
                desktopMenu.style.display = 'flex';
            }
        } else if (mobileMenu.style.display === 'block') {
            // Reposition the menu if it's visible during resize
            const buttonRect = menuButton.getBoundingClientRect();
            mobileMenu.style.top = `${buttonRect.bottom}px`;
            
            // Adjust left position based on new screen size
            if (window.innerWidth <= 480) {
                mobileMenu.style.left = '10px';
            } else if (window.innerWidth <= 768) {
                mobileMenu.style.left = '15px';
            } else {
                mobileMenu.style.left = '20px';
            }
        }
    });
}

/**
 * Handle form submissions with AJAX
 */
function setupFormSubmissions() {
    // Track if submission is in progress to prevent multiple submissions
    let isSubmitting = false;
    
    // Remove any existing messages on page load
    document.querySelectorAll('.notification').forEach(msg => msg.remove());
    
    const forms = document.querySelectorAll('form[data-submit="ajax"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Prevent multiple submissions
            if (isSubmitting) return;
            isSubmitting = true;
            
            // Remove all existing messages first
            document.querySelectorAll('.notification').forEach(msg => msg.remove());
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            const formData = new FormData(form);
            const action = form.getAttribute('action') || '/api/submissions/contact';
            
            // Convert FormData to object
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Check required fields for contact form
            if (action.includes('/contact')) {
                const missingFields = [];
                const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
                
                requiredFields.forEach(field => {
                    if (!formObject[field] || formObject[field].trim() === '') {
                        missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
                    }
                });
                
                if (missingFields.length > 0) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                    showAlert('error', `Please fill out all required fields: ${missingFields.join(', ')}`);
                    return;
                }
            }
            // Check required fields for passport form
            else if (action.includes('/passport')) {
                const missingFields = [];
                const requiredFields = ['name', 'email', 'phone', 'passportType', 'appointmentDate', 'city'];
                
                requiredFields.forEach(field => {
                    if (!formObject[field] || formObject[field].trim() === '') {
                        missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
                    }
                });
                
                if (missingFields.length > 0) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                    showAlert('error', `Please fill out all required fields: ${missingFields.join(', ')}`);
                    return;
                }
                
                // Map form field names to match the API expectations
                formObject.applicationType = formObject.passportType;
                formObject.expectedDate = formObject.appointmentDate;
                formObject.urgency = 'Normal';  // Default value
                formObject.numberOfApplicants = '1';  // Default value
            }
            // Check required fields for visa form
            else if (action.includes('/visa')) {
                const missingFields = [];
                const requiredFields = ['name', 'email', 'phone', 'destination', 'visaType', 'travelDate'];
                
                requiredFields.forEach(field => {
                    if (!formObject[field] || formObject[field].trim() === '') {
                        missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
                    }
                });
                
                if (missingFields.length > 0) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                    showAlert('error', `Please fill out all required fields: ${missingFields.join(', ')}`);
                    return;
                }
            }
            
            try {
                const response = await fetch(action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'travel_api_key_2024'
                    },
                    body: JSON.stringify(formObject)
                });
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                try {
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        // Success
                        form.reset();
                        showAlert('success', 'Thank you! Your submission has been received.');
                    } else {
                        // API error
                        let errorMessage = data.message || 'There was a problem with your submission. Please try again.';
                        
                        if (data.errors && Array.isArray(data.errors)) {
                            errorMessage = data.errors.map(err => err.msg).join(', ');
                        }
                        
                        showAlert('error', errorMessage);
                    }
                } catch (parseError) {
                    showAlert('error', 'Error processing server response. Please try again.');
                }
            } catch (error) {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                showAlert('error', 'Network error. Please check your connection and try again.');
            }
            
            // Reset submission status
            isSubmitting = false;
        });
    });
}

/**
 * Show a notification message at the top of the screen (React/Next.js style)
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 */
function showAlert(type, message) {
    // First remove any existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    });
    
    // Create a notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '0';
        notificationContainer.style.left = '0';
        notificationContainer.style.right = '0';
        notificationContainer.style.display = 'flex';
        notificationContainer.style.justifyContent = 'center';
        notificationContainer.style.zIndex = '10000';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.backgroundColor = type === 'success' ? '#d1e7dd' : '#f8d7da';
    notification.style.color = type === 'success' ? '#0f5132' : '#842029';
    notification.style.padding = '12px 20px';
    notification.style.margin = '12px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    notification.style.maxWidth = '80%';
    notification.style.textAlign = 'center';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    notification.style.fontWeight = '500';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove the container if it's empty
            if (notificationContainer.children.length === 0 && document.body.contains(notificationContainer)) {
                document.body.removeChild(notificationContainer);
            }
        }, 300);
    }, 5000);
}

// Add fallback data objects at the beginning of the file before the DOMContentLoaded event
const carouselItems = [
    {
        image: '../images/photo-1739606944848-97662c0430f0 (1).avif',
        title: 'Manali & Kashmir - ₹16,999',
        heading: 'Explore the Paradise ',
        subheading: 'Experience the serene beauty of north India',
        tags: ['Mountains', 'Nature', 'Adventure']
    },
    {
        image: '../images/photo-1590001155093-a3c66ab0c3ff.avif',
        title: 'Maldives - ₹65,999',
        heading: 'Discover Hidden Gems',
        subheading: 'Sun-kissed beaches await you',
        tags: ['Beach', 'Luxury', 'Island']
    },
    {
        image: '../images/premium_photo-1661929242720-140374d97c94.avif',
        title: 'Thailand - ₹31,999',
        heading: 'Explore Exotic Thailand',
        subheading: 'Experience vibrant culture and pristine beaches',
        tags: ['Culture', 'Beach', 'Adventure']
    },
    {
        image: '../images/photo-1510414842594-a61c69b5ae57.avif',
        title: 'Dubai - ₹49,999',
        heading: 'Luxury in the Desert',
        subheading: 'Experience modern marvels and traditional charm',
        tags: ['Luxury', 'Shopping', 'Adventure']
    }
];

const blogItems = [
    {
        image: '../images/photo-1645629022405-a3b40f0287e6.avif',
        title: 'Shimla & Kullu - ₹15,999',
        tags: ['Mountains', 'Nature', 'Adventure']
    },
    {
        image: '../images/photo-1590001155093-a3c66ab0c3ff.avif',
        title: 'Maldives - ₹65,999',
        tags: ['Beach', 'Ocean', 'Luxury']
    },
    {
        image: '../images/premium_photo-1661929242720-140374d97c94.avif',
        title: 'Thailand - ₹31,999',
        tags: ['Travel', 'Culture', 'Adventure']
    }
];

const tourItems = [
    {
        image: '../images/photo-1645629022405-a3b40f0287e6.avif',
        title: 'Shimla & Kullu',
        price: '₹15,999',
        duration: '5 Days, 4 Nights',
        tags: ['Mountains', 'Nature', 'Adventure']
    },
    {
        image: '../images/photo-1565967511849-763d3e14c3b8.avif',
        title: 'Kerala Tour',
        price: '₹25,999',
        duration: '6 Days, 5 Nights',
        tags: ['Beaches', 'Nature', 'Backwaters']
    }
];

const honeymoonItems = [
    {
        image: '../images/photo-1590001155093-a3c66ab0c3ff.avif',
        title: 'Maldives Special',
        price: '₹65,999',
        duration: '7 Days, 6 Nights',
        tags: ['Romantic', 'Beach', 'Private']
    },
    {
        image: '../images/photo-1520250497591-112f2f40a3f4.avif',
        title: 'Bali Honeymoon',
        price: '₹55,999',
        duration: '8 Days, 7 Nights',
        tags: ['Romantic', 'Beach', 'Luxury']
    }
];

const heroSections = {
    home: {
        heading: 'Explore the World with Us',
        subheading: 'Your journey begins here',
        background: '../images/photo-1510414842594-a61c69b5ae57.avif'
    }
};

// Function to load carousel data from the backend API
function loadCarouselData() {
    console.log("Loading carousel data from API");
    
    fetch('http://localhost:7777/api/content/carousel')
        .then(response => response.json())
        .then(data => {
            console.log("Carousel data received:", data);
            if (data.success && data.data && data.data.length > 0) {
                // Use the data from API instead of hardcoded data
                initCarousel(data.data);
            } else {
                // Fallback to hardcoded data if no items in database
                initCarousel(carouselItems);
            }
        })
        .catch(error => {
            console.error("Error fetching carousel data:", error);
            // Fallback to hardcoded data on error
            initCarousel(carouselItems);
        });
}

// Function to load blog cards from the backend API
function loadBlogCards() {
    console.log("Loading blog cards from API");
    
    fetch('http://localhost:7777/api/content/blog')
        .then(response => response.json())
        .then(data => {
            console.log("Blog cards received:", data);
            if (data.success && data.data && data.data.length > 0) {
                // Use the data from API instead of hardcoded data
                initBlogCards(data.data);
            } else {
                // Fallback to hardcoded data if no items in database
                initBlogCards(blogItems || []);
            }
        })
        .catch(error => {
            console.error("Error fetching blog cards:", error);
            // Fallback to hardcoded data on error
            initBlogCards(blogItems || []);
        });
}

// Function to load tour cards from the backend API
function loadTourCards() {
    console.log("Loading tour cards from API");
    
    fetch('http://localhost:7777/api/content/tour/all')
        .then(response => {
            if (!response.ok) {
                // If the 'all' endpoint doesn't work, fallback to domestic
                return fetch('http://localhost:7777/api/content/tour/domestic');
            }
            return response;
        })
        .then(response => response.json())
        .then(data => {
            console.log("Tour cards received:", data);
            if (data.success && data.data && data.data.length > 0) {
                // Use the data from API instead of hardcoded data
                initTourCards(data.data);
            } else {
                // Fallback to hardcoded data if no items in database
                initTourCards(tourItems || []);
            }
        })
        .catch(error => {
            console.error("Error fetching tour cards:", error);
            // Fallback to hardcoded data on error
            initTourCards(tourItems || []);
        });
}

// Function to load honeymoon cards from the backend API
function loadHoneymoonCards() {
    console.log("Loading honeymoon cards from API");
    
    fetch('http://localhost:7777/api/content/honeymoon')
        .then(response => response.json())
        .then(data => {
            console.log("Honeymoon cards received:", data);
            if (data.success && data.data && data.data.length > 0) {
                // Use the data from API instead of hardcoded data
                initHoneymoonCards(data.data);
            } else {
                // Fallback to hardcoded data if no items in database
                initHoneymoonCards(honeymoonItems || []);
            }
        })
        .catch(error => {
            console.error("Error fetching honeymoon cards:", error);
            // Fallback to hardcoded data on error
            initHoneymoonCards(honeymoonItems || []);
        });
}

// Function to load hero sections from the backend API
function loadHeroSections() {
    console.log("Loading hero sections from API");
    
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    
    fetch(`http://localhost:7777/api/content/hero/${currentPage}`)
        .then(response => {
            if (!response.ok) {
                // If page-specific hero section doesn't exist, try getting all
                return fetch('http://localhost:7777/api/content/hero');
            }
            return response;
        })
        .then(response => response.json())
        .then(data => {
            console.log("Hero sections received:", data);
            if (data.success) {
                // Check if we got an array or single item
                if (Array.isArray(data.data) && data.data.length > 0) {
                    // Find the hero section for the current page
                    const pageHero = data.data.find(item => item.page === currentPage) || data.data[0];
                    initHeroSection(pageHero);
                } else if (data.data) {
                    // Handle single hero section
                    initHeroSection(data.data);
                } else {
                    // Fallback to hardcoded data
                    initHeroSection(heroSections?.[currentPage] || {});
                }
            } else {
                // Fallback to hardcoded data
                initHeroSection(heroSections?.[currentPage] || {});
            }
        })
        .catch(error => {
            console.error("Error fetching hero sections:", error);
            // Fallback to hardcoded data on error
            initHeroSection(heroSections?.[currentPage] || {});
        });
}

// Initialize page content from API when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load content from the API
    loadCarouselData();
    loadBlogCards();
    loadTourCards();
    loadHoneymoonCards();
    loadHeroSections();
    
    // Other initialization code...
});

// Initialize the carousel with the provided items
function initCarousel(items) {
    console.log("Initializing carousel with items:", items);
    
    const carouselContainer = document.querySelector('.carousel-inner');
    if (!carouselContainer) return;
    
    carouselContainer.innerHTML = '';
    
    items.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        
        // Fix image path if needed
        let imageSrc = item.image;
        if (imageSrc.startsWith('../images/')) {
            imageSrc = imageSrc.replace('../images/', '/images/');
        }
        
        slide.innerHTML = `
            <div class="carousel-image">
                <img src="${imageSrc}" alt="${item.title}" onerror="this.src='/frontend/images/img5.avif'">
            </div>
            <div class="carousel-content">
                <h2>${item.heading}</h2>
                <p>${item.subheading}</p>
                <div class="title">${item.title}</div>
                <div class="tags">
                    ${Array.isArray(item.tags) ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="carousel-cta">
                    <a href="#book-now" class="cta-button">
                        <div class="arrow">→</div>
                        Book Your Trip Now
                    </a>
                </div>
            </div>
        `;
        
        carouselContainer.appendChild(slide);
    });
    
    // Update indicators
    const indicators = document.querySelector('.carousel-indicators');
    if (indicators) {
        indicators.innerHTML = '';
        
        items.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            indicators.appendChild(indicator);
        });
    }
    
    // Reinitialize carousel controls
    setupCarouselControls();
}

// Initialize blog cards with the provided items
function initBlogCards(items) {
    console.log("Initializing blog cards with items:", items);
    
    const blogContainer = document.querySelector('.blog-cards-container');
    if (!blogContainer) return;
    
    blogContainer.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `blog-card ${item.size || 'small'}`;
        
        // Fix image path if needed
        let imageSrc = item.image;
        if (imageSrc.startsWith('../images/')) {
            imageSrc = imageSrc.replace('../images/', '/images/');
        }
        
        card.innerHTML = `
            <div class="blog-card-img-container">
                <img src="${imageSrc}" alt="${item.title}" class="blog-card-img" onerror="this.src='/frontend/images/img6.avif'">
            </div>
            <div class="blog-card-body">
                <h3 class="blog-card-title">${item.title}</h3>
                <p class="blog-card-text">${item.content || ''}</p>
                <div class="blog-card-tags">
                    ${Array.isArray(item.tags) ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <a href="#" class="blog-card-link">Read More</a>
            </div>
        `;
        
        blogContainer.appendChild(card);
    });
}

// Initialize tour cards with the provided items
function initTourCards(items) {
    console.log("Initializing tour cards with items:", items);
    
    const tourContainer = document.querySelector('.tour-cards-container');
    if (!tourContainer) return;
    
    tourContainer.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'tour-card';
        
        // Fix image path if needed
        let imageSrc = item.image;
        if (imageSrc.startsWith('../images/')) {
            imageSrc = imageSrc.replace('../images/', '/images/');
        }
        
        card.innerHTML = `
            <div class="tour-card-img-container">
                <img src="${imageSrc}" alt="${item.title}" class="tour-card-img" onerror="this.src='/frontend/images/img5.avif'">
            </div>
            <div class="tour-card-body">
                <h3 class="tour-card-title">${item.title}</h3>
                <p class="tour-card-text">${item.text || ''}</p>
                <div class="tour-card-meta">
                    <span class="tour-card-price">${item.price || ''}</span>
                    <span class="tour-card-duration">${item.duration || ''}</span>
                </div>
                <a href="#book-tour" class="tour-card-btn">Book Now</a>
            </div>
        `;
        
        tourContainer.appendChild(card);
    });
}

// Initialize honeymoon cards with the provided items
function initHoneymoonCards(items) {
    console.log("Initializing honeymoon cards with items:", items);
    
    const honeymoonContainer = document.querySelector('.honeymoon-cards-container');
    if (!honeymoonContainer) return;
    
    honeymoonContainer.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'honeymoon-card';
        
        // Fix image path if needed
        let imageSrc = item.image;
        if (imageSrc.startsWith('../images/')) {
            imageSrc = imageSrc.replace('../images/', '/images/');
        }
        
        card.innerHTML = `
            <img src="${imageSrc}" alt="${item.title}" class="honeymoon-card-img" onerror="this.src='/frontend/images/img17.avif'">
            <div class="honeymoon-card-body">
                <h3 class="honeymoon-card-title">${item.title}</h3>
                <p class="honeymoon-card-text">${item.text || ''}</p>
                <div class="honeymoon-card-meta">
                    <span class="honeymoon-card-price">${item.price || ''}</span>
                    <span class="honeymoon-card-duration"><i class="bx bx-time"></i> ${item.duration || ''}</span>
                </div>
                <a href="#book-honeymoon" class="honeymoon-card-btn">Book Now</a>
            </div>
        `;
        
        honeymoonContainer.appendChild(card);
    });
}

// Initialize hero section with the provided data
function initHeroSection(data) {
    console.log("Initializing hero section with data:", data);
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Fix image path if needed
    let imageSrc = data.image;
    if (imageSrc && imageSrc.startsWith('../images/')) {
        imageSrc = imageSrc.replace('../images/', '/images/');
    }
    
    // Update background image if available
    if (imageSrc) {
        heroSection.style.backgroundImage = `url(${imageSrc})`;
    }
    
    // Update content if available
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
        const heroTitle = heroContent.querySelector('h1');
        const heroDescription = heroContent.querySelector('p');
        
        if (heroTitle && data.title) {
            heroTitle.textContent = data.title;
        }
        
        if (heroDescription && data.description) {
            heroDescription.textContent = data.description;
        }
    }
}