// assets/js/netflix.js
// Netflix-style interactivity: navbar scroll, carousel arrows

const TECH_LINKS = {
    'MCP': 'https://modelcontextprotocol.io',
    'Excalidraw': 'https://excalidraw.com',
    'TypeScript': 'https://www.typescriptlang.org',
    'Spotify': 'https://developer.spotify.com/documentation/web-api',
    'Suno AI': 'https://suno.com',
    'VS Code': 'https://code.visualstudio.com',
    'Remotion': 'https://www.remotion.dev',
    'CrewAI': 'https://www.crewai.com',
    'WebSocket': 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
    'React': 'https://react.dev',
    'FastAPI': 'https://fastapi.tiangolo.com',
    'ChromaDB': 'https://www.trychroma.com',
    'Next.js': 'https://nextjs.org',
    'Python': 'https://www.python.org',
    'FTS5': 'https://www.sqlite.org/fts5.html',
    'Recharts': 'https://recharts.org'
};

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile nav toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // --- Navbar scroll opacity ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        }, { passive: true });
    }

    // --- Carousel arrow navigation ---
    function updateCarouselArrows(wrapper) {
        const track = wrapper.querySelector('.carousel-track');
        const leftArrow = wrapper.querySelector('.carousel-arrow--left');
        const rightArrow = wrapper.querySelector('.carousel-arrow--right');
        if (!track || !leftArrow || !rightArrow) return;

        leftArrow.style.display = track.scrollLeft <= 0 ? 'none' : '';
        rightArrow.style.display =
            track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 ? 'none' : '';
    }

    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const leftBtn = wrapper.querySelector('.carousel-arrow--left');
        const rightBtn = wrapper.querySelector('.carousel-arrow--right');

        if (!track) return;

        const scrollAmount = () => track.clientWidth * 0.75;

        if (leftBtn) {
            leftBtn.addEventListener('click', () => {
                track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('click', () => {
                track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            });
        }

        track.addEventListener('scroll', () => {
            requestAnimationFrame(() => updateCarouselArrows(wrapper));
        }, { passive: true });

        updateCarouselArrows(wrapper);
    });

    // --- Hero fade-in animation ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }

    // --- Hover Popup Cards ---
    const POPUP_SHOW_DELAY = 150;  // ms before popup appears
    const POPUP_HIDE_DELAY = 200;  // ms before popup hides
    let activePopup = null;
    let showTimer = null;
    let hideTimer = null;

    function clearPopupTimers() {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        showTimer = null;
        hideTimer = null;
    }

    function hideActivePopup() {
        if (activePopup) {
            const card = activePopup.closest('.title-card');
            activePopup.classList.remove('popup-visible');
            activePopup.setAttribute('aria-hidden', 'true');
            if (card) {
                card.classList.remove('popup-active');
                const wrapper = card.closest('.carousel-wrapper');
                if (wrapper) wrapper.classList.remove('popup-showing');
            }
            activePopup = null;
            // Remove sibling displacement classes
            document.querySelectorAll('.sibling-shift-left').forEach(el => {
                el.classList.remove('sibling-shift-left');
            });
        }
    }

    function showPopup(card) {
        const popup = card.querySelector('.popup-card');
        if (!popup) return;
        hideActivePopup();
        card.classList.add('popup-active');
        const wrapper = card.closest('.carousel-wrapper');
        if (wrapper) wrapper.classList.add('popup-showing');
        popup.classList.add('popup-visible');
        popup.setAttribute('aria-hidden', 'false');
        activePopup = popup;

        // Edge detection for popup alignment
        const cardRect = card.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        popup.classList.remove('popup-card--align-left', 'popup-card--align-right');
        if (cardRect.left < 100) {
            popup.classList.add('popup-card--align-left');
        } else if (cardRect.right > viewportWidth - 100) {
            popup.classList.add('popup-card--align-right');
        }

        // Shift preceding siblings left
        let prevSibling = card.previousElementSibling;
        while (prevSibling && prevSibling.classList.contains('title-card')) {
            prevSibling.classList.add('sibling-shift-left');
            prevSibling = prevSibling.previousElementSibling;
        }
    }

    const hasHover = window.matchMedia('(hover: hover)').matches;

    document.querySelectorAll('.title-card[data-project-id]').forEach(card => {
        if (!hasHover) {
            // Touch devices: tap goes directly to modal
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                if (projectId) openModal(projectId);
            });
        } else {
            card.addEventListener('mouseenter', () => {
                clearPopupTimers();
                showTimer = setTimeout(() => showPopup(card), POPUP_SHOW_DELAY);
            });

            card.addEventListener('mouseleave', () => {
                clearPopupTimers();
                hideTimer = setTimeout(() => hideActivePopup(), POPUP_HIDE_DELAY);
            });

            // Keep popup alive when hovering into it
            const popup = card.querySelector('.popup-card');
            if (popup) {
                popup.addEventListener('mouseenter', () => {
                    clearPopupTimers();
                });
                popup.addEventListener('mouseleave', () => {
                    clearPopupTimers();
                    hideTimer = setTimeout(() => hideActivePopup(), POPUP_HIDE_DELAY);
                });
            }
        }

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = card.dataset.projectId;
                if (projectId) openModal(projectId);
            }
        });
    });

    // --- Detail Modal ---
    const modal = document.getElementById('detailModal');
    const projectDataEl = document.getElementById('project-data');
    let projectsData = [];
    let modalTriggerElement = null;

    if (projectDataEl) {
        try {
            projectsData = JSON.parse(projectDataEl.textContent);
        } catch (e) {
            console.warn('Failed to parse project data:', e);
        }
    }

    function findProject(id) {
        return projectsData.find(p => p.id === id);
    }

    function getGradientIndex(id) {
        const idx = projectsData.findIndex(p => p.id === id);
        return (idx >= 0 ? idx : 0) % 8 + 1;
    }

    function openModal(projectId) {
        const project = findProject(projectId);
        if (!project || !modal) return;

        const gIdx = getGradientIndex(projectId);

        // Hero
        const heroGrad = document.getElementById('modalHeroGradient');
        const heroIcon = document.getElementById('modalHeroIcon');

        // Hero image (layered behind gradient+text)
        const heroEl = document.getElementById('modalHero');
        if (heroEl) {
            const existingImg = heroEl.querySelector('.modal-hero-img');
            if (existingImg) existingImg.remove();
            if (project.heroImage) {
                const img = document.createElement('img');
                img.className = 'modal-hero-img';
                img.src = project.heroImage;
                img.alt = `${project.title} hero background`;
                img.loading = 'eager';
                heroEl.insertBefore(img, heroEl.firstChild);
                // Clear solid gradient so image shows through; ::after still provides text-readability overlay
                if (heroGrad) heroGrad.style.background = 'transparent';
                if (heroIcon) heroIcon.style.display = 'none';
            } else {
                // Fallback: solid gradient + icon
                if (heroGrad) heroGrad.style.background = `var(--gradient-${gIdx})`;
                if (heroIcon) { heroIcon.className = `${project.heroIcon} modal-hero-icon`; heroIcon.style.display = ''; }
            }
        }

        // Title
        const titleEl = document.getElementById('modalTitle');
        if (titleEl) titleEl.textContent = project.title;

        // Hero buttons
        const btnsEl = document.getElementById('modalHeroButtons');
        if (btnsEl) {
            let html = `<a href="/project.html?id=${project.id}" class="modal-hero-btn modal-hero-btn--primary"><i class="fas fa-play"></i> Explore</a>`;
            if (project.githubUrl) {
                html += `<a href="${project.githubUrl}" class="modal-hero-btn modal-hero-btn--secondary" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>`;
            }
            btnsEl.innerHTML = html;
        }

        // Meta row
        const metaRow = document.getElementById('modalMetaRow');
        if (metaRow) {
            const statusClass = project.status === 'released' ? 'shipped' : 'building';
            const statusLabel = project.status === 'released' ? 'Shipped' : 'Building';
            let html = `<span class="modal-meta-badge modal-meta-badge--${statusClass}">${statusLabel}</span>`;
            html += `<span class="modal-meta-text">${project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : ''}</span>`;
            if (project.tags && project.tags.length) {
                html += project.tags.slice(0, 5).map(t => `<span class="modal-meta-text">${t}</span>`).join('');
            }
            metaRow.innerHTML = html;
        }

        // Description
        const descEl = document.getElementById('modalDescription');
        if (descEl) descEl.textContent = project.description || '';

        const fullDescEl = document.getElementById('modalFullDescription');
        if (fullDescEl) fullDescEl.innerHTML = project.fullDescription || '';

        // Sidebar
        const techEl = document.getElementById('modalTechStack');
        if (techEl) techEl.textContent = project.tags ? project.tags.join(', ') : '';

        const catEl = document.getElementById('modalCategory');
        if (catEl) catEl.textContent = project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : '';

        const descTagsEl = document.getElementById('modalDescriptors');
        if (descTagsEl) descTagsEl.textContent = project.descriptors ? project.descriptors.join(', ') : '';

        // Links
        const linksEl = document.getElementById('modalLinks');
        if (linksEl) {
            let html = `<a href="/project.html?id=${project.id}" class="modal-sidebar-link"><i class="fas fa-external-link-alt"></i> Project Page</a>`;
            if (project.githubUrl) {
                html += `<a href="${project.githubUrl}" class="modal-sidebar-link" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub Repo</a>`;
            }
            if (project.videoUrl) {
                html += `<a href="${project.videoUrl}" class="modal-sidebar-link" target="_blank" rel="noopener"><i class="fas fa-video"></i> Video</a>`;
            }
            linksEl.innerHTML = html;
        }

        // Built With / Provenance
        const existingBuiltWith = document.querySelector('.modal-sidebar-section.modal-built-with');
        if (existingBuiltWith) existingBuiltWith.remove();

        if (project.tags && project.tags.length > 0) {
            const builtWithHTML = project.tags
                .map(tag => {
                    const url = TECH_LINKS[tag];
                    if (url) {
                        return `<a href="${url}" class="modal-sidebar-tech-link" target="_blank" rel="noopener noreferrer">${tag}</a>`;
                    }
                    return `<span class="modal-sidebar-tech-tag">${tag}</span>`;
                })
                .join('');

            const builtWithSection = document.createElement('div');
            builtWithSection.className = 'modal-sidebar-section modal-built-with';
            builtWithSection.innerHTML = `
                <span class="modal-sidebar-label">Built With:</span>
                <div class="modal-sidebar-tech-links">${builtWithHTML}</div>
            `;

            const sidebar = document.querySelector('.modal-sidebar');
            const linksSection = document.getElementById('modalLinksSection');
            if (sidebar && linksSection) {
                sidebar.insertBefore(builtWithSection, linksSection);
            } else if (sidebar) {
                sidebar.appendChild(builtWithSection);
            }
        }

        // Media section
        const mediaGrid = document.getElementById('modalMediaGrid');
        if (mediaGrid) {
            if (project.media && project.media.length > 0) {
                mediaGrid.innerHTML = project.media.map(m => {
                    const icon = m.type === 'trailer' ? 'fa-film' : m.type === 'tutorial' ? 'fa-graduation-cap' : 'fa-play-circle';
                    return `<div class="modal-media-card">
                        <div class="modal-media-thumb"><i class="fas ${icon}"></i></div>
                        <div class="modal-media-title">${m.title || m.type}</div>
                    </div>`;
                }).join('');
            } else {
                mediaGrid.innerHTML = `<div class="modal-media-placeholder"><i class="fas fa-film" aria-hidden="true"></i><p>Trailers &amp; videos coming soon</p></div>`;
            }
        }

        // More Like This section
        const moreLikeThisContainer = document.getElementById('modalMoreLikeThis');
        if (moreLikeThisContainer && typeof projectsData !== 'undefined') {
            const currentProject = projectsData.find(p => p.id === projectId);
            if (currentProject) {
                const related = projectsData.filter(p => 
                    p.id !== projectId && 
                    p.published && 
                    (p.category === currentProject.category || 
                     (p.tags && currentProject.tags && p.tags.some(t => currentProject.tags.includes(t))))
                ).slice(0, 4);
                
                if (related.length > 0) {
                    moreLikeThisContainer.innerHTML = '<h3 class="modal-section-heading">More Like This</h3>' +
                        '<div class="modal-related-grid">' +
                        related.map(r => `
                            <div class="modal-related-card" data-modal-id="${r.id}" tabindex="0" role="button">
                                <div class="modal-related-thumb ${r.heroIcon ? '' : 'card-grad-1'}">
                                    ${r.image ? `<img src="${r.image}" alt="${r.title}" loading="lazy">` : `<i class="${r.heroIcon || 'fas fa-code'}" aria-hidden="true"></i>`}
                                </div>
                                <div class="modal-related-info">
                                    <div class="modal-related-title">${r.title}</div>
                                    <div class="modal-related-desc">${(r.description || '').substring(0, 80)}...</div>
                                </div>
                            </div>
                        `).join('') +
                        '</div>';
                    
                    // Add click handlers for related cards
                    moreLikeThisContainer.querySelectorAll('.modal-related-card').forEach(card => {
                        card.addEventListener('click', () => openModal(card.dataset.modalId));
                        card.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openModal(card.dataset.modalId);
                            }
                        });
                    });
                } else {
                    moreLikeThisContainer.innerHTML = '';
                }
            }
        }

        // Show modal
        modalTriggerElement = document.activeElement;
        hideActivePopup();
        const scrollY = window.scrollY;
        document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
        document.body.classList.add('modal-locked');
        modal.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-locked');
        const savedY = parseInt(document.documentElement.style.getPropertyValue('--scroll-y') || '0');
        window.scrollTo(0, savedY);
        if (modalTriggerElement) {
            modalTriggerElement.focus();
            modalTriggerElement = null;
        }
    }

    // Modal triggers — expand buttons + hero "Explore Project"
    document.addEventListener('click', (e) => {
        const expandBtn = e.target.closest('[data-modal-id]');
        if (expandBtn) {
            e.preventDefault();
            e.stopPropagation();
            openModal(expandBtn.getAttribute('data-modal-id'));
            return;
        }

        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) {
            closeModal();
            return;
        }
    });

    // Focus trap (Tab cycling)
    if (modal) {
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstEl = focusableElements[0];
            const lastEl = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('modal-open')) {
            closeModal();
        }
    });

});
