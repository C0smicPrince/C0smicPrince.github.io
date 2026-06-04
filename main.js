function navigate(targetId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active styling from all links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
    });

    // Show target section
    document.getElementById(targetId).classList.add('active');
    
    // Highlight nav link if it exists
    const activeLink = document.getElementById('link-' + targetId);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }
    
    // Update URL hash smoothly
    history.pushState(null, null, '#' + targetId);
}

// Function to fetch and render a markdown file
async function loadMarkdown(filename) {
    const contentDiv = document.getElementById('markdown-content');
    contentDiv.innerHTML = "<p>Loading...</p>";
    
    // Switch to the markdown viewer section immediately
    navigate('markdown-viewer');

    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error('File not found');
        
        const text = await response.text();
        contentDiv.innerHTML = marked.parse(text);
        
    } catch (error) {
        contentDiv.innerHTML = `<p>Error loading <strong>${filename}</strong>. Ensure the file exists in the directory.</p>`;
    }
}

// Handle page load and set default routing to Home
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navigate(hash);
    } else {
        navigate('home');
    }
});
