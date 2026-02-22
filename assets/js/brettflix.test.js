/**
 * Brettflix Comprehensive Test Suite
 * Runs in Node.js with jsdom. Usage: node assets/js/brettflix.test.js
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// ── Test harness ──────────────────────────────────────────────────────────────
const results = [];
let passed = 0;
let failed = 0;
let currentDescribe = '';

function assert(condition, name) {
    const fullName = currentDescribe ? `${currentDescribe} > ${name}` : name;
    if (condition) {
        passed++;
        results.push({ status: 'PASS', name: fullName });
    } else {
        failed++;
        results.push({ status: 'FAIL', name: fullName });
    }
}

function describe(suiteName, fn) {
    const prev = currentDescribe;
    currentDescribe = prev ? `${prev} > ${suiteName}` : suiteName;
    console.log(`\n  📂 ${suiteName}`);
    fn();
    currentDescribe = prev;
}

function it(testName, fn) {
    try {
        fn();
    } catch (e) {
        // If fn throws, treat it as a failure
        const fullName = currentDescribe ? `${currentDescribe} > ${testName}` : testName;
        failed++;
        results.push({ status: 'FAIL', name: `${fullName} (threw: ${e.message})` });
    }
}

// ── Helper: wait for a setTimeout delay (fake timers) ─────────────────────────
function flushTimers(ms) {
    jest_clock_advance(ms);
}

// ── Fake timer infrastructure ─────────────────────────────────────────────────
let timerQueue = [];
let currentTime = 0;
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

function installFakeTimers() {
    currentTime = 0;
    timerQueue = [];
    global.setTimeout = function fakeSetTimeout(fn, delay) {
        const id = timerQueue.length + 1;
        timerQueue.push({ id, fn, triggerAt: currentTime + (delay || 0) });
        return id;
    };
    global.clearTimeout = function fakeClearTimeout(id) {
        timerQueue = timerQueue.filter(t => t.id !== id);
    };
}

function jest_clock_advance(ms) {
    currentTime += ms;
    const ready = timerQueue.filter(t => t.triggerAt <= currentTime);
    timerQueue = timerQueue.filter(t => t.triggerAt > currentTime);
    ready.sort((a, b) => a.triggerAt - b.triggerAt);
    ready.forEach(t => t.fn());
}

function restoreTimers() {
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
}

// ── Sample project data ───────────────────────────────────────────────────────
const SAMPLE_PROJECTS = [
    {
        id: 'test-project-1',
        title: 'Test Project One',
        description: 'A test project description.',
        fullDescription: '<p>Full description here.</p>',
        heroIcon: 'fas fa-code',
        status: 'released',
        category: 'web',
        tags: ['JavaScript', 'React'],
        descriptors: ['Interactive', 'Modern'],
        media: [{ type: 'trailer', title: 'Demo Video' }],
        githubUrl: 'https://github.com/test/project1',
        videoUrl: 'https://youtube.com/watch?v=123'
    },
    {
        id: 'test-project-2',
        title: 'Test Project Two',
        description: 'Another test project.',
        fullDescription: '<p>Second project.</p>',
        heroIcon: 'fas fa-database',
        status: 'building',
        category: 'data',
        tags: ['Python', 'SQL'],
        descriptors: ['Scalable', 'Fast'],
        media: [],
        githubUrl: 'https://github.com/test/project2'
    }
];

// ── Build the DOM ─────────────────────────────────────────────────────────────
function buildTestHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head><title>BRETTFLIX Test</title></head>
<body>
<a href="#main-content" class="skip-link">Skip to content</a>
<nav class="navbar" role="navigation" aria-label="Main navigation">
    <a href="/" class="nav-logo">BRETTFLIX</a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
    <div class="nav-links">
        <a href="/about">About</a>
    </div>
</nav>
<main id="main-content">
    <div class="hero-content" style="opacity:0">
        <h1>Welcome to BRETTFLIX</h1>
    </div>

    <script id="project-data" type="application/json">${JSON.stringify(SAMPLE_PROJECTS)}</script>

    <section class="title-row">
        <h2 class="row-title">Featured Projects</h2>
        <div class="carousel-wrapper">
            <button class="carousel-arrow carousel-arrow--left" aria-label="Scroll left">‹</button>
            <div class="carousel-track">
                ${SAMPLE_PROJECTS.map((p, i) => `
                <div class="title-card card-grad-${i + 1}" data-project-id="${p.id}" tabindex="0" role="button" aria-label="${p.title}">
                    <div class="title-card-bg"><i class="${p.heroIcon}" aria-hidden="true"></i></div>
                    <div class="title-card-info">
                        <div class="title-card-title">${p.title}</div>
                    </div>
                    <div class="popup-card" aria-hidden="true">
                        <div class="popup-thumbnail card-grad-${i + 1}">
                            <div class="popup-thumb-bg"><i class="${p.heroIcon}" aria-hidden="true"></i></div>
                            <span class="popup-brand">BRETTFLIX</span>
                            <div class="popup-title-overlay">${p.title}</div>
                        </div>
                        <div class="popup-controls">
                            <div class="popup-buttons">
                                <a href="/project.html?id=${p.id}" class="popup-btn popup-btn--play" title="Explore Project"><i class="fas fa-play"></i></a>
                            </div>
                            <button class="popup-btn popup-btn--expand" title="More Info" data-modal-id="${p.id}"><i class="fas fa-chevron-down"></i></button>
                        </div>
                        <div class="popup-meta">
                            <span class="popup-status">${p.status === 'released' ? 'Shipped' : 'Building'}</span>
                            <span class="popup-category">${p.category}</span>
                        </div>
                        <div class="popup-descriptors">${p.descriptors.join(' · ')}</div>
                    </div>
                </div>`).join('\n')}
            </div>
            <button class="carousel-arrow carousel-arrow--right" aria-label="Scroll right">›</button>
        </div>
    </section>

    <div class="modal-overlay" id="detailModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-container">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-hero" id="modalHero">
                <div class="modal-hero-gradient" id="modalHeroGradient"></div>
                <i class="modal-hero-icon" id="modalHeroIcon" aria-hidden="true"></i>
                <span class="modal-brand">BRETTFLIX</span>
                <h2 class="modal-title" id="modalTitle"></h2>
                <div class="modal-hero-buttons" id="modalHeroButtons"></div>
            </div>
            <div class="modal-meta-row" id="modalMetaRow"></div>
            <div class="modal-body">
                <div class="modal-main">
                    <p class="modal-description" id="modalDescription"></p>
                    <div class="modal-full-description" id="modalFullDescription"></div>
                    <div class="modal-media-section" id="modalMediaSection">
                        <h3 class="modal-section-heading">Media</h3>
                        <div class="modal-media-grid" id="modalMediaGrid"></div>
                    </div>
                </div>
                <div class="modal-sidebar">
                    <div class="modal-sidebar-section">
                        <span class="modal-sidebar-label">Tech Stack:</span>
                        <span class="modal-sidebar-value" id="modalTechStack"></span>
                    </div>
                    <div class="modal-sidebar-section">
                        <span class="modal-sidebar-label">Category:</span>
                        <span class="modal-sidebar-value" id="modalCategory"></span>
                    </div>
                    <div class="modal-sidebar-section">
                        <span class="modal-sidebar-label">Descriptors:</span>
                        <span class="modal-sidebar-value" id="modalDescriptors"></span>
                    </div>
                    <div class="modal-sidebar-links" id="modalLinks"></div>
                </div>
            </div>
        </div>
    </div>
</main>
</body>
</html>`;
}

// ── Setup jsdom + load netflix.js ─────────────────────────────────────────────
let dom, document, window;

function setupDOM() {
    dom = new JSDOM(buildTestHTML(), {
        url: 'https://brettreifs.github.io/',
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        resources: 'usable'
    });
    window = dom.window;
    document = window.document;

    // Polyfill APIs that jsdom lacks
    window.scrollTo = function () {};
    window.matchMedia = function (query) {
        return {
            matches: query === '(hover: hover)',
            media: query,
            addEventListener: function () {},
            removeEventListener: function () {}
        };
    };
    if (!window.HTMLElement.prototype.scrollBy) {
        window.HTMLElement.prototype.scrollBy = function (opts) {
            if (typeof opts === 'object') {
                this.scrollLeft += opts.left || 0;
            }
        };
    }

    // requestAnimationFrame polyfill
    window.requestAnimationFrame = function (cb) { cb(); return 0; };

    // Load and execute netflix.js
    const netflixSrc = fs.readFileSync(
        path.join(__dirname, 'netflix.js'), 'utf-8'
    );
    window.eval(netflixSrc);

    // Fire DOMContentLoaded to initialize handlers
    const evt = new window.Event('DOMContentLoaded', { bubbles: true });
    window.document.dispatchEvent(evt);
}

function resetDOM() {
    setupDOM();
}

// ── Helper functions ──────────────────────────────────────────────────────────
function openModalViaButton(projectId) {
    const btn = document.querySelector(`[data-modal-id="${projectId || SAMPLE_PROJECTS[0].id}"]`);
    if (btn) btn.click();
}

function closeModalViaButton() {
    const closeBtn = document.querySelector('#detailModal .modal-close');
    if (closeBtn) closeBtn.click();
}

function isModalOpen() {
    const modal = document.getElementById('detailModal');
    return modal && modal.classList.contains('modal-open');
}

// ══════════════════════════════════════════════════════════════════════════════
//  RUN TESTS
// ══════════════════════════════════════════════════════════════════════════════

console.log('\n========== BRETTFLIX TEST SUITE ==========');

// ── Initial DOM setup ─────────────────────────────────────────────────────────
setupDOM();

// ──────────────────────────────────────────────────────────────────────────────
//  Structure Tests (carried over from original)
// ──────────────────────────────────────────────────────────────────────────────
describe('Structure', () => {
    it('title cards exist on the page', () => {
        const titleCards = document.querySelectorAll('.title-card[data-project-id]');
        assert(titleCards.length > 0, 'Title cards exist on the page');
    });

    it('each card has required popup elements', () => {
        document.querySelectorAll('.title-card[data-project-id]').forEach(card => {
            const id = card.getAttribute('data-project-id');
            const popup = card.querySelector('.popup-card');
            assert(popup !== null, `Card "${id}" has a .popup-card child`);
            if (popup) {
                assert(popup.querySelector('.popup-thumbnail') !== null, `Card "${id}" popup has .popup-thumbnail`);
                assert(popup.querySelector('.popup-brand') !== null, `Card "${id}" popup has .popup-brand`);
                assert(popup.querySelector('.popup-title-overlay') !== null, `Card "${id}" popup has .popup-title-overlay`);
                assert(popup.querySelector('.popup-btn--play') !== null, `Card "${id}" popup has play button`);
                assert(popup.querySelector('.popup-btn--expand') !== null, `Card "${id}" popup has expand button`);
                assert(popup.querySelector('.popup-meta') !== null, `Card "${id}" popup has .popup-meta`);
                assert(popup.querySelector('.popup-descriptors') !== null, `Card "${id}" popup has .popup-descriptors`);
            }
        });
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Modal Structure Tests (carried over)
// ──────────────────────────────────────────────────────────────────────────────
describe('Modal Structure', () => {
    it('detail modal exists with correct attributes', () => {
        const modal = document.getElementById('detailModal');
        assert(modal !== null, 'Detail modal (#detailModal) exists');
        assert(modal.classList.contains('modal-overlay'), 'Modal has .modal-overlay class');
        assert(modal.getAttribute('role') === 'dialog', 'Modal has role="dialog"');
        assert(modal.getAttribute('aria-modal') === 'true', 'Modal has aria-modal="true"');
    });

    it('modal has all required child elements', () => {
        const modal = document.getElementById('detailModal');
        assert(modal.querySelector('.modal-close') !== null, 'Modal has close button');
        assert(modal.querySelector('.modal-hero') !== null, 'Modal has hero section');
        assert(modal.querySelector('.modal-brand') !== null, 'Modal has BRETTFLIX brand');
        assert(modal.querySelector('#modalTitle') !== null, 'Modal has title element');
        assert(modal.querySelector('#modalHeroButtons') !== null, 'Modal has hero buttons');
        assert(modal.querySelector('.modal-body') !== null, 'Modal has body section');
        assert(modal.querySelector('.modal-main') !== null, 'Modal has main content area');
        assert(modal.querySelector('.modal-sidebar') !== null, 'Modal has sidebar');
        assert(modal.querySelector('#modalDescription') !== null, 'Modal has description element');
        assert(modal.querySelector('#modalTechStack') !== null, 'Modal has tech stack element');
        assert(modal.querySelector('#modalDescriptors') !== null, 'Modal has descriptors element');
        assert(modal.querySelector('.modal-media-section') !== null, 'Modal has media section');
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Project Data Tests (carried over)
// ──────────────────────────────────────────────────────────────────────────────
describe('Project Data', () => {
    it('embedded project-data JSON exists and is valid', () => {
        const dataEl = document.getElementById('project-data');
        assert(dataEl !== null, 'Embedded project-data JSON script exists');
        let projects = [];
        try {
            projects = JSON.parse(dataEl.textContent);
            assert(Array.isArray(projects), 'Project data parses as an array');
            assert(projects.length > 0, 'Project data has at least one project');
        } catch (e) {
            assert(false, 'Project data is valid JSON');
        }
    });

    it('each project has required fields', () => {
        const dataEl = document.getElementById('project-data');
        const projects = JSON.parse(dataEl.textContent);
        projects.forEach(p => {
            assert(p.id && typeof p.id === 'string', `Project "${p.id || '?'}" has an id`);
            assert(p.title && typeof p.title === 'string', `Project "${p.id}" has a title`);
            assert(Array.isArray(p.descriptors) && p.descriptors.length > 0, `Project "${p.id}" has descriptors array`);
            assert(Array.isArray(p.media), `Project "${p.id}" has media array`);
        });
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Modal Open/Close Tests (carried over, fixed)
// ──────────────────────────────────────────────────────────────────────────────
describe('Modal Open/Close', () => {
    it('modal opens on expand button click', () => {
        resetDOM();
        openModalViaButton();
        assert(isModalOpen(), 'Modal opens on expand button click');
        assert(document.body.classList.contains('modal-locked'), 'Body scroll locked when modal open');
        const titleText = document.getElementById('modalTitle').textContent;
        assert(titleText && titleText.length > 0, 'Modal title is populated');
    });

    it('modal closes on X button click', () => {
        resetDOM();
        openModalViaButton();
        closeModalViaButton();
        assert(!isModalOpen(), 'Modal closes on X button click');
        assert(!document.body.classList.contains('modal-locked'), 'Body scroll unlocked after modal close');
    });

    it('modal closes on Escape key', () => {
        resetDOM();
        openModalViaButton();
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        assert(!isModalOpen(), 'Modal closes on Escape key');
    });

    it('modal populates correct project data', () => {
        resetDOM();
        openModalViaButton('test-project-2');
        const title = document.getElementById('modalTitle').textContent;
        assert(title === 'Test Project Two', 'Modal shows correct project title');
        const desc = document.getElementById('modalDescription').textContent;
        assert(desc === 'Another test project.', 'Modal shows correct description');
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Branding Tests (carried over)
// ──────────────────────────────────────────────────────────────────────────────
describe('Branding', () => {
    it('nav logo says BRETTFLIX', () => {
        resetDOM();
        const navLogo = document.querySelector('.nav-logo');
        assert(navLogo && /brettflix/i.test(navLogo.textContent), 'Nav logo says BRETTFLIX');
    });

    it('popup cards have BRETTFLIX brand text', () => {
        const popupBrands = document.querySelectorAll('.popup-brand');
        assert(popupBrands.length > 0, 'Popup cards have BRETTFLIX brand text');
        popupBrands.forEach((b, i) => {
            assert(/BRETTFLIX/i.test(b.textContent), `Popup brand ${i} says BRETTFLIX`);
        });
    });

    it('modal brand says BRETTFLIX', () => {
        const modalBrand = document.querySelector('.modal-brand');
        assert(modalBrand && /BRETTFLIX/i.test(modalBrand.textContent), 'Modal brand says BRETTFLIX');
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Task 7.1 — Hover/Popup Behavior Tests
// ──────────────────────────────────────────────────────────────────────────────
describe('Hover Popup Behavior', () => {
    it('popup has aria-hidden="true" by default (hidden)', () => {
        resetDOM();
        const popups = document.querySelectorAll('.popup-card');
        assert(popups.length > 0, 'Popup cards exist');
        popups.forEach((p, i) => {
            assert(p.getAttribute('aria-hidden') === 'true', `Popup ${i} has aria-hidden="true" by default`);
            assert(!p.classList.contains('popup-visible'), `Popup ${i} does not have popup-visible class by default`);
        });
    });

    it('popup gets popup-visible class on card mouseenter after delay', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        const popup = card.querySelector('.popup-card');
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        // Before delay expires, popup should NOT be visible
        assert(!popup.classList.contains('popup-visible'), 'Popup not visible before delay');
        // Advance past POPUP_SHOW_DELAY (150ms)
        jest_clock_advance(200);
        assert(popup.classList.contains('popup-visible'), 'Popup gets popup-visible class after delay');
        restoreTimers();
    });

    it('popup loses popup-visible class on card mouseleave', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        const popup = card.querySelector('.popup-card');
        // Show popup
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        jest_clock_advance(200);
        assert(popup.classList.contains('popup-visible'), 'Popup is visible after mouseenter');
        // Hide popup
        card.dispatchEvent(new window.MouseEvent('mouseleave', { bubbles: true }));
        jest_clock_advance(300);
        assert(!popup.classList.contains('popup-visible'), 'Popup loses popup-visible class on mouseleave');
        restoreTimers();
    });

    it('card gets popup-active class when popup shows', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        jest_clock_advance(200);
        assert(card.classList.contains('popup-active'), 'Card has popup-active class when popup shows');
        restoreTimers();
    });

    it('carousel-wrapper gets popup-showing class', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        const wrapper = card.closest('.carousel-wrapper');
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        jest_clock_advance(200);
        assert(wrapper.classList.contains('popup-showing'), 'Carousel-wrapper has popup-showing class');
        restoreTimers();
    });

    it('popup aria-hidden toggles to false when shown', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        const popup = card.querySelector('.popup-card');
        assert(popup.getAttribute('aria-hidden') === 'true', 'Popup aria-hidden is true before show');
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        jest_clock_advance(200);
        assert(popup.getAttribute('aria-hidden') === 'false', 'Popup aria-hidden is false after show');
        restoreTimers();
    });

    it('popup aria-hidden reverts to true when hidden', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        const popup = card.querySelector('.popup-card');
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        jest_clock_advance(200);
        card.dispatchEvent(new window.MouseEvent('mouseleave', { bubbles: true }));
        jest_clock_advance(300);
        assert(popup.getAttribute('aria-hidden') === 'true', 'Popup aria-hidden reverts to true after hide');
        restoreTimers();
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Task 7.2 — Keyboard Navigation Tests
// ──────────────────────────────────────────────────────────────────────────────
describe('Keyboard Navigation', () => {
    it('Enter on title-card opens modal', () => {
        resetDOM();
        const card = document.querySelector('.title-card[data-project-id]');
        card.focus();
        card.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        assert(isModalOpen(), 'Enter on title-card opens modal');
        const modal = document.getElementById('detailModal');
        assert(modal.getAttribute('aria-hidden') === 'false', 'Modal aria-hidden is false when open');
    });

    it('Space on title-card opens modal', () => {
        resetDOM();
        const card = document.querySelector('.title-card[data-project-id]');
        card.focus();
        card.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        assert(isModalOpen(), 'Space on title-card opens modal');
    });

    it('Escape closes modal', () => {
        resetDOM();
        openModalViaButton();
        assert(isModalOpen(), 'Modal is open before Escape');
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        assert(!isModalOpen(), 'Escape closes modal');
        const modal = document.getElementById('detailModal');
        assert(modal.getAttribute('aria-hidden') === 'true', 'Modal aria-hidden is true after Escape');
    });

    it('Tab cycles within modal (focus trap)', () => {
        resetDOM();
        openModalViaButton();
        const modal = document.getElementById('detailModal');
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        assert(focusable.length >= 2, 'Modal has at least 2 focusable elements');
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        // Focus last element, press Tab — should wrap to first
        lastEl.focus();
        const tabEvent = new window.KeyboardEvent('keydown', {
            key: 'Tab', bubbles: true, cancelable: true
        });
        modal.dispatchEvent(tabEvent);
        assert(document.activeElement === firstEl, 'Tab from last element wraps to first element');
    });

    it('Shift+Tab from first element wraps to last', () => {
        resetDOM();
        openModalViaButton();
        const modal = document.getElementById('detailModal');
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        firstEl.focus();
        const shiftTabEvent = new window.KeyboardEvent('keydown', {
            key: 'Tab', shiftKey: true, bubbles: true, cancelable: true
        });
        modal.dispatchEvent(shiftTabEvent);
        assert(document.activeElement === lastEl, 'Shift+Tab from first element wraps to last element');
    });

    it('focus returns to trigger on modal close', () => {
        resetDOM();
        const card = document.querySelector('.title-card[data-project-id]');
        card.focus();
        // Open modal via keyboard (Enter) — this records the activeElement as trigger
        card.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        assert(isModalOpen(), 'Modal opened via keyboard');
        // Close modal
        closeModalViaButton();
        assert(!isModalOpen(), 'Modal closed');
        assert(document.activeElement === card, 'Focus returns to trigger element on modal close');
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Task 7.3 — Carousel Functionality Tests
// ──────────────────────────────────────────────────────────────────────────────
describe('Carousel', () => {
    it('right arrow click scrolls track', () => {
        resetDOM();
        const track = document.querySelector('.carousel-track');
        const rightArrow = document.querySelector('.carousel-arrow--right');
        // Simulate the track having scrollable content
        Object.defineProperty(track, 'clientWidth', { value: 800, configurable: true });
        Object.defineProperty(track, 'scrollWidth', { value: 2000, configurable: true });
        track.scrollLeft = 0;
        rightArrow.click();
        assert(track.scrollLeft > 0, 'Right arrow click scrolls track to the right');
    });

    it('left arrow is hidden at scroll start', () => {
        resetDOM();
        const track = document.querySelector('.carousel-track');
        const leftArrow = document.querySelector('.carousel-arrow--left');
        // Ensure scrollLeft is 0 and re-trigger arrow update
        Object.defineProperty(track, 'clientWidth', { value: 800, configurable: true });
        Object.defineProperty(track, 'scrollWidth', { value: 2000, configurable: true });
        track.scrollLeft = 0;
        // Re-fire scroll to trigger updateCarouselArrows
        track.dispatchEvent(new window.Event('scroll'));
        assert(leftArrow.style.display === 'none', 'Left arrow is hidden at scroll start');
    });

    it('left arrow becomes visible after scrolling right', () => {
        resetDOM();
        const track = document.querySelector('.carousel-track');
        const leftArrow = document.querySelector('.carousel-arrow--left');
        Object.defineProperty(track, 'clientWidth', { value: 800, configurable: true });
        Object.defineProperty(track, 'scrollWidth', { value: 2000, configurable: true });
        track.scrollLeft = 200;
        track.dispatchEvent(new window.Event('scroll'));
        assert(leftArrow.style.display !== 'none', 'Left arrow is visible after scrolling right');
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Task 7.4 — Modal Backdrop Tests (fixed)
// ──────────────────────────────────────────────────────────────────────────────
describe('Modal Backdrop', () => {
    it('clicking modal overlay closes modal', () => {
        resetDOM();
        openModalViaButton();
        assert(isModalOpen(), 'Modal is open before backdrop click');
        const modal = document.getElementById('detailModal');
        // Click directly on the overlay (e.target === modal)
        const clickEvt = new window.MouseEvent('click', { bubbles: true });
        Object.defineProperty(clickEvt, 'target', { value: modal, writable: false });
        modal.dispatchEvent(clickEvt);
        assert(!isModalOpen(), 'Clicking modal overlay closes modal');
    });

    it('clicking modal content does NOT close modal', () => {
        resetDOM();
        openModalViaButton();
        assert(isModalOpen(), 'Modal is open before content click');
        const container = document.querySelector('.modal-container');
        // Click on the container — e.target is container, not the overlay
        container.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
        assert(isModalOpen(), 'Clicking modal content does NOT close modal');
    });
});

// ──────────────────────────────────────────────────────────────────────────────
//  Task 7.5 — Accessibility Audit Tests
// ──────────────────────────────────────────────────────────────────────────────
describe('Accessibility', () => {
    it('no javascript: URIs in document', () => {
        resetDOM();
        const jsLinks = document.querySelectorAll('[href*="javascript:"]');
        assert(jsLinks.length === 0, 'No javascript: URIs in document');
    });

    it('modal has aria-labelledby referencing modalTitle', () => {
        const modal = document.getElementById('detailModal');
        const labelledBy = modal.getAttribute('aria-labelledby');
        assert(labelledBy === 'modalTitle', 'Modal has aria-labelledby="modalTitle"');
        const titleEl = document.getElementById(labelledBy);
        assert(titleEl !== null, 'Referenced modalTitle element exists');
    });

    it('all interactive elements have accessible names', () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach((btn, i) => {
            const hasLabel = btn.getAttribute('aria-label') ||
                             btn.textContent.trim().length > 0 ||
                             btn.getAttribute('title');
            assert(!!hasLabel, `Button ${i} has an accessible name`);
        });
    });

    it('skip link exists and targets main-content', () => {
        const skipLink = document.querySelector('.skip-link');
        assert(skipLink !== null, 'Skip link exists');
        assert(skipLink.getAttribute('href') === '#main-content', 'Skip link targets #main-content');
        const mainContent = document.getElementById('main-content');
        assert(mainContent !== null, '#main-content element exists');
    });

    it('title cards have role="button" and tabindex="0"', () => {
        const cards = document.querySelectorAll('.title-card[data-project-id]');
        assert(cards.length > 0, 'Title cards exist');
        cards.forEach((card, i) => {
            assert(card.getAttribute('role') === 'button', `Card ${i} has role="button"`);
            assert(card.getAttribute('tabindex') === '0', `Card ${i} has tabindex="0"`);
        });
    });

    it('title cards have aria-label', () => {
        const cards = document.querySelectorAll('.title-card[data-project-id]');
        cards.forEach((card, i) => {
            const label = card.getAttribute('aria-label');
            assert(label && label.length > 0, `Card ${i} has non-empty aria-label`);
        });
    });

    it('popup aria-hidden is "true" by default', () => {
        resetDOM();
        const popups = document.querySelectorAll('.popup-card');
        popups.forEach((p, i) => {
            assert(p.getAttribute('aria-hidden') === 'true', `Popup ${i} aria-hidden is "true" by default`);
        });
    });

    it('popup aria-hidden toggles correctly on show/hide', () => {
        resetDOM();
        installFakeTimers();
        const card = document.querySelector('.title-card[data-project-id]');
        const popup = card.querySelector('.popup-card');
        // Show
        card.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: true }));
        jest_clock_advance(200);
        assert(popup.getAttribute('aria-hidden') === 'false', 'Popup aria-hidden="false" after show');
        // Hide
        card.dispatchEvent(new window.MouseEvent('mouseleave', { bubbles: true }));
        jest_clock_advance(300);
        assert(popup.getAttribute('aria-hidden') === 'true', 'Popup aria-hidden="true" after hide');
        restoreTimers();
    });

    it('modal role is dialog with aria-modal', () => {
        const modal = document.getElementById('detailModal');
        assert(modal.getAttribute('role') === 'dialog', 'Modal role is dialog');
        assert(modal.getAttribute('aria-modal') === 'true', 'Modal has aria-modal="true"');
    });

    it('modal aria-hidden toggles on open/close', () => {
        resetDOM();
        const modal = document.getElementById('detailModal');
        assert(modal.getAttribute('aria-hidden') === 'true', 'Modal aria-hidden is "true" before open');
        openModalViaButton();
        assert(modal.getAttribute('aria-hidden') === 'false', 'Modal aria-hidden is "false" when open');
        closeModalViaButton();
        assert(modal.getAttribute('aria-hidden') === 'true', 'Modal aria-hidden is "true" after close');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//  Summary
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n========== BRETTFLIX TEST RESULTS ==========');
results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`  ${icon} ${r.status}: ${r.name}`);
});
console.log(`\n📊 Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
if (failed === 0) {
    console.log('🎉 All tests passed!');
} else {
    console.log(`⚠️  ${failed} test(s) failed.`);
}
console.log('=============================================\n');

process.exit(failed > 0 ? 1 : 0);
