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
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
            if (submitBtn) {
                submitBtn.textContent = 'Submitting...';
                submitBtn.disabled = true;
            }
            
            const formData = new FormData(form);
            
            // Determine the form type
            const formType = determineFormType(form);
            
            // Make sure formType is included in the submission
            if (!formData.has('formType')) {
                formData.append('formType', formType);
            }
            
            // Set the correct API endpoint based on form type
            let apiEndpoint = form.getAttribute('action') || '/api/submissions/contact';
            if (!apiEndpoint.includes(formType) && formType !== 'contact') {
                apiEndpoint = `/api/submissions/${formType}`;
            }
            
            console.log(`Form submission detected with type: ${formType} to endpoint: ${apiEndpoint}`);
            
            // Convert FormData to object for validation
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Special handling based on form type
            let missingFields = [];
            
            switch(formType) {
                case 'contact':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'subject', 'message']);
                    break;
                case 'flight':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'from', 'to', 'departureDate']);
                    break;
                case 'visa':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'destination']);
                    break;
                case 'passport':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'applicationType']);
                    break;
                case 'tour':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'destination']);
                    break;
                case 'forex':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'currencyFrom', 'currencyTo']);
                    break;
                case 'honeymoon':
                    missingFields = validateRequiredFields(formObject, ['name', 'email', 'phone', 'destination', 'travelDates']);
                    break;
                default:
                    missingFields = validateRequiredFields(formObject, ['name', 'email']);
                    break;
            }
            
            if (missingFields.length > 0) {
                resetSubmissionState(submitBtn, originalBtnText);
                showAlert('error', `Please fill in all required fields: ${missingFields.join(', ')}`);
                isSubmitting = false;
                return;
            }
            
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'travel_api_key_2024'
                    },
                    body: JSON.stringify(formObject)
                });
                
                const data = await response.json();
                
                // Debug logging
                console.log('API Response:', data);
                
                if (response.ok) {
                    // Success - show notification
                    showAlert('success', data.message || 'Form submitted successfully!');
                    
                    // Reset form if submission was successful
                    form.reset();
                } else {
                    // API returned an error
                    const errorMessage = data.message || 'An error occurred during submission.';
                    
                    // If there are validation errors, display them
                    if (data.errors && data.errors.length > 0) {
                        const errorDetails = data.errors.map(err => `${err.param}: ${err.msg}`).join(', ');
                        console.error('Validation errors:', data.errors);
                        showAlert('error', `${errorMessage} (${errorDetails})`);
                    } else {
                        showAlert('error', errorMessage);
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showAlert('error', 'Network error: Could not connect to the server. Please try again later.');
            }
            
            // Reset button state
            resetSubmissionState(submitBtn, originalBtnText);
            isSubmitting = false;
        });
    });
    
    // Helper function to validate required fields
    function validateRequiredFields(formObject, requiredFields) {
        const missingFields = [];
        requiredFields.forEach(field => {
            if (!formObject[field] || formObject[field].trim() === '') {
                missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
            }
        });
        
        if (missingFields.length > 0) {
            showAlert('error', `Please fill out all required fields: ${missingFields.join(', ')}`);
        }
        
        return missingFields;
    }
    
    // Helper function to reset submission state
    function resetSubmissionState(submitBtn, originalBtnText) {
        if (submitBtn) {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
        isSubmitting = false;
    }
}

/**
 * Show a notification message to the user
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 */
function showAlert(type, message) {
    // First remove any existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-x-circle'}'></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    notification.style.color = type === 'success' ? '#155724' : '#721c24';
    notification.style.padding = '12px 15px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Style the notification content
    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    
    // Style the icon
    const icon = notification.querySelector('i');
    icon.style.marginRight = '10px';
    icon.style.fontSize = '1.2rem';
    
    // Style the close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'inherit';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '10px';
    closeBtn.style.opacity = '0.7';
    
    // Add the notification to the document
    document.body.appendChild(notification);
    
    // Set up the close button
    closeBtn.addEventListener('click', function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Set up Book Now buttons to trigger booking popups
 */
function setupBookNowButtons() {
    // Get all book now buttons across the site with various selectors
    const bookButtons = document.querySelectorAll('.book-now-btn, button[data-tour], a.book-now, .tour-card-btn, .cta-btn, button:contains("Book Now")');
    
    console.log(`Found ${bookButtons.length} book now buttons`);
    
    bookButtons.forEach(button => {
        // Remove any existing event listeners to prevent duplicates
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Book now button clicked');
            
            // Get tour details from button attributes or parent elements
            const tourCard = newButton.closest('.tour-card');
            const tourSection = newButton.closest('.destination-card, section');
            
            const tourName = newButton.getAttribute('data-tour') || 
                            tourCard?.querySelector('.tour-card-title, .tour-title')?.textContent ||
                            tourSection?.querySelector('h2, h3')?.textContent ||
                            '';
            
            const tourPrice = newButton.getAttribute('data-price') || 
                             tourCard?.querySelector('.tour-card-price, .tour-price')?.textContent ||
                             tourSection?.querySelector('.price, .per-person, [class*="price"]')?.textContent ||
                             '';
            
            // Find the booking popup modal - search for various modal IDs
            let bookingModal;
            if (newButton.getAttribute('data-target')) {
                // If the button has a specific target modal
                bookingModal = document.querySelector(newButton.getAttribute('data-target'));
            } else {
                // Look for any booking modal using various possible IDs
                bookingModal = document.getElementById('bookingPopup') || 
                              document.getElementById('bookingModal') || 
                              document.querySelector('.booking-modal, .contact-popup, .modal');
            }
            
            console.log('Looking for booking modal...');
            
            // If we found a modal, populate it with tour details
            if (bookingModal) {
                console.log('Booking modal found:', bookingModal);
                
                // Make the modal visible
                bookingModal.style.display = 'flex';
                
                // Set the tour name in the modal if there's a place for it
                const tourNameField = bookingModal.querySelector('#booking-tour') || 
                                     bookingModal.querySelector('.tour-name') || 
                                     bookingModal.querySelector('[name="tourName"]') ||
                                     bookingModal.querySelector('[name="destination"]');
                
                if (tourNameField && tourName) {
                    console.log('Setting tour name to:', tourName);
                    if (tourNameField.tagName === 'INPUT' || tourNameField.tagName === 'SELECT') {
                        // For selects, try to find a matching option
                        if (tourNameField.tagName === 'SELECT') {
                            let matchFound = false;
                            
                            // Try to find an exact match
                            for (let i = 0; i < tourNameField.options.length; i++) {
                                if (tourNameField.options[i].text === tourName || 
                                    tourNameField.options[i].value === tourName) {
                                    tourNameField.selectedIndex = i;
                                    matchFound = true;
                                    break;
                                }
                            }
                            
                            // If no exact match, look for a partial match
                            if (!matchFound) {
                                for (let i = 0; i < tourNameField.options.length; i++) {
                                    if (tourName.includes(tourNameField.options[i].text) || 
                                        tourNameField.options[i].text.includes(tourName)) {
                                        tourNameField.selectedIndex = i;
                                        matchFound = true;
                                        break;
                                    }
                                }
                            }
                            
                            // If still no match, set the first non-empty option
                            if (!matchFound) {
                                for (let i = 0; i < tourNameField.options.length; i++) {
                                    if (tourNameField.options[i].value) {
                                        tourNameField.selectedIndex = i;
                                        break;
                                    }
                                }
                            }
                        } else {
                            // For regular inputs
                            tourNameField.value = tourName;
                        }
                    } else {
                        tourNameField.textContent = tourName;
                    }
                }
                
                // Set the tour price if there's a place for it
                const tourPriceField = bookingModal.querySelector('#booking-price') || 
                                      bookingModal.querySelector('.tour-price') || 
                                      bookingModal.querySelector('[name="tourPrice"]') ||
                                      bookingModal.querySelector('[name="price"]');
                
                if (tourPriceField && tourPrice) {
                    if (tourPriceField.tagName === 'INPUT') {
                        tourPriceField.value = tourPrice;
                    } else {
                        tourPriceField.textContent = tourPrice;
                    }
                }
                
                // Add the formType as a hidden field if it doesn't exist
                let formTypeField = bookingModal.querySelector('input[name="formType"]');
                if (!formTypeField) {
                    const form = bookingModal.querySelector('form');
                    if (form) {
                        formTypeField = document.createElement('input');
                        formTypeField.type = 'hidden';
                        formTypeField.name = 'formType';
                        
                        // Determine if it's domestic or international
                        if (window.location.href.includes('Domestic') || 
                            document.title.includes('Domestic')) {
                            formTypeField.value = 'tour';
                        } else if (window.location.href.includes('International') || 
                                 document.title.includes('International')) {
                            formTypeField.value = 'tour';
                        } else {
                            formTypeField.value = 'tour';
                        }
                        
                        form.appendChild(formTypeField);
                    }
                }
                
                // Ensure the form has the ajax attribute
                const modalForm = bookingModal.querySelector('form');
                if (modalForm && !modalForm.hasAttribute('data-submit')) {
                    modalForm.setAttribute('data-submit', 'ajax');
                    modalForm.setAttribute('action', '/api/submissions/tour');
                    modalForm.setAttribute('method', 'POST');
                }
                
                // Remove any inline event handlers that might interfere
                if (modalForm) {
                    modalForm.onsubmit = null;
                    
                    // Temporarily remove existing event listeners
                    const newForm = modalForm.cloneNode(true);
                    modalForm.parentNode.replaceChild(newForm, modalForm);
                    
                    // Set up the form for ajax submission
                    setupFormSubmissions();
                }
                
                // Add close functionality - look for various close buttons
                const closeButtons = bookingModal.querySelectorAll('.close-btn, .close-modal, .modal-close, #closeBookingPopup');
                closeButtons.forEach(closeBtn => {
                    // Remove existing event listeners
                    const newCloseBtn = closeBtn.cloneNode(true);
                    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                    
                    newCloseBtn.addEventListener('click', function() {
                        bookingModal.style.display = 'none';
                    });
                });
                
                // Close when clicking outside the modal content
                bookingModal.addEventListener('click', function(e) {
                    if (e.target === bookingModal) {
                        bookingModal.style.display = 'none';
                    }
                });
            } else {
                // If no modal is found, show an error
                console.error('Booking modal not found');
                showAlert('error', 'Booking form not found. Please try again later.');
            }
        });
    });
    
    // Close modals when escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal, .contact-popup').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
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

function determineFormType(form) {
    // First check if there's a hidden formType field
    const formTypeInput = form.querySelector('input[name="formType"]');
    if (formTypeInput && formTypeInput.value) {
        return formTypeInput.value;
    }
    
    // Check form action URL for clues
    const formAction = form.getAttribute('action') || '';
    if (formAction.includes('/contact')) return 'contact';
    if (formAction.includes('/flight')) return 'flight';
    if (formAction.includes('/visa')) return 'visa';
    if (formAction.includes('/passport')) return 'passport';
    if (formAction.includes('/tour')) return 'tour';
    if (formAction.includes('/forex')) return 'forex';
    if (formAction.includes('/honeymoon')) return 'honeymoon';
    
    // Check form classes and IDs
    if (form.classList.contains('contact-form') || form.id.includes('contact')) return 'contact';
    if (form.classList.contains('flight-form') || form.id.includes('flight')) return 'flight';
    if (form.classList.contains('visa-form') || form.id.includes('visa')) return 'visa';
    if (form.classList.contains('passport-form') || form.id.includes('passport')) return 'passport';
    if (form.classList.contains('tour-form') || form.id.includes('tour')) return 'tour';
    if (form.classList.contains('forex-form') || form.id.includes('forex')) return 'forex';
    if (form.classList.contains('honeymoon-form') || form.id.includes('honeymoon')) return 'honeymoon';
    
    // Check for specific form fields that would indicate the type
    if (form.querySelector('select[name="visaType"]')) return 'visa';
    if (form.querySelector('select[name="passportType"]') || form.querySelector('select[name="applicationType"]')) return 'passport';
    if (form.querySelector('input[name="departureDate"]') && form.querySelector('input[name="from"]')) return 'flight';
    if (form.querySelector('select[name="destination"]') && form.querySelector('select[name="duration"]')) return 'tour';
    
    // Default to contact if no matches
    return 'contact';
}