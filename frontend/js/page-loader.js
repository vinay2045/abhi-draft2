/**
 * Advanced page loader script
 * Completely prevents any flash of unstyled content (FOUC) and ensures smooth page transitions
 */

// Add loading class to HTML element immediately
document.documentElement.classList.add('loading');

// Create and insert the loading overlay
function createLoader() {
  const loaderHTML = `
    <div class="page-loader">
      <span class="loader"></span>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', loaderHTML);
}

// Function to remove the loader
function removeLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 300);
  }
}

// Function to show the page content
function showPage() {
  document.documentElement.classList.remove('loading');
}

// Initialize the loader as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createLoader);
} else {
  createLoader();
}

// Wait for everything to be fully loaded
window.addEventListener('load', function() {
  // Small delay to ensure everything is rendered properly
  setTimeout(function() {
    showPage();
    removeLoader();
  }, 50);
});
