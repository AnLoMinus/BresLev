/**
 * Chapters Loader - טוען את כל הפרקים מהתיקייה
 */

class ChaptersLoader {
    constructor() {
        this.chapters = [];
        // נתיב יחסי מתיקיית website
        this.chaptersDir = './SparMidot/chapters/';
    }

    /**
     * טוען את רשימת כל הפרקים
     */
    async loadChaptersList() {
        try {
            // רשימת כל הפרקים (93 פרקים)
            const chaptersList = [
                { num: 1, name: 'אבידה' },
                { num: 2, name: 'אהבה' },
                { num: 3, name: 'אכילה' },
                { num: 4, name: 'אלמן' },
                { num: 5, name: 'אמונה' },
                { num: 6, name: 'אמת' },
                { num: 7, name: 'ארץ ישראל' },
                { num: 8, name: 'בגדים' },
                { num: 9, name: 'בושה' },
                { num: 10, name: 'בטחון' },
                { num: 11, name: 'בית' },
                { num: 12, name: 'בכייה' },
                { num: 13, name: 'בנים' },
                { num: 14, name: 'ברכה' },
                { num: 15, name: 'בשורה' },
                { num: 16, name: 'גאוה' },
                { num: 17, name: 'גניבה וגזילה' },
                { num: 18, name: 'דיין' },
                { num: 19, name: 'דעת' },
                { num: 20, name: 'דרך' },
                { num: 21, name: 'הוראה' },
                { num: 22, name: 'הכנסת אורחים' },
                { num: 23, name: 'המתקת דין' },
                { num: 24, name: 'הצלחה' },
                { num: 25, name: 'הרהורים' },
                { num: 26, name: 'הרחקת רשעים' },
                { num: 27, name: 'הריון' },
                { num: 28, name: 'התבודדות' },
                { num: 29, name: 'התנשאות' },
                { num: 30, name: 'ודוי דברים' },
                { num: 31, name: 'ותרן' },
                { num: 32, name: 'זיפן' },
                { num: 33, name: 'זכות אבות' },
                { num: 34, name: 'זכירה' },
                { num: 35, name: 'זקנים' },
                { num: 36, name: 'זריזות' },
                { num: 37, name: 'חדושין דאוריתא' },
                { num: 38, name: 'חיתון' },
                { num: 39, name: 'חלום' },
                { num: 40, name: 'חן' },
                { num: 41, name: 'חנפה' },
                { num: 42, name: 'חקירה' },
                { num: 43, name: 'טבע' },
                { num: 44, name: 'טהרה' },
                { num: 45, name: 'טלטול' },
                { num: 46, name: 'יחוס' },
                { num: 47, name: 'יראה' },
                { num: 48, name: 'ישועה' },
                { num: 49, name: 'כבוד' },
                { num: 50, name: 'כישוף' },
                { num: 51, name: 'ניאוף' },
                { num: 52, name: 'ניבול פה' },
                { num: 53, name: 'ניסיון' },
                { num: 54, name: 'נפילה' },
                { num: 55, name: 'נר תמיד' },
                { num: 56, name: 'סגולה' },
                { num: 57, name: 'סוד' },
                { num: 58, name: 'ספירת העומר' },
                { num: 59, name: 'ספר' },
                { num: 60, name: 'עבירה' },
                { num: 61, name: 'עונש' },
                { num: 62, name: 'עזות' },
                { num: 63, name: 'ענוה' },
                { num: 64, name: 'עצבות' },
                { num: 65, name: 'עצה' },
                { num: 66, name: 'עצירות' },
                { num: 67, name: 'עצלות' },
                { num: 68, name: 'פוסק' },
                { num: 69, name: 'פחד' },
                { num: 70, name: 'פידיון שבויים' },
                { num: 71, name: 'פרישות' },
                { num: 72, name: 'צדיק' },
                { num: 73, name: 'צדקה' },
                { num: 74, name: 'קליפה' },
                { num: 75, name: 'קללה' },
                { num: 76, name: 'קנאה' },
                { num: 77, name: 'קרי' },
                { num: 78, name: 'קשוי לילד' },
                { num: 79, name: 'ראיה' },
                { num: 80, name: 'רחמנות' },
                { num: 81, name: 'רפואה' },
                { num: 82, name: 'שבועה' },
                { num: 83, name: 'שבת' },
                { num: 84, name: 'שוחד' },
                { num: 85, name: 'שוחט' },
                { num: 86, name: 'שינה' },
                { num: 87, name: 'שכרות' },
                { num: 88, name: 'שלום' },
                { num: 89, name: 'שמחה' },
                { num: 90, name: 'שרים' },
                { num: 91, name: 'תוכחה' },
                { num: 92, name: 'תפילה' },
                { num: 93, name: 'תשובה' },
            ];

            this.chapters = chaptersList;
            return chaptersList;
        } catch (error) {
            console.error('שגיאה בטעינת רשימת הפרקים:', error);
            return [];
        }
    }

    /**
     * טוען פרק ספציפי
     */
    async loadChapter(chapterNum) {
        try {
            const chapter = this.chapters.find(c => c.num === chapterNum);
            if (!chapter) {
                throw new Error(`פרק ${chapterNum} לא נמצא`);
            }

            const filename = `${chapterNum.toString().padStart(2, '0')}-${chapter.name}.md`;
            const filepath = `${this.chaptersDir}${filename}`;

            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`שגיאה בטעינת הפרק: ${response.statusText}`);
            }

            const markdown = await response.text();
            return {
                ...chapter,
                markdown,
                filename
            };
        } catch (error) {
            console.error(`שגיאה בטעינת פרק ${chapterNum}:`, error);
            throw error;
        }
    }

    /**
     * ממיר Markdown ל-HTML
     */
    parseMarkdown(markdown) {
        if (typeof marked !== 'undefined') {
            return marked.parse(markdown);
        } else {
            // Fallback - ממיר בסיסי
            return this.simpleMarkdownParser(markdown);
        }
    }

    /**
     * ממיר בסיסי ל-Markdown (fallback)
     */
    simpleMarkdownParser(markdown) {
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        
        // Lists
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');
        
        // Paragraphs
        html = html.split('\n\n').map(p => {
            if (!p.startsWith('<')) {
                return `<p>${p}</p>`;
            }
            return p;
        }).join('\n');
        
        return html;
    }

    /**
     * מחפש פרקים לפי טקסט
     */
    searchChapters(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerm = query.toLowerCase();
        return this.chapters.filter(chapter => {
            return chapter.name.toLowerCase().includes(searchTerm) ||
                   chapter.num.toString().includes(searchTerm);
        });
    }
}

// יצירת instance גלובלי
const chaptersLoader = new ChaptersLoader();

