# Abhi Tours & Travels - Travel Agency Website

A modern, responsive travel agency website with dark/light mode, optimized performance, and comprehensive travel services.

## Project Overview

Abhi Tours & Travels is a full-featured travel agency website designed to showcase various travel packages, services, and booking options. The website features a modern responsive design with a focus on user experience and performance optimization.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Key Features](#key-features)
3. [Design & Theme](#design--theme)
4. [Performance Optimizations](#performance-optimizations)
5. [Pages & Services Overview](#pages--services-overview)
6. [File Documentation](#file-documentation)
   - [HTML Templates](#html-templates)
   - [CSS Files](#css-files)
   - [JavaScript Files](#javascript-files)
7. [Usage Instructions](#usage-instructions)
8. [Customization Guide](#customization-guide)

## Project Structure

```
/frontend
  /templates         # HTML page templates
    - index.html
    - aboutus.html
    - contactus.html
    - Domestic Tours.html
    - International Tours.html
    - Flight Tickets.html
    - visa for all countries.html
    - forex.html
    - Apply For Passport Application.html
    - honeymoonpackages.html
  
  /css               # CSS stylesheets
    - style.css            # Main styles
    - responsive.css       # Responsive design rules
    - critical.css         # Critical rendering path styles
    - base.css             # Base styling
    - components.css       # Reusable component styles
    - layout.css           # Layout styles
    - animations.css       # Animation definitions
    - theme-toggle.css     # Dark/light mode toggle
    - navigation.css       # Navigation styles
    - hero.css             # Hero section styles
    - footer.css           # Footer styles
    - [service-specific styles]
  
  /js                # JavaScript files
    - script.js            # Main functionality
    - page-loader.js       # Page loading optimization
    - theme-handler.js     # Theme switching
    - script-loader.js     # JavaScript loading optimization
    - lazy-load.js         # Image lazy loading
  
  /images            # Image assets
    - [Various optimized images]
```

## Key Features

### 1. Responsive Design
- Fully responsive layout that adapts to all device sizes
- Mobile-first approach with dedicated mobile navigation
- Optimized touch interactions for mobile users

### 2. Dark/Light Mode
- User-togglable theme preference
- Persistent theme selection through local storage
- Smooth transition animations between themes
- System preference detection with `prefers-color-scheme`

### 3. Performance Optimizations
- Critical CSS inlining for fastest initial rendering
- Lazy loading of images with native browser support
- Deferred loading of non-critical resources
- Optimized image delivery using modern formats (AVIF)
- Progressive enhancement for browsers with varying capabilities

### 4. Interactive UI Elements
- Interactive hero carousel with automatic slideshow
- Service dropdowns with smooth animations
- Form validation with real-time feedback
- Modal popups for booking and inquiries
- Animated content sections for better engagement

### 5. Comprehensive Service Offerings
- Domestic tour packages with detailed itineraries
- International tour packages with visa information
- Flight booking service with search functionality
- Visa application assistance for multiple countries
- Foreign exchange services
- Passport application assistance
- Honeymoon packages with special offers

## Design & Theme

The website follows a modern, clean design aesthetic with an emphasis on visual content and user experience:

### Visual Language
- Large hero images to showcase destinations
- Card-based UI for easy scanning of information
- Consistent typography with Roboto and JetBrains Mono fonts
- Icon system using Remix Icons, Boxicons, and Font Awesome
- Visual hierarchy through spacing, typography, and color

### Color Scheme
- **Light Theme**: Clean white backgrounds with subtle gray accents
- **Dark Theme**: Deep charcoal backgrounds with lighter content areas
- Accent colors for calls-to-action and interactive elements
- High contrast for accessibility

### Typography
- Primary Font: Roboto (sans-serif) for body text and general content
- Secondary Font: JetBrains Mono for headers and accent text
- Responsive font sizing with appropriate line heights
- Careful attention to text contrast for readability

## Performance Optimizations

### Critical Rendering Path
- Inline critical CSS in the document head
- Defer non-critical CSS loading
- Preconnect to external domains for resource fetching
- Asynchronous loading of non-essential JavaScript

### Image Optimization
- Modern image formats (AVIF) with fallbacks
- Responsive images with appropriate sizing
- Lazy loading of off-screen images
- Appropriate image compression for web delivery

### JavaScript Efficiency
- Event delegation for performance
- Throttled and debounced event handlers
- Modular approach to JavaScript functionality
- Browser API detection and feature fallbacks

## Pages & Services Overview

### Home Page
The home page showcases featured destinations with a hero carousel, promotional sections for popular tour packages, and quick access to all services. It includes testimonials, featured destinations, and special offers.

### About Us
The about us page provides information about the company, its mission and vision, team members, and company history. It establishes credibility and trust with potential customers.

### Domestic Tours
This page lists various domestic tour packages with details like duration, price, inclusions, exclusions, and itineraries. Each package includes high-quality images, pricing information, and booking options.

### International Tours
Similar to domestic tours but focused on international destinations. This page includes additional information about visa requirements, travel insurance, and foreign exchange needs.

### Flight Tickets
A dedicated page for flight booking with search functionality for routes, dates, and passenger information. It includes options for one-way, round-trip, and multi-city bookings.

### Visa Services
Comprehensive information about visa requirements for different countries, application processes, documentation needs, and processing times. The page includes application forms and consultation booking.

### Forex Services
Details about foreign exchange services, currency conversion rates, and procedures for obtaining foreign currency. Includes information about forex cards and international money transfers.

### Passport Application
Step-by-step guidance for passport application and renewal processes, document requirements, and appointment scheduling information.

### Honeymoon Packages
Specially curated packages for honeymoon travelers with romantic destinations, couple activities, and special amenities.

### Contact Us
Contact information, inquiry form, office locations, and operating hours. Includes a map integration and multiple contact channels.

## File Documentation

### HTML Templates

#### 1. index.html (Home Page)
**Purpose**: Main landing page of the website.

**Key Components**:
- Navigation menu with responsive design
- Hero carousel showcasing featured destinations
- Featured tour packages in a card layout
- Call-to-action sections for bookings
- Footer with contact form and company information

**Implementation Details**:
- Semantic HTML5 structure with appropriate landmark regions
- Optimized loading with critical CSS and deferred resources
- Interactive elements powered by JavaScript
- Responsive design adjustments via media queries

#### 2. aboutus.html
**Purpose**: Company information and team presentation.

**Key Components**:
- Company history and mission statement
- Team member profiles with images
- Company achievements and certifications
- Office locations and facilities

**Implementation Details**:
- Timeline visualization for company history
- Team grid with hover effects
- Responsive layout that adapts to various screen sizes

#### 3. Domestic Tours.html
**Purpose**: Showcase domestic tour packages.

**Key Components**:
- Filterable grid of tour packages
- Detailed cards with pricing, duration, and highlights
- Quick booking options
- Featured and seasonal promotions

**Implementation Details**:
- Filter system for destinations, duration, and price range
- Responsive grid layout with card design
- Interactive elements for package details
- Booking form integration

#### 4. International Tours.html
**Purpose**: Showcase international tour packages.

**Key Components**:
- Country-specific tour packages
- Visa requirement information
- International travel tips
- Package comparisons

**Implementation Details**:
- Country filtering and sorting options
- Detailed package information with collapsible sections
- Integration with visa services information
- Responsive design with mobile optimization

#### 5. Flight Tickets.html
**Purpose**: Flight booking interface.

**Key Components**:
- Flight search form with multiple options
- Popular route suggestions
- Fare calendar
- Special deals section

**Implementation Details**:
- Form validation for search parameters
- Date picker integration
- Responsive design for all device sizes
- Clear visual hierarchy for booking process

#### 6. visa for all countries.html
**Purpose**: Visa application information and services.

**Key Components**:
- Country-specific visa requirements
- Document checklists
- Processing time and fee information
- Application form

**Implementation Details**:
- Country selection interface
- Collapsible information sections
- Document requirement checklists
- Form validation for applications

#### 7. forex.html
**Purpose**: Foreign exchange services information.

**Key Components**:
- Currency conversion information
- Exchange rate display
- Forex card services
- Order form for currency exchange

**Implementation Details**:
- Currency calculator functionality
- Information about forex regulations
- Service comparison table
- Responsive form design

#### 8. Apply For Passport Application.html
**Purpose**: Passport application guidance.

**Key Components**:
- Application process steps
- Document requirements
- Fee structure
- Appointment scheduling

**Implementation Details**:
- Step-by-step process visualization
- Document checklist with explanations
- Form for appointment requests
- FAQ section for common questions

#### 9. honeymoonpackages.html
**Purpose**: Specialized packages for honeymoon travelers.

**Key Components**:
- Romantic destination packages
- Special honeymoon inclusions
- Customization options
- Testimonials from couples

**Implementation Details**:
- Visual-focused design with large imagery
- Special offer highlighting
- Package comparison features
- Responsive grid layout

#### 10. contactus.html
**Purpose**: Contact information and inquiry form.

**Key Components**:
- Contact form
- Office locations with map
- Contact information (phone, email, etc.)
- Social media links

**Implementation Details**:
- Form validation with error handling
- Office location map integration
- Multiple contact channels
- Response confirmation mechanism

### CSS Files

#### 1. style.css
**Purpose**: Main stylesheet containing core styling.

**Key Components**:
- Global variables for theming
- Base element styling
- Layout structures
- Component styling

**Implementation Details**:
- CSS custom properties for theme variables
- Responsive units (rem, em, %)
- Flexbox and Grid layouts
- Media queries for responsive design

#### 2. responsive.css
**Purpose**: Dedicated responsive adjustments.

**Key Components**:
- Breakpoint-specific style adjustments
- Mobile-first approach with progressive enhancement
- Device-specific optimizations

**Implementation Details**:
- Strategic breakpoints (576px, 768px, 992px, 1200px)
- Layout adjustments for different screen sizes
- Typography scaling
- Navigation transformations

#### 3. critical.css
**Purpose**: Critical rendering path styles for initial load.

**Key Components**:
- Core layout styles
- Above-the-fold component styling
- Essential animations

**Implementation Details**:
- Minimal set of styles for fastest rendering
- Focused on viewport-visible elements
- No render-blocking external resources

#### 4. components.css
**Purpose**: Reusable UI component styles.

**Key Components**:
- Button styles
- Card designs
- Form elements
- Alert and notification styles

**Implementation Details**:
- Consistent component styling
- State variations (hover, active, disabled)
- Animation integration
- Accessibility considerations

#### 5. theme-toggle.css
**Purpose**: Dark/light mode toggle functionality.

**Key Components**:
- Toggle button styling
- Theme transition animations
- Theme-specific overrides

**Implementation Details**:
- SVG animation for sun/moon toggle
- Smooth color transitions
- Local storage integration with JavaScript

#### 6. hero.css
**Purpose**: Styling for hero sections and carousels.

**Key Components**:
- Hero layout and structure
- Carousel controls
- Text overlay styling
- Responsive adjustments

**Implementation Details**:
- Background image handling
- Animation for transitions
- Indicator styling
- Mobile optimization

#### 7. navigation.css
**Purpose**: Navigation menu styling.

**Key Components**:
- Main navigation structure
- Dropdown menus
- Mobile menu adaptation
- Active state indicators

**Implementation Details**:
- Flexible navigation layout
- Dropdown animations
- Hamburger menu for mobile
- Accessibility for keyboard navigation

#### 8. footer.css
**Purpose**: Footer styling.

**Key Components**:
- Footer layout and sections
- Contact form styling
- Social media links
- Copyright information

**Implementation Details**:
- Multi-column responsive layout
- Form styling and validation
- Icon integration for social links
- Responsive adjustments

#### 9. Service-specific CSS files
**Purpose**: Specialized styling for each service page.

**Key Components**:
- Page-specific layouts
- Special components unique to each service
- Content presentation optimizations

**Implementation Details**:
- Consistent with global styling
- Specialized variations for unique content
- Page-specific responsive considerations

### JavaScript Files

#### 1. script.js
**Purpose**: Main functionality and interactions.

**Key Components**:
- Hero carousel functionality
- Service dropdown interactions
- Form validations
- Modal popup handling
- Animation triggers

**Implementation Details**:
- Event delegation for performance
- Module pattern for organization
- Browser feature detection
- Performance optimizations

**Detailed Functionality**:
- **Carousel System**: Manages the hero slideshow with automatic advancement, pause on hover, and manual navigation controls.
- **Navigation Handling**: Controls dropdown menus, mobile navigation toggling, and smooth scrolling to sections.
- **Form Validation**: Client-side validation for all forms with real-time feedback and submission handling.
- **Modal Handling**: Opens and closes modal popups for bookings and inquiries with appropriate focus management.
- **Animation Triggers**: Applies animations to elements as they enter the viewport for enhanced visual experience.

#### 2. page-loader.js
**Purpose**: Optimize page loading experience.

**Key Components**:
- Initial loading screen
- Progressive resource loading
- Loading state management

**Implementation Details**:
- Minimal blocking of rendering
- Sequential resource loading
- Visual loading indicators

**Detailed Functionality**:
- **Loading Screen**: Provides visual feedback during initial page load with progress indication.
- **Resource Prioritization**: Ensures critical resources load first for faster perceived performance.
- **State Management**: Tracks loading progress and updates UI accordingly.

#### 3. theme-handler.js
**Purpose**: Manage theme switching functionality.

**Key Components**:
- Theme preference detection
- Toggle functionality
- Local storage persistence

**Implementation Details**:
- System preference detection
- Smooth theme transitions
- Event handling for toggle

**Detailed Functionality**:
- **Theme Detection**: Checks system preferences and stored user preferences.
- **Theme Application**: Applies the appropriate theme by setting data attributes and updating styles.
- **Preference Storage**: Saves user theme preference to localStorage for persistence.

#### 4. script-loader.js
**Purpose**: Optimize JavaScript loading.

**Key Components**:
- Deferred script loading
- Conditional resource loading
- Performance monitoring

**Implementation Details**:
- Asynchronous loading patterns
- Dependency management
- Error handling for failed loads

**Detailed Functionality**:
- **Deferred Loading**: Loads non-critical scripts after page rendering is complete.
- **Conditional Loading**: Only loads scripts needed for the current page context.
- **Error Recovery**: Provides fallbacks when script loading fails.

#### 5. lazy-load.js
**Purpose**: Implement lazy loading for images.

**Key Components**:
- Image lazy loading
- Placeholder management
- Viewport detection

**Implementation Details**:
- IntersectionObserver API usage
- Progressive image loading
- Fallbacks for older browsers

**Detailed Functionality**:
- **Image Detection**: Identifies images that should be lazy loaded.
- **Viewport Monitoring**: Loads images only as they approach the viewport.
- **Loading States**: Manages transitions from placeholder to loaded image.

## Usage Instructions

### Local Development
1. Clone the repository
2. Open the project in your preferred code editor
3. Launch the site using a local server (e.g., Live Server extension in VS Code)
4. Navigate to `frontend/templates/index.html` to view the home page

### Customization
1. **Content Updates**:
   - Edit HTML files in the `frontend/templates` directory to update page content
   - Replace images in the `frontend/images` directory with your own

2. **Styling Changes**:
   - Modify theme variables in `style.css` to change colors and typography
   - Adjust component styles in their respective CSS files

3. **Feature Modifications**:
   - Update JavaScript functionality in `script.js`
   - Modify animations in `animations.css`

4. **Adding New Pages**:
   - Create a new HTML file in the `templates` directory
   - Link the new page in the navigation menu
   - Add page-specific styles if needed

## Customization Guide

### Theme Customization
The website uses CSS custom properties for theming. To change the color scheme:

1. Open `frontend/css/style.css`
2. Locate the `:root` selector containing theme variables
3. Modify the color values for both light and dark themes

Example:
```css
:root {
    /* Light theme variables */
    --bg-color: #fff; /* Change to your preferred background color */
    --text-color: #333; /* Change to your preferred text color */
    /* Other variables... */
}

[data-theme="dark"] {
    /* Dark theme variables */
    --bg-color: #181818; /* Change to your preferred dark background color */
    --text-color: #fff; /* Change to your preferred dark theme text color */
    /* Other variables... */
}
```

### Adding New Tour Packages
To add a new tour package:

1. Open the appropriate tour page HTML file (e.g., `Domestic Tours.html`)
2. Locate the tour grid section
3. Copy an existing tour card structure
4. Update the content, image, and links

Example:
```html
<div class="trip-card">
    <div class="trip-img">
        <img src="../images/your-new-image.avif" alt="New Destination">
    </div>
    <div class="trip-info">
        <h3 class="trip-name">New Destination Package</h3>
        <p class="trip-description">Experience the beauty of New Destination with our exclusive package.</p>
        <div class="trip-meta">
            <span><i class='bx bx-time'></i> 5 Days</span>
            <span><i class='bx bx-group'></i> Max 10 People</span>
            <span><i class='bx bx-calendar'></i> Available Year-round</span>
        </div>
        <div class="trip-price">₹24,999 <span>per person</span></div>
        <button class="trip-button">Book Now</button>
    </div>
</div>
```

### Modifying the Navigation Menu
To update the navigation menu:

1. Open each HTML file that needs updating
2. Locate the `<nav>` element
3. Modify the menu items as needed

Example:
```html
<div id="nav-part3">
    <a href="index.html"><h3><span>Home</span> <span><i class='bx bxs-home-alt-2'></i></span></h3></a>
    <a href="aboutus.html"><h3><span>About Us</span> <span><i class='bx bxs-invader'></i></span></h3></a>
    <h3 id="ourservices"><span>Our Services</span> <span><i class='bx bxs-invader'></i></span></h3>
    <h3 id="trips"><span>Trips</span> <span><i class='bx bxl-airbnb'></i></span></h3>
    <a href="contactus.html"><h3>Contact Us <span><i class='bx bx-mail-send'></i></span></h3></a>
    <!-- Add your new menu item here -->
    <a href="newpage.html"><h3>New Page <span><i class='bx bx-star'></i></span></h3></a>
</div>
```

### Adding Custom JavaScript Functionality
To add custom JavaScript:

1. Open `frontend/js/script.js`
2. Add your custom function within the DOMContentLoaded event listener
3. Call your function at the appropriate point

Example:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Your custom function
    function myCustomFeature() {
        const element = document.querySelector('.my-element');
        if (element) {
            element.addEventListener('click', function() {
                console.log('Custom feature activated');
                // Your feature implementation
            });
        }
    }
    
    // Call your function
    myCustomFeature();
});
```

---

## Conclusion

The Abhi Tours & Travels website is a comprehensive showcase of travel services with a focus on user experience, performance, and visual appeal. The modular structure allows for easy maintenance and future expansion, while the responsive design ensures a consistent experience across all devices.

The implementation combines modern web technologies and best practices to create a fast, accessible, and engaging platform for travel enthusiasts to discover and book their next adventure.

For questions or support, please contact the development team at [svinays850@gmail.com](mailto:svinays850@gmail.com).
