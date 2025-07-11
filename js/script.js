// Variables for certificate section
let currentCertificateRow = 0;
const totalCertificateRows = 5; // We have 5 rows total

// Functions for certificate row navigation
function showCertificateRow(rowIndex) {
    // Update wrapper position to show the correct row
    const wrapper = document.querySelector('.certificates-wrapper');
    wrapper.style.transform = `translateY(-${rowIndex * 100}%)`;
    
    // Update active dot
    const dots = document.querySelectorAll('.pagination-dots .dot');
    dots.forEach((dot, index) => {
        if (index === rowIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update current row index
    currentCertificateRow = rowIndex;
}

function nextCertificateRow() {
    if (currentCertificateRow < totalCertificateRows - 1) {
        showCertificateRow(currentCertificateRow + 1);
    } else {
        // Loop back to the first row
        showCertificateRow(0);
    }
}

function prevCertificateRow() {
    if (currentCertificateRow > 0) {
        showCertificateRow(currentCertificateRow - 1);
    } else {
        // Loop to the last row
        showCertificateRow(totalCertificateRows - 1);
    }
}

function goToCertificateRow(rowIndex) {
    showCertificateRow(rowIndex);
}

// Functions for individual certificate image navigation
function prevSlideCert(certIndex) {
    const gallery = document.querySelectorAll('.certificate-item .gallery-slide')[certIndex];
    const imageWidth = gallery.querySelector('img').offsetWidth;
    
    // Get the current position
    const currentPosition = parseInt(gallery.style.transform.replace('translateX(', '').replace('px)', '') || 0);
    
    // Check if we're at the first image
    if (currentPosition >= 0) {
        // Go to the last image
        const imageCount = gallery.querySelectorAll('img').length;
        gallery.style.transform = `translateX(${-imageWidth * (imageCount - 1)}px)`;
    } else {
        // Move to the previous image
        gallery.style.transform = `translateX(${currentPosition + imageWidth}px)`;
    }
}

function nextSlideCert(certIndex) {
    const gallery = document.querySelectorAll('.certificate-item .gallery-slide')[certIndex];
    const imageWidth = gallery.querySelector('img').offsetWidth;
    const imageCount = gallery.querySelectorAll('img').length;
    
    // Get the current position
    const currentPosition = parseInt(gallery.style.transform.replace('translateX(', '').replace('px)', '') || 0);
    
    // Check if we're at the last image
    if (currentPosition <= -imageWidth * (imageCount - 1)) {
        // Go back to the first image
        gallery.style.transform = 'translateX(0px)';
    } else {
        // Move to the next image
        gallery.style.transform = `translateX(${currentPosition - imageWidth}px)`;
    }
}

// Initialize certificate section on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize certificate row slider
    showCertificateRow(0);
    
    // Initialize all certificate image galleries
    const galleries = document.querySelectorAll('.certificate-item .gallery-slide');
    galleries.forEach(gallery => {
        gallery.style.transform = 'translateX(0px)';
    });
});