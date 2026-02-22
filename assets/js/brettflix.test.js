/**
 * Brettflix Validation Tests
 * Run in browser console or via a test runner to validate popup + modal requirements.
 * Usage: Open brettreifs.github.io in a browser, paste this script in DevTools console.
 */
(function runBrettflixTests() {
    const results = [];
    let passed = 0;
    let failed = 0;

    function assert(condition, name) {
        if (condition) {
            passed++;
            results.push({ status: 'PASS', name });
        } else {
            failed++;
            results.push({ status: 'FAIL', name });
        }
    }

    // --- Structure Tests ---
    const titleCards = document.querySelectorAll('.title-card[data-project-id]');
    assert(titleCards.length > 0, 'Title cards exist on the page');

    titleCards.forEach(card => {
        const id = card.getAttribute('data-project-id');
        const popup = card.querySelector('.popup-card');
        assert(popup !== null, `Card "${id}" has a .popup-card child`);
        if (popup) {
            assert(popup.querySelector('.popup-thumbnail') !== null, `Card "${id}" popup has .popup-thumbnail`);
            assert(popup.querySelector('.popup-brand') !== null, `Card "${id}" popup has .popup-brand (BRETTFLIX)`);
            assert(popup.querySelector('.popup-title-overlay') !== null, `Card "${id}" popup has .popup-title-overlay`);
            assert(popup.querySelector('.popup-btn--play') !== null, `Card "${id}" popup has Explore play button`);
            assert(popup.querySelector('.popup-btn--expand') !== null, `Card "${id}" popup has More Info expand button`);
            assert(popup.querySelector('.popup-meta') !== null, `Card "${id}" popup has .popup-meta`);
            assert(popup.querySelector('.popup-descriptors') !== null, `Card "${id}" popup has .popup-descriptors`);
        }
    });

    // --- Modal Structure Tests ---
    const modal = document.getElementById('detailModal');
    assert(modal !== null, 'Detail modal (#detailModal) exists');
    if (modal) {
        assert(modal.classList.contains('modal-overlay'), 'Modal has .modal-overlay class');
        assert(modal.getAttribute('role') === 'dialog', 'Modal has role="dialog"');
        assert(modal.getAttribute('aria-modal') === 'true', 'Modal has aria-modal="true"');
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
    }

    // --- Project Data Tests ---
    const dataEl = document.getElementById('project-data');
    assert(dataEl !== null, 'Embedded project-data JSON script exists');
    let projects = [];
    if (dataEl) {
        try {
            projects = JSON.parse(dataEl.textContent);
            assert(Array.isArray(projects), 'Project data parses as an array');
            assert(projects.length > 0, 'Project data has at least one project');
        } catch (e) {
            assert(false, 'Project data is valid JSON');
        }
    }

    projects.forEach(p => {
        assert(p.id && typeof p.id === 'string', `Project "${p.id || '?'}" has an id`);
        assert(p.title && typeof p.title === 'string', `Project "${p.id}" has a title`);
        assert(Array.isArray(p.descriptors) && p.descriptors.length > 0, `Project "${p.id}" has descriptors array`);
        assert(Array.isArray(p.media), `Project "${p.id}" has media array`);
    });

    // --- Modal Open/Close Tests ---
    if (modal && projects.length > 0) {
        // Find an expand button to simulate click
        const expandBtn = document.querySelector('[data-modal-id]');
        if (expandBtn) {
            expandBtn.click();
            const isOpen = modal.classList.contains('modal-open');
            assert(isOpen, 'Modal opens on expand button click');
            assert(document.body.classList.contains('modal-locked'), 'Body scroll locked when modal open');
            const titleText = document.getElementById('modalTitle')?.textContent;
            assert(titleText && titleText.length > 0, 'Modal title is populated');

            // Close via close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.click();
                assert(!modal.classList.contains('modal-open'), 'Modal closes on X button click');
                assert(!document.body.classList.contains('modal-locked'), 'Body scroll unlocked after modal close');
            }

            // Reopen and close via Escape
            expandBtn.click();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            assert(!modal.classList.contains('modal-open'), 'Modal closes on Escape key');

            // Reopen and close via backdrop
            expandBtn.click();
            modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            assert(!modal.classList.contains('modal-open'), 'Modal closes on backdrop click');
        }
    }

    // --- Branding Tests ---
    const navLogo = document.querySelector('.nav-logo');
    assert(navLogo && /brettflix/i.test(navLogo.textContent), 'Nav logo says BRETTFLIX');

    const popupBrands = document.querySelectorAll('.popup-brand');
    assert(popupBrands.length > 0, 'Popup cards have BRETTFLIX brand text');
    popupBrands.forEach((b, i) => {
        assert(/BRETTFLIX/i.test(b.textContent), `Popup brand ${i} says BRETTFLIX`);
    });

    const modalBrand = document.querySelector('.modal-brand');
    assert(modalBrand && /BRETTFLIX/i.test(modalBrand.textContent), 'Modal brand says BRETTFLIX');

    // --- Print Results ---
    console.log('\n========== BRETTFLIX TEST RESULTS ==========');
    results.forEach(r => {
        const icon = r.status === 'PASS' ? '✅' : '❌';
        console.log(`${icon} ${r.status}: ${r.name}`);
    });
    console.log(`\n📊 Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
    console.log('=============================================\n');

    return { passed, failed, total: passed + failed, results };
})();
