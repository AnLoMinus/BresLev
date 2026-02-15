/**
 * Main Application - האפליקציה הראשית
 */

// State
let currentChapter = null;
let allChapters = [];

// DOM Elements
const chaptersListEl = document.getElementById('chaptersList');
const contentAreaEl = document.getElementById('contentArea');
const searchInputEl = document.getElementById('searchInput');
const searchResultsEl = document.getElementById('searchResults');

/**
 * אתחול האפליקציה
 */
async function init() {
    try {
        // טעינת רשימת הפרקים
        allChapters = await chaptersLoader.loadChaptersList();
        
        // הצגת רשימת הפרקים
        renderChaptersList();
        
        // טיפול בחיפוש
        setupSearch();
        
        // טיפול ב-URL hash (לניווט ישיר לפרק)
        handleHashNavigation();
        
    } catch (error) {
        console.error('שגיאה באתחול:', error);
        showError('שגיאה בטעינת האתר. אנא רענן את הדף.');
    }
}

/**
 * מציג את רשימת כל הפרקים
 */
function renderChaptersList() {
    if (!chaptersListEl) return;

    chaptersListEl.innerHTML = '';

    allChapters.forEach(chapter => {
        const link = document.createElement('a');
        link.href = `#chapter-${chapter.num}`;
        link.className = 'chapter-link';
        link.dataset.chapterNum = chapter.num;
        
        link.innerHTML = `
            <span class="chapter-number">${chapter.num}</span>
            <span class="chapter-name">${chapter.name}</span>
        `;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(chapter.num);
        });
        
        chaptersListEl.appendChild(link);
    });
}

/**
 * טוען ומציג פרק
 */
async function loadChapter(chapterNum) {
    try {
        // עדכון URL
        window.location.hash = `chapter-${chapterNum}`;
        
        // מצב טעינה
        contentAreaEl.innerHTML = '<div class="loading">טוען פרק...</div>';
        
        // טעינת הפרק
        const chapter = await chaptersLoader.loadChapter(chapterNum);
        currentChapter = chapter;
        
        // המרת Markdown ל-HTML
        const html = chaptersLoader.parseMarkdown(chapter.markdown);
        
        // הצגת התוכן
        renderChapter(chapter, html);
        
        // עדכון סימון פעיל
        updateActiveChapter(chapterNum);
        
        // גלילה למעלה
        contentAreaEl.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('שגיאה בטעינת פרק:', error);
        showError(`שגיאה בטעינת פרק ${chapterNum}. אנא נסה שוב.`);
    }
}

/**
 * מציג את תוכן הפרק
 */
function renderChapter(chapter, html) {
    contentAreaEl.innerHTML = `
        <div class="chapter-content">
            <div class="chapter-header">
                <h1 class="chapter-title">${chapter.name}</h1>
                <div class="chapter-meta">
                    <span>פרק ${chapter.num}</span>
                    <span class="chapter-verse" id="chapterVerse"></span>
                </div>
            </div>
            <div class="chapter-body">
                ${html}
            </div>
        </div>
    `;
    
    // חילוץ פסוק מהתוכן
    extractVerse(html);
    
    // תיקון קישורים פנימיים
    fixInternalLinks();
}

/**
 * מחלץ פסוק מהתוכן
 */
function extractVerse(html) {
    const verseEl = document.getElementById('chapterVerse');
    if (!verseEl) return;
    
    // מחפש פסוק בתוכן
    const verseMatch = html.match(/<p><em>"([^"]+)"<\/em><\/p>/);
    if (verseMatch) {
        verseEl.textContent = verseMatch[1];
    }
}

/**
 * מתקן קישורים פנימיים
 */
function fixInternalLinks() {
    const links = contentAreaEl.querySelectorAll('a[href^="./"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        const match = href.match(/(\d+)-(.+)\.md/);
        if (match) {
            const chapterNum = parseInt(match[1]);
            link.href = `#chapter-${chapterNum}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadChapter(chapterNum);
            });
        }
    });
}

/**
 * מעדכן את הסימון של הפרק הפעיל
 */
function updateActiveChapter(chapterNum) {
    const links = chaptersListEl.querySelectorAll('.chapter-link');
    links.forEach(link => {
        if (parseInt(link.dataset.chapterNum) === chapterNum) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * מגדיר את פונקציונליות החיפוש
 */
function setupSearch() {
    if (!searchInputEl) return;

    let searchTimeout;
    
    searchInputEl.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        searchTimeout = setTimeout(() => {
            if (query === '') {
                searchResultsEl.classList.remove('active');
                searchResultsEl.innerHTML = '';
                return;
            }
            
            performSearch(query);
        }, 300);
    });
    
    // סגירת תוצאות חיפוש בלחיצה מחוץ
    document.addEventListener('click', (e) => {
        if (!searchInputEl.contains(e.target) && !searchResultsEl.contains(e.target)) {
            searchResultsEl.classList.remove('active');
        }
    });
}

/**
 * מבצע חיפוש
 */
function performSearch(query) {
    const results = chaptersLoader.searchChapters(query);
    
    if (results.length === 0) {
        searchResultsEl.innerHTML = '<div class="search-result-item">לא נמצאו תוצאות</div>';
        searchResultsEl.classList.add('active');
        return;
    }
    
    searchResultsEl.innerHTML = results.map(chapter => {
        return `
            <div class="search-result-item" data-chapter-num="${chapter.num}">
                <strong>${chapter.num}. ${chapter.name}</strong>
            </div>
        `;
    }).join('');
    
    // הוספת event listeners לתוצאות
    searchResultsEl.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const chapterNum = parseInt(item.dataset.chapterNum);
            loadChapter(chapterNum);
            searchInputEl.value = '';
            searchResultsEl.classList.remove('active');
        });
    });
    
    searchResultsEl.classList.add('active');
}

/**
 * מטפל בניווט דרך URL hash
 */
function handleHashNavigation() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        const match = hash.match(/chapter-(\d+)/);
        if (match) {
            const chapterNum = parseInt(match[1]);
            loadChapter(chapterNum);
        }
    });
    
    // בדיקה ראשונית
    if (window.location.hash) {
        const match = window.location.hash.match(/chapter-(\d+)/);
        if (match) {
            const chapterNum = parseInt(match[1]);
            loadChapter(chapterNum);
        }
    }
}

/**
 * מציג הודעת שגיאה
 */
function showError(message) {
    contentAreaEl.innerHTML = `
        <div class="error-message">
            <h2>❌ שגיאה</h2>
            <p>${message}</p>
        </div>
    `;
}

// אתחול כשהדף נטען
document.addEventListener('DOMContentLoaded', init);

