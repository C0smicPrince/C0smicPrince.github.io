function navigate(targetId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active styling from all links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
    });

    // Show target section and highlight active link
    document.getElementById(targetId).classList.add('active');
    document.getElementById('link-' + targetId).classList.add('active-link');
    
    // Update URL hash smoothly
    history.pushState(null, null, '#' + targetId);
}

// Handle page load with specific hash
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navigate(hash);
    }
});
