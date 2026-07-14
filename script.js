// ─── Marked + Highlight.js Integration ──────────────────────────────────────

marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
        }
        return hljs.highlightAuto(code).value;
    }
});

// ─── Data ─────────────────────────────────────────────────────────────────────

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
    },
    {
        title:      "Green Horn",
        file:       "writeups/HTB_Greenhorn.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "GreenHorn is an easy difficulty machine that takes advantage of an exploit in Pluck to achieve Remote Code Execution and then demonstrates the dangers of pixelated credentials. The machine also showcases that we must be careful when sharing open-source configurations to ensure that we do not reveal files containing passwords or other information that should be kept confidential."
    },
    {
        title:      "PermX",
        file:       "writeups/HTB_Permx.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "PermX is an Easy Difficulty Linux machine featuring a learning management system vulnerable to unrestricted file uploads via CVE-2023-4220. This vulnerability is leveraged to gain a foothold on the machine. Enumerating the machine reveals credentials that lead to SSH access. A misconfiguration is then exploited to gain a shell."
    },
    {
        title:      "Editorial",
        file:       "writeups/HTB_Editorial.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "Editorial is an easy difficulty Linux machine that features a publishing web application vulnerable to . This vulnerability is leveraged to gain access to an internal running API, which is then leveraged to obtain credentials that lead to access to the machine. Enumerating the system further reveals a Git repository that is leveraged to reveal credentials for a new user. The user can be obtained by exploiting CVE-2022-24439 and the sudo configuration."
    },
    {
        title:      "Usage",
        file:       "writeups/HTB_Usage.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "Usage is an easy Linux machine that features a blog site vulnerable to SQL injection, which allows the administrator&amp;#039;s hashed password to be dumped and cracked. This leads to access to the admin panel, where an outdated module is abused to upload a PHP web shell and obtain remote code execution. On the machine, plaintext credentials stored in a file allow SSH access as another user, who can run a custom binary as . The tool makes an insecure call to , which is leveraged to read the user&amp;#039;s private SSH key and fully compromise the system."
    },
    {
        title:      "BoardLight",
        file:       "writeups/HTB_Boardlight.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "BoardLight is an easy difficulty Linux machine that features a instance vulnerable to CVE-2023-30253. This vulnerability is leveraged to gain access as . After enumerating and dumping the web configuration file contents, plaintext credentials lead to access to the machine. Enumerating the system, a binary related to is identified which is vulnerable to privilege escalation via CVE-2022-37706 and can be abused to leverage a root shell."
    },
    {
        title:      "Perfection",
        file:       "writeups/HTB_Perfection.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["Linux", "Web", "Privilege Escalation"],
        description: "Perfection is an easy Linux machine that features a web application with functionality to calculate student scores. This application is vulnerable to Server-Side Template Injection (SSTI) via regex filter bypass. A foothold can be gained by exploiting the SSTI vulnerability. Enumerating the user reveals they are part of the group. Further enumeration uncovers a database with password hashes, and the user&amp;#039;s mail reveals a possible password format. Using a mask attack on the hash, the user&amp;#039;s password is obtained, which is leveraged to gain access."
    }
];

const MALWARE = [
    {
        title:      "Direct Syscalls Via SysWhispers3",
        file:       "MalwareDev/DirectSysCalls/DirectSyscalls.md",
        tags:       ["Direct Syscalls", "SysWhispers3", "c++"],
        description: "Coding a Process Injection using Direct Syscalls"
    },
    {
        title:      "How to do API Hashing: Mastering IAT Evasion And PEB Walking",
        file:       "MalwareDev/API-Hashing/api_hashing.md",
        tags:       ["API Hashing", "PEB Walking", "c++"],
        description: "Using API Hashing to hide Used Imports"
    },
    {
        title:      "Classic DLL Injection",
        file:       "MalwareDev/Classic_Dll_Injection/DLLInjection.md",
        tags:       ["DLL", "Injection", "c++"],
        description: "Coding a classic DLL Injection in c++"
    },
    {
        title:      "Indirect Syscalls Via Syswhispers3",
        file:       "MalwareDev/IndirectSyscalls/IndirectSysCalls.md",
        tags:       ["Indirect SysCalls", "Syswhispers3", "c++"],
        description: "Showcasing how you can code indirect syscalls with process injection as example"
    },
    {
        title:      "Early Bird Injection using c++",
        file:       "MalwareDev/EarlyBird/early-bird-injection.md",
        tags:       ["EarlyBird", "Injections", "c++"],
        description: "Showcasing how you can code a EarlyBird Injection in c++"
    },
    {
        title:      "AES-Encrypted Shellcode Delivery Over Network Using Early Bird Injection",
        file:       "MalwareDev/RemoteDownload/RemoteDownload.md",
        tags:       ["Remote Download", "Encryption", "Early Bird", "Shellcode", "c++"],
        description: "using AES to encrypt shellcode and then in loader decrypting it and using winHTTP to download the shellcode file and executing it with earlybird"
    }
];

const DETECTION = [
    {
        title:      "Coming Soon: Writing Your First YARA Rule From Scratch (Against Real Malware)",
        file:       "DetectionEng/DirectSyscalls/coming_soon.md",
        tags:       ["YARA", "ETW", "Malware"],
        description: "An analytical look into monitoring and catching direct system calls using ETWTI and kernel-level telemetry collection branches."
    },
    {
        title:      "Coming Soon: Fingerprinting My Own Malware: What I Left Behind",
        file:       "DetectionEng/ThreadCreation/coming_soon.md",
        tags:       ["Memory Forensics", "Threat Hunting", "YARA"],
        description: "Spotting rogue memory allocations and anomalous CreateRemoteThread calls before they execute their payloads successfully."
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
    let list;
    if (section === 'writeups') list = WRITEUPS;
    else if (section === 'malware') list = MALWARE;
    else if (section === 'detection') list = DETECTION;
    else return -1;
    
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
 * Wraps code blocks inside a structural container to prevent buttons tracking horizontal scroll shifts.
 * Also runs hljs on any block that wasn't highlighted during markdown parsing (no language hint).
 */
function addCopyButtonsToCodeBlocks() {
    const preBlocks = document.querySelectorAll('.post-content pre');

    preBlocks.forEach((preBlock) => {
        // Idempotency check: Don't wrap blocks already processed
        if (preBlock.parentElement.classList.contains('code-wrapper')) return;

        // Safety-net: highlight any code block that marked didn't highlight (missing lang hint)
        const codeEl = preBlock.querySelector('code');
        if (codeEl && !codeEl.classList.contains('hljs')) {
            codeEl.classList.add('language-cpp');
            hljs.highlightElement(codeEl);
        }

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
    let entry;
    if (section === 'writeups') entry = WRITEUPS[index];
    else if (section === 'malware') entry = MALWARE[index];
    else if (section === 'detection') entry = DETECTION[index];
    
    window.location.hash = `${section}/${toSlug(entry.title)}`;
}

function closePost() {
    const hash = window.location.hash.replace('#', '');
    const section = hash.split('/')[0];
    navigate(['writeups', 'malware', 'detection'].includes(section) ? section : 'home');
}

function handleHash() {
    const raw   = window.location.hash.replace('#', '') || 'home';
    const parts = raw.split('/');
    const view  = parts[0];
    const slug  = parts[1];

    document.querySelectorAll('.view, .post-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));

    if (slug && (view === 'writeups' || view === 'malware' || view === 'detection')) {
        const index = findEntryBySlug(view, slug);
        if (index === -1) {
            showView(view);
            return;
        }
        
        let entry;
        let backLabel;
        if (view === 'writeups') { entry = WRITEUPS[index]; backLabel = 'Writeups'; }
        else if (view === 'malware') { entry = MALWARE[index]; backLabel = 'Malware Dev'; }
        else if (view === 'detection') { entry = DETECTION[index]; backLabel = 'Detection Eng'; }

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
        showView(['home', 'writeups', 'malware', 'detection'].includes(view) ? view : 'home');
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
renderGrid(DETECTION, 'detection-grid', 'detection');

window.addEventListener('hashchange', handleHash);
handleHash();
