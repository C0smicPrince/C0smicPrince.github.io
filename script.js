// ─── Marked + Highlight.js Integration ──────────────────────────────────────

marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
        }
        return hljs.highlightAuto(code).value;
    }
});

// ─── Data Sources ─────────────────────────────────────────────────────────────
// To add a new post: edit the JSON file in data/. Never touch this file for content.
// To add a new section: add an entry here AND in SECTIONS below.

const DATA_SOURCES = {
    writeups:  'data/writeups.json',
    malware:   'data/malware.json',
    detection: 'data/detection.json',
};

// Runtime stores — populated at boot via fetch
let WRITEUPS  = [];
let MALWARE   = [];
let DETECTION = [];

// ─── Section Registry ─────────────────────────────────────────────────────────
// To add a new section: add an entry here with its store getter and nav label.

const SECTIONS = {
    writeups:  { store: () => WRITEUPS,   label: 'Writeups',       grid: 'writeups-grid'  },
    malware:   { store: () => MALWARE,    label: 'Malware Dev',    grid: 'malware-grid'   },
    detection: { store: () => DETECTION,  label: 'Detection Eng',  grid: 'detection-grid' },
};

// ─── Giscus Config ───────────────────────────────────────────────────────────

const GISCUS_CONFIG = {
    repo:             "C0smicPrince/C0smicPrince.github.io",
    repoId:           "R_kgDOSv4EoQ",
    category:         "General",
    categoryId:       "DIC_kwDOSv4Eoc4C_HJI",
    mapping:          "specific",
    strict:           "0",
    reactionsEnabled: "1",
    emitMetadata:     "0",
    inputPosition:    "bottom",
    theme:            "dark",
    lang:             "en"
};

// ─── Slug Helpers ─────────────────────────────────────────────────────────────

function toSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function findEntryBySlug(section, slug) {
    const sec = SECTIONS[section];
    if (!sec) return -1;
    return sec.store().findIndex(e => toSlug(e.title) === slug);
}

// ─── Toast Notifications ──────────────────────────────────────────────────────

function showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('fade-out'), duration);
    setTimeout(() => toast.remove(), duration + 300);
}

// ─── Copy Button Engine ───────────────────────────────────────────────────────

function addCopyButtonsToCodeBlocks() {
    document.querySelectorAll('.post-content pre').forEach((preBlock) => {
        if (preBlock.parentElement.classList.contains('code-wrapper')) return;

        const codeEl = preBlock.querySelector('code');
        if (codeEl && !codeEl.classList.contains('hljs')) {
            codeEl.classList.add('language-cpp');
            hljs.highlightElement(codeEl);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        preBlock.parentNode.insertBefore(wrapper, preBlock);
        wrapper.appendChild(preBlock);

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

// ─── Lightbox Engine ──────────────────────────────────────────────────────────

function addImgLightboxListeners() {
    let lightbox = document.querySelector('.lightbox-modal');

    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = '<img src="" alt="Enlarged focus viewport">';
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    document.querySelectorAll('.post-content img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.querySelector('img').src = img.src;
            lightbox.classList.add('active');
        });
    });
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function buildMeta(entry) {
    let html = '';
    if (entry.platform || entry.difficulty || entry.tags?.length) {
        html += '<div class="card-meta">';
        if (entry.platform) {
            const cls = ['HTB', 'THM', 'PG', 'VH'].includes(entry.platform)
                ? 'badge-' + entry.platform : 'badge-OTHER';
            html += `<span class="badge ${cls}">${entry.platform}</span>`;
        }
        if (entry.difficulty) {
            html += `<span class="diff diff-${entry.difficulty}">${entry.difficulty}</span>`;
        }
        entry.tags?.forEach(t => { html += `<span class="tag">${t}</span>`; });
        html += '</div>';
    }
    return html;
}

function truncate(text, wordLimit) {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(' ') + '…';
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

// ─── Giscus Comments ──────────────────────────────────────────────────────────

function loadComments(term) {
    const container = document.getElementById('comments-section');
    if (!container) return;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    const attrs = {
        'data-repo':              GISCUS_CONFIG.repo,
        'data-repo-id':           GISCUS_CONFIG.repoId,
        'data-category':          GISCUS_CONFIG.category,
        'data-category-id':       GISCUS_CONFIG.categoryId,
        'data-mapping':           GISCUS_CONFIG.mapping,
        'data-term':              term,
        'data-strict':            GISCUS_CONFIG.strict,
        'data-reactions-enabled': GISCUS_CONFIG.reactionsEnabled,
        'data-emit-metadata':     GISCUS_CONFIG.emitMetadata,
        'data-input-position':    GISCUS_CONFIG.inputPosition,
        'data-theme':             GISCUS_CONFIG.theme,
        'data-lang':              GISCUS_CONFIG.lang,
        'crossorigin':            'anonymous',
    };
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
    script.async = true;
    container.appendChild(script);
}

// ─── Navigation (hash-based) ──────────────────────────────────────────────────

function navigate(viewId) {
    window.location.hash = viewId;
}

function openPost(section, index) {
    const sec = SECTIONS[section];
    if (!sec) return;
    const entry = sec.store()[index];
    window.location.hash = `${section}/${toSlug(entry.title)}`;
}

function closePost() {
    const hash = window.location.hash.replace('#', '');
    const section = hash.split('/')[0];
    navigate(SECTIONS[section] ? section : 'home');
}

function handleHash() {
    const raw   = window.location.hash.replace('#', '') || 'home';
    const parts = raw.split('/');
    const view  = parts[0];
    const slug  = parts[1];

    document.querySelectorAll('.view, .post-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));

    const sec = SECTIONS[view];

    if (slug && sec) {
        const index = findEntryBySlug(view, slug);
        if (index === -1) { showView(view); return; }

        const entry = sec.store()[index];
        document.getElementById('back-btn').textContent = '← ' + sec.label;
        document.getElementById('post-content').innerHTML = '<p class="loading">Loading...</p>';
        document.getElementById('post').classList.add('active-view');

        fetch(entry.file)
            .then(r => { if (!r.ok) throw new Error('File not found'); return r.text(); })
            .then(md => {
                document.getElementById('post-content').innerHTML = marked.parse(md);
                addCopyButtonsToCodeBlocks();
                addImgLightboxListeners();
            })
            .catch(() => {
                document.getElementById('post-content').innerHTML =
                    '<p style="color:var(--text-muted)">Could not load post. Make sure the .md file exists at the path specified in data/.</p>';
            });

        loadComments(`${view}/${slug}`);
    } else {
        const validViews = ['home', ...Object.keys(SECTIONS)];
        showView(validViews.includes(view) ? view : 'home');
    }
}

function showView(viewId) {
    document.getElementById(viewId).classList.add('active-view');
    const link = document.getElementById('link-' + viewId);
    if (link) link.classList.add('active');
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

async function boot() {
    try {
        const results = await Promise.all(
            Object.values(DATA_SOURCES).map(url =>
                fetch(url).then(r => {
                    if (!r.ok) throw new Error(`Failed to fetch ${url} (${r.status})`);
                    return r.json();
                })
            )
        );

        [WRITEUPS, MALWARE, DETECTION] = results;

        Object.entries(SECTIONS).forEach(([key, sec]) => {
            renderGrid(sec.store(), sec.grid, key);
        });

        window.addEventListener('hashchange', handleHash);
        handleHash();
    } catch (err) {
        console.error('[boot] Failed to load site data:', err);
        document.querySelectorAll('.grid').forEach(g => {
            g.innerHTML = '<p style="color:var(--text-muted)">Failed to load content. Check the browser console.</p>';
        });
    }
}

boot();
