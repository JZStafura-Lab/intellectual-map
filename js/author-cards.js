// Author Cards Module - Wikipedia Integration & Modal System
(function() {
    'use strict';

    let authorsData = {};
    let problemCategories = {};
    let currentAuthor = null;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        try {
            // Load data files
            await Promise.all([
                loadAuthorsData(),
                loadProblemCategories()
            ]);

            // Setup event listeners
            setupModalListeners();

            console.log('Author cards initialized successfully');
        } catch (error) {
            console.error('Failed to initialize author cards:', error);
        }
    }

    async function loadAuthorsData() {
        const response = await fetch('./data/authors.json');
        if (!response.ok) throw new Error('Failed to load authors data');
        authorsData = await response.json();
        console.log('Loaded authors:', Object.keys(authorsData));
    }

    async function loadProblemCategories() {
        const response = await fetch('./data/processed/problem_categories.json');
        if (!response.ok) throw new Error('Failed to load problem categories');
        const data = await response.json();
        // Extract the key_bridge_authors section which has the structure we need
        problemCategories = data.key_bridge_authors;
        console.log('Loaded problem categories for:', Object.keys(problemCategories));
    }

    function setupModalListeners() {
        // Author link clicks
        document.querySelectorAll('.bridge-author-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const authorKey = e.target.dataset.author;
                openAuthorModal(authorKey);
            });
        });

        // Close button
        const closeBtn = document.querySelector('.author-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeAuthorModal);
        }

        // Backdrop click
        const overlay = document.querySelector('.author-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeAuthorModal();
                }
            });
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && currentAuthor) {
                closeAuthorModal();
            }
        });
    }

    function openAuthorModal(authorKey) {
        const author = authorsData[authorKey];
        if (!author) {
            console.error('Author not found:', authorKey);
            return;
        }

        console.log('Opening modal for:', authorKey, author);
        currentAuthor = authorKey;

        // Find author's category data
        const categoryData = findAuthorCategory(authorKey);
        console.log('Category data:', categoryData);

        // Populate modal
        populateModalHeader(author);
        populateModalBody(author, authorKey, categoryData);

        // Show modal
        const overlay = document.querySelector('.author-modal-overlay');
        overlay.classList.add('active');
        document.body.classList.add('modal-open');

        // Load Wikipedia biography
        loadWikipediaBio(author);
    }

    function closeAuthorModal() {
        const overlay = document.querySelector('.author-modal-overlay');
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        currentAuthor = null;
    }

    function findAuthorCategory(authorKey) {
        // problemCategories is now key_bridge_authors from the JSON
        const authorData = problemCategories[authorKey];
        if (!authorData) return null;

        return {
            primary: authorData.primary_problem,
            bridges: authorData.bridges || [],
            works: authorData.works || []
        };
    }

    function populateModalHeader(author) {
        const header = document.querySelector('.author-modal-header h2');
        const link = document.querySelector('.author-wikipedia-link');

        if (header) {
            header.textContent = author.full_name;
        }

        if (link) {
            link.href = author.wikipedia_url;
        }
    }

    function populateModalBody(author, authorKey, categoryData) {
        // Works
        populateWorks(categoryData);

        // Domains
        populateDomains(categoryData);

        // Related Authors
        populateRelatedAuthors(authorKey, categoryData);
    }

    function populateWorks(categoryData) {
        const worksList = document.querySelector('.author-works');
        if (!worksList || !categoryData || !categoryData.works) return;

        worksList.innerHTML = categoryData.works
            .map(work => `<li>${work}</li>`)
            .join('');
    }

    function populateDomains(categoryData) {
        const domainsContainer = document.querySelector('.author-domains');
        if (!domainsContainer || !categoryData) return;

        const domains = [];

        // Primary domain (already in readable form)
        domains.push({
            name: categoryData.primary,
            type: 'primary'
        });

        // Bridge domains (already in readable form)
        categoryData.bridges.forEach(bridgeName => {
            domains.push({
                name: bridgeName,
                type: 'bridge'
            });
        });

        domainsContainer.innerHTML = domains
            .map(domain => `<span class="domain-badge ${domain.type}">${domain.name}</span>`)
            .join('');
    }

    function populateRelatedAuthors(currentAuthorKey, categoryData) {
        const container = document.querySelector('.related-authors-list');
        if (!container || !categoryData) return;

        const relatedAuthors = calculateRelatedAuthors(currentAuthorKey, categoryData);

        if (relatedAuthors.length === 0) {
            container.innerHTML = '<p class="related-authors-empty">No related authors found</p>';
            return;
        }

        container.innerHTML = relatedAuthors
            .slice(0, 3)
            .map(related => `
                <div class="related-author-card" data-author="${related.key}">
                    <h4>${authorsData[related.key]?.full_name || related.key}</h4>
                    <p>${related.connection}</p>
                </div>
            `)
            .join('');

        // Add click handlers for related author cards
        container.querySelectorAll('.related-author-card').forEach(card => {
            card.addEventListener('click', () => {
                const authorKey = card.dataset.author;
                openAuthorModal(authorKey);
            });
        });
    }

    function calculateRelatedAuthors(currentAuthorKey, currentCategoryData) {
        if (!currentCategoryData) return [];

        const scores = [];

        // Check all other bridge authors
        for (const [authorKey, authorData] of Object.entries(problemCategories)) {
            if (authorKey === currentAuthorKey) continue;

            let score = 0;
            let connections = [];

            const otherPrimary = authorData.primary_problem;
            const otherBridges = authorData.bridges || [];

            // Same primary domain: +3
            if (otherPrimary === currentCategoryData.primary) {
                score += 3;
                connections.push(`Both work in ${otherPrimary}`);
            }

            // Shared bridge domains: +2 each
            const sharedBridges = currentCategoryData.bridges.filter(b => otherBridges.includes(b));
            score += sharedBridges.length * 2;
            if (sharedBridges.length > 0) {
                connections.push(`Bridge to ${sharedBridges.join(', ')}`);
            }

            // Current author's primary in other's bridges: +2
            if (otherBridges.includes(currentCategoryData.primary)) {
                score += 2;
                connections.push(`Bridges to ${currentCategoryData.primary}`);
            }

            // Other author's primary in current's bridges: +2
            if (currentCategoryData.bridges.includes(otherPrimary)) {
                score += 2;
                if (!connections.some(c => c.includes(otherPrimary))) {
                    connections.push(`Connected via ${otherPrimary}`);
                }
            }

            if (score > 0) {
                scores.push({
                    key: authorKey,
                    score,
                    connection: connections.join(' • ')
                });
            }
        }

        // Sort by score descending
        return scores.sort((a, b) => b.score - a.score);
    }

    async function loadWikipediaBio(author) {
        const bioContainer = document.querySelector('.author-biography');
        if (!bioContainer) return;

        // Check cache
        const cacheKey = `wikipedia_bio_${author.wikipedia_page_id}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            displayBiography(cached);
            return;
        }

        // Show loading state
        const bioContent = bioContainer.querySelector('p') || document.createElement('p');
        bioContent.className = 'author-biography-loading';
        bioContent.textContent = 'Loading biography...';
        if (!bioContainer.querySelector('p')) {
            bioContainer.appendChild(bioContent);
        }

        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(author.wikipedia_page_id)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Wikipedia API request failed');
            }

            const data = await response.json();
            const extract = data.extract || '';

            // Limit to ~600 characters (3-4 paragraphs worth)
            const truncated = extract.length > 600
                ? extract.substring(0, 600).split('.').slice(0, -1).join('.') + '.'
                : extract;

            // Cache the result
            sessionStorage.setItem(cacheKey, truncated);

            // Display
            displayBiography(truncated);

        } catch (error) {
            console.error('Failed to load Wikipedia biography:', error);
            displayBiographyError(author);
        }
    }

    function displayBiography(text) {
        const bioContainer = document.querySelector('.author-biography');
        if (!bioContainer) return;

        const bioContent = bioContainer.querySelector('p') || document.createElement('p');
        bioContent.className = '';
        bioContent.textContent = text;
        if (!bioContainer.querySelector('p')) {
            bioContainer.appendChild(bioContent);
        }
    }

    function displayBiographyError(author) {
        const bioContainer = document.querySelector('.author-biography');
        if (!bioContainer) return;

        const bioContent = bioContainer.querySelector('p') || document.createElement('p');
        bioContent.className = 'author-biography-error';
        bioContent.innerHTML = `Unable to load biography. <a href="${author.wikipedia_url}" target="_blank" rel="noopener noreferrer">Visit Wikipedia</a>`;
        if (!bioContainer.querySelector('p')) {
            bioContainer.appendChild(bioContent);
        }
    }

})();
