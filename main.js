function navigate(targetId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active-view');
    });
    
    // Remove active styling from all side nav links
    document.querySelectorAll('.side-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Show target view
    document.getElementById(targetId).classList.add('active-view');
    
    // Highlight side nav link if it exists
    const activeLink = document.getElementById('link-' + targetId);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Function to fetch and render a markdown file
async function loadMarkdown(filename) {
    const contentDiv = document.getElementById('markdown-content');
    contentDiv.innerHTML = "<p>Loading module...</p>";
    
    navigate('markdown-viewer');

    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error('File not found');
        
        const text = await response.text();
        contentDiv.innerHTML = marked.parse(text);
        
    } catch (error) {
        contentDiv.innerHTML = `<p style="color: var(--accent-red);">Error loading <strong>${filename}</strong>.</p>`;
    }
}

// Default route
window.addEventListener('DOMContentLoaded', () => {
    navigate('dashboard');
});
