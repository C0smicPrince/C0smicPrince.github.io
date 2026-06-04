const WRITEUPS = [
    {
        title:      "Devvortex",
        file:       "writeups/HTB_devvortex.md",
        platform:   "HTB",
        difficulty: "Easy",
        tags:       ["linux", "web"],
        description: "Devvortex is an easy-difficulty Linux machine that features a Joomla CMS that is vulnerable to information disclosure. Accessing the service&#039;s configuration file reveals plaintext credentials that lead to Administrative access to the Joomla instance. With administrative access, the Joomla template is modified to include malicious PHP code and gain a shell. After gaining a shell and enumerating the database contents, hashed credentials are obtained, which are cracked and lead to SSH access to the machine. Post-exploitation enumeration reveals that the user is allowed to run apport-cli as root, which is leveraged to obtain a root shell."
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
        description: "Sauna is an easy difficulty Windows machine that features Active Directory enumeration and exploitation. Possible usernames can be derived from employee full names listed on the website. With these usernames, an ASREPRoasting attack can be performed, which results in hash for an account that doesn&amp;#039;t require Kerberos pre-authentication. This hash can be subjected to an offline brute force attack, in order to recover the plaintext password for a user that is able to WinRM to the box. Running WinPEAS reveals that another system user has been configured to automatically login and it identifies their password. This second user also has Windows remote management permissions. BloodHound reveals that this user has the DS-Replication-Get-Changes-All extended right, which allows them to dump password hashes from the Domain Controller in a DCSync attack"
    },
    {
        title:      "Heal",
        file:       "writeups/HTB_heal.md",
        platform:   "HTB",
        difficulty: "Medium",
        tags:       ["Linux", "Web"],
        description: "Heal is a medium-difficult Linux machine that features a website vulnerable to arbitrary file read, allowing us to extract sensitive credentials. The server also hosts a LimeSurvey instance, where the leaked credentials can be used to log in as an administrator. Since administrators can upload plugins, we can exploit this to upload a malicious plugin and gain a reverse shell as the user. Further enumeration reveals the database password for LimeSurvey, which is reused by the system user , allowing us to escalate access. The server also runs a local instance of the Consul Agent as . By registering a malicious service via the Consul API, we can escalate privileges and gain root access."
    },
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
