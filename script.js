const WRITEUPS = [
    {
        title:      "Titanic",
        file:       "writeups/HTB_Titanic.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["linux", "web"],
        description: "beginning with web reconnaissance that unveils a critical arbitrary file read vulnerability. leveraging this flaw to traverse the filesystem, extract sensitive configuration files, and crack database credentials for initial SSH access. Continuing with a local privilege escalation, where we identify and exploit a vulnerable version of ImageMagick to achieve root-level control."
    },
    {
        title:      "Box Name 02",
        file:       "writeups/box-name-02.md",
        platform:   "THM",
        difficulty: "Medium",
        tags:       ["windows", "privesc"],
        description: "Methodology overview and key findings."
    }
];

const MALWARE = [
    {
        title:      "Project Alpha",
        file:       "Dev/project-alpha.md",
        tags:       ["shellcode", "dropper", "c2"],
        description: "Staged encrypted shellcode dropper for Sliver C2."
    },
    {
        title:      "Project Beta",
        file:       "Dev/project-beta.md",
        tags:       ["rootkit", "kernel", "dkom"],
        description: "Kernel-level rootkit prototype targeting Windows 10/11."
    }
];

function buildMeta(entry) {
    let html = '';
    if (entry.platform || entry.difficulty || (entry.tags && entry.tags.length)) {
        html += '<div class="card-meta">';
        if (entry.platform) {
            const cls = ['HTB','THM','PG','VH'].includes(entry.platform)
                ? 'badge-' + entry.platform : 'badge-OTHER';
            html += `<span class="badge ${cls}">${entry.platform}</span>`;
        }
        if (entry.difficulty) {
            html += `<span class="diff diff-${entry.difficulty}">${entry.difficulty}</span>`;
        }
        if (entry.tags) {
            entry.tags.forEach(t => { html += `<span class="tag">${t}</span>`; });
        }
        html += '</div>';
    }
    return html;
}

function renderGrid(entries, gridId, section) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = entries.map((e, i) => `
        <div class="card" onclick="openPost('${section}', ${i})">
            ${buildMeta(e)}
            <h3>${e.title}</h3>
            <p>${e.description || ''}</p>
        </div>
    `).join('');
}

let previousView = 'home';

function navigate(viewId) {
    document.querySelectorAll('.view, .post-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
    document.getElementById(viewId).classList.add('active-view');
    const link = document.getElementById('link-' + viewId);
    if (link) link.classList.add('active');
    previousView = viewId;
}

function openPost(section, index) {
    previousView = section;
    const entry = section === 'writeups' ? WRITEUPS[index] : MALWARE[index];
    const backLabel = section === 'writeups' ? 'Writeups' : 'Malware Dev';

    document.getElementById('back-btn').textContent = '← ' + backLabel;
    document.getElementById('post-content').innerHTML = '<p class="loading">Loading...</p>';

    document.querySelectorAll('.view, .post-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
    document.getElementById('post').classList.add('active-view');

    fetch(entry.file)
        .then(r => {
            if (!r.ok) throw new Error('File not found');
            return r.text();
        })
        .then(md => {
            document.getElementById('post-content').innerHTML = marked.parse(md);
        })
        .catch(() => {
            document.getElementById('post-content').innerHTML =
                '<p style="color:var(--text-muted)">Could not load post. Make sure the .md file exists at the path specified in the config.</p>';
        });
}

function closePost() { navigate(previousView); }

renderGrid(WRITEUPS, 'writeups-grid', 'writeups');
renderGrid(MALWARE,  'malware-grid',  'malware');
