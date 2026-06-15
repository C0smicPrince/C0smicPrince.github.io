const WRITEUPS = [
    {
        title:      "Devvortex",
        file:       "writeups/HTB_devvortex.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["linux", "web"],
        description: "Devvortex is an easy-difficulty Linux machine that features a Joomla CMS that is vulnerable to information disclosure. Accessing the service's configuration file reveals plaintext credentials that lead to Administrative access to the Joomla instance. With administrative access, the Joomla template is modified to include malicious PHP code and gain a shell. After gaining a shell and enumerating the database contents, hashed credentials are obtained, which are cracked and lead to SSH access to the machine. Post-exploitation enumeration reveals that the user is allowed to run apport-cli as root, which is leveraged to obtain a root shell."
    },
    {
        title:      "Forest",
        file:       "writeups/HTB_forest.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["windows", "Active Directory"],
        description: "Forest is an easy Windows machine that showcases a Domain Controller (DC) for a domain in which Exchange Server has been installed. The DC allows anonymous LDAP binds, which are used to enumerate domain objects. The password for a service account with Kerberos pre-authentication disabled can be cracked to gain a foothold. The service account is found to be a member of the Account Operators group, which can be used to add users to privileged Exchange groups. The Exchange group membership is leveraged to gain DCSync privileges on the domain and dump the NTLM hashes, compromising the system."
    },
    {
        title:      "Sauna",
        file:       "writeups/HTB_sauna.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["windows", "Active Directory"],
        description: "Sauna is an easy difficulty Windows machine that features Active Directory enumeration and exploitation. Possible usernames can be derived from employee full names listed on the website. With these usernames, an ASREPRoasting attack can be performed, which results in hash for an account that doesn't require Kerberos pre-authentication. This hash can be subjected to an offline brute force attack, in order to recover the plaintext password for a user that is able to WinRM to the box. Running WinPEAS reveals that another system user has been configured to automatically login and it identifies their password. This second user also has Windows remote management permissions. BloodHound reveals that this user has the DS-Replication-Get-Changes-All extended right, which allows them to dump password hashes from the Domain Controller in a DCSync attack"
    },
    {
        title:      "Heal",
        file:       "writeups/HTB_heal.md",
        platform:   "HTB",
        difficulty: "Medium",
        tags:       ["Linux", "Web"],
        description: "Heal is a medium-difficult Linux machine that features a website vulnerable to arbitrary file read, allowing us to extract sensitive credentials. The server also hosts a LimeSurvey instance, where the leaked credentials can be used to log in as an administrator. Since administrators can upload plugins, we can exploit this to upload a malicious plugin and gain a reverse shell as the user. Further enumeration reveals the database password for LimeSurvey, which is reused by the system user , allowing us to escalate access. The server also runs a local instance of the Consul Agent as . By registering a malicious service via the Consul API, we can escalate privileges and gain root access."
    },
    {
        title:      "Chill Hack",
        file:       "writeups/THM_chillhack.md",
        platform:   "THM",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "Chill Hack is an easy-difficulty TryHackMe room focusing on web exploitation, filter bypasses, and privilege escalation. After discovering a hidden web endpoint (/secret), players must exploit a command injection flaw, using piping or Base64 encoding to bypass string filters and gain a www-data shell. Lateral movement involves exploiting an insecure custom bash script running via sudo to become the user apaar. From there, players utilize Ligolo-NG to pivot into internal ports, access a portal, and crack an offline backup archive to harvest credentials for the user anurodh. Finally, root access is achieved by exploiting a dangerous Docker group misconfiguration, allowing players to mount the host filesystem."
    }
];

const MALWARE = [
    {
        title:      "Direct Syscalls Via SysWhispers3",
        file:       "MalwareDev/DirectSysCalls/DirectSyscalls.md",
        tags:       ["Direct Syscalls", "SysWhispers3", "c++"],
        description: "Adding soon..."
    },
    {
        title:      "How to do API Hashing: Mastering IAT Evasion And PEB Walking",
        file:       "MalwareDev/API-Hashing/api_hashing.md",
        tags:       ["API Hashing", "PEB Walking", "c++"],
        description: "Adding soon..."
    },
    {
        title:      "Classic DLL Injection",
        file:       "MalwareDev/Classic_Dll_Injection/DLLInjection.md",
        tags:       ["DLL", "Injection", "c++"],
        description: "Adding soon..."
    }
];

// ─── Giscus comments config ─────────────────────────────────────────────────
const GISCUS_CONFIG = {
    repo:          "C0smicPrince/C0smicPrince.github.io",
    repoId:        "R_kgDOSv4EoQ",
    category:      "General",
    categoryId:    "DIC_kwDOSv4Eoc4C_HJI",
    mapping:       "specific",
    strict:        "0",
    reactionsEnabled: "1",
    emitMetadata:  "0",
    inputPosition: "bottom",
    theme:          "dark",
    lang:          "en"
};

// ─── Slug helpers ────────────────────────────────────────────────────────────

function toSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function findEntryBySlug(section, slug) {
    const list = section === 'writeups' ? WRITEUPS : MALWARE;
    return list.findIndex(e => toSlug(e.title) === slug);
}

// ─── Toast Notifications ─────────────────────────────────────────────────────

function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
    }, duration);

    setTimeout(() => {
        toast.remove();
    }, duration + 300);
}

// ─── Stationary Copy Button Engine ──────────────────────────────────────────

/**
 * Wraps code blocks inside a structural container to prevent buttons tracking horizontal scroll shifts
 */
function addCopyButtonsToCodeBlocks() {
    const preBlocks = document.querySelectorAll('.post-content pre');
    
    preBlocks.forEach((preBlock) => {
        // Idempotency check: Don't wrap blocks already processed
        if (preBlock.parentElement.classList.contains('code-wrapper')) return;

        // 1. Create stationary wrapping container
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        // 2. Inject wrapper frame right before target block frame
        preBlock.parentNode.insertBefore(wrapper, preBlock);
        wrapper.appendChild(preBlock);

        // 3. Assemble target copy element directly into stationary wrapper layout context
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'COPY';
        copyBtn.type = 'button';
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
        
        wrapper.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const codeText = preBlock.querySelector('code')?.textContent || '';
            
            navigator.clipboard.writeText(codeText).then(() => {
                copyBtn.textContent = 'COPIED!';
                copyBtn.classList.add('copied');
                
                showToast('✓ Code copied to clipboard!', 2000);
                
                setTimeout(() => {
                    copyBtn.textContent = 'COPY';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                showToast('✗ Failed to copy code', 2000);
            });
        });
    });
}

// ─── Lightbox Overlay Engine ───────────────────────────────────────────

/**
 * Links static post images to a clean fullscreen magnification view layout overlay
 */
function addImgLightboxListeners() {
    const images = document.querySelectorAll('.post-content img');
    let lightbox = document.querySelector('.lightbox-modal');
    
    // Inject overlay container dynamically on page context layout frames if missing
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = '<img src="" alt="Enlarged focus viewport">';
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });
}

// ─── Rendering ───────────────────────────────────────────────────────────────

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

function truncate(text, wordLimit) {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= wordLimit
        ? text
        : words.slice(0, wordLimit).join(' ') + '…';
}

function renderGrid(entries, gridId, section) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = entries.map((e, i) => `
        <div class="card" onclick="openPost('${section}', ${i})">
            ${buildMeta(e)}
            <h3>${e.title}</h3>
            <p>${truncate(e.description, 20)}</p>
        </div>
    `).join('');
}

// ─── Giscus comments ─────────────────────────────────────────────────────────

function loadComments(term) {
    const container = document.getElementById('comments-section');
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping);
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', GISCUS_CONFIG.strict);
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata);
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition);
    script.setAttribute('data-theme', GISCUS_CONFIG.theme);
    script.setAttribute('data-lang', GISCUS_CONFIG.lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);
}

// ─── Navigation (hash-based) ─────────────────────────────────────────────────

function navigate(viewId) {
    window.location.hash = viewId;
}

function openPost(section, index) {
    const entry = section === 'writeups' ? WRITEUPS[index] : MALWARE[index];
    window.location.hash = `${section}/${toSlug(entry.title)}`;
}

function closePost() {
    const hash = window.location.hash.replace('#', '');
    const section = hash.split('/')[0];
    navigate(['writeups', 'malware'].includes(section) ? section : 'home');
}

function handleHash() {
    const raw   = window.location.hash.replace('#', '') || 'home';
    const parts = raw.split('/');
    const view  = parts[0];
    const slug  = parts[1];

    document.querySelectorAll('.view, .post-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));

    if (slug && (view === 'writeups' || view === 'malware')) {
        const index = findEntryBySlug(view, slug);
        if (index === -1) {
            showView(view);
            return;
        }
        const entry    = view === 'writeups' ? WRITEUPS[index] : MALWARE[index];
        const backLabel = view === 'writeups' ? 'Writeups' : 'Malware Dev';

        document.getElementById('back-btn').textContent = '← ' + backLabel;
        document.getElementById('post-content').innerHTML = '<p class="loading">Loading...</p>';
        document.getElementById('post').classList.add('active-view');

        fetch(entry.file)
            .then(r => {
                if (!r.ok) throw new Error('File not found');
                return r.text();
            })
            .then(md => {
                document.getElementById('post-content').innerHTML = marked.parse(md);
                
                // Initialize functional utilities immediately following native DOM mutations
                addCopyButtonsToCodeBlocks();
                addImgLightboxListeners();
            })
            .catch(() => {
                document.getElementById('post-content').innerHTML =
                    '<p style="color:var(--text-muted)">Could not load post. Make sure the .md file exists at the path specified in the config.</p>';
            });

        loadComments(`${view}/${slug}`);
    } else {
        showView(['home', 'writeups', 'malware'].includes(view) ? view : 'home');
    }
}

function showView(viewId) {
    document.getElementById(viewId).classList.add('active-view');
    const link = document.getElementById('link-' + viewId);
    if (link) link.classList.add('active');
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

renderGrid(WRITEUPS, 'writeups-grid', 'writeups');
renderGrid(MALWARE,  'malware-grid',  'malware');

window.addEventListener('hashchange', handleHash);
handleHash();
