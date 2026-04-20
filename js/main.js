document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const backToTop = document.getElementById('backToTop');
    const copyToast = document.getElementById('copyToast');

    if (mobileToggle && mobileMenu && mobileClose && mobileOverlay) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileClose.addEventListener('click', closeMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function showToast(message) {
        if (copyToast) {
            copyToast.textContent = message;
            copyToast.classList.add('show');
            setTimeout(function() {
                copyToast.classList.remove('show');
            }, 2000);
        }
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showToast('复制成功！');
            }).catch(function() {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('复制成功！');
        } catch (err) {
            showToast('复制失败，请手动复制');
        }
        document.body.removeChild(textarea);
    }

    document.querySelectorAll('.btn-copy').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            if (prompt) {
                copyToClipboard(prompt);
            }
        });
    });

    const copyPromptBtn = document.getElementById('copyPrompt');
    const promptContent = document.getElementById('promptContent');
    if (copyPromptBtn && promptContent) {
        copyPromptBtn.addEventListener('click', function() {
            copyToClipboard(promptContent.textContent.trim());
        });
    }

    const searchBtn = document.getElementById('searchBtn');
    const bannerSearch = document.getElementById('bannerSearch');
    const categorySelect = document.getElementById('categorySelect');

    if (searchBtn && bannerSearch) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });

        bannerSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const keyword = bannerSearch ? bannerSearch.value.trim() : '';
        const category = categorySelect ? categorySelect.value : '';
        
        if (keyword || category) {
            window.location.href = 'prompts.html?keyword=' + encodeURIComponent(keyword) + '&category=' + encodeURIComponent(category);
        }
    }

    const mainSearchBtn = document.getElementById('mainSearchBtn');
    const mainSearch = document.getElementById('mainSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (mainSearchBtn && mainSearch) {
        mainSearchBtn.addEventListener('click', function() {
            filterPrompts();
        });

        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterPrompts();
            }
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterPrompts);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', filterPrompts);
    }

    function filterPrompts() {
        const keyword = mainSearch ? mainSearch.value.trim() : '';
        const category = categoryFilter ? categoryFilter.value : '';
        const sort = sortFilter ? sortFilter.value : '';
        
        console.log('Filtering:', { keyword, category, sort });
    }

    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            filterTabs.forEach(function(t) {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            console.log('Filter by:', filter);
        });
    });

    const dropdownItems = document.querySelectorAll('.main-nav > li');
    dropdownItems.forEach(function(item) {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (dropdown) {
            item.addEventListener('mouseenter', function() {
                dropdown.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', function() {
                dropdown.style.display = 'none';
            });
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            console.log('Form submitted:', data);
            showToast('留言提交成功！我们会尽快回复您。');
            contactForm.reset();
        });
    }

    const tocLinks = document.querySelectorAll('.toc-list a');
    const contentBlocks = document.querySelectorAll('.content-block, .article-block');
    
    if (tocLinks.length > 0 && contentBlocks.length > 0) {
        tocLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetText = this.textContent.trim();
                
                contentBlocks.forEach(function(block) {
                    const heading = block.querySelector('h2');
                    if (heading && heading.textContent.trim() === targetText) {
                        block.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                
                tocLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }

    const paginationLinks = document.querySelectorAll('.pagination a:not(.disabled)');
    paginationLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Page:', this.textContent);
        });
    });

    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            keyword: params.get('keyword') || '',
            category: params.get('category') || ''
        };
    }

    const urlParams = getUrlParams();
    if (urlParams.keyword && mainSearch) {
        mainSearch.value = urlParams.keyword;
    }
    if (urlParams.category && categoryFilter) {
        categoryFilter.value = urlParams.category;
    }

    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
});
