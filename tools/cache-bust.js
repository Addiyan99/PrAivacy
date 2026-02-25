const fs = require('fs');
const path = require('path');

// Configuration
const HTML_FILES = ['home.html', 'awards.html', 'media.html', 'team.html', 'testimonials.html', 'index.html'];
const CACHE_BUSTER_JS = 'assets/js/cache-buster.js';
const VERSION = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // YYYYMMDDHHmm

console.log(`🚀 Starting Cache Busting Automation (Version: ${VERSION})`);

/**
 * Updates CACHE_VERSION in cache-buster.js
 */
function updateJsUtility() {
    const filePath = path.join(process.cwd(), CACHE_BUSTER_JS);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Warning: ${CACHE_BUSTER_JS} not found.`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /const CACHE_VERSION = '.*';/;
    const newContent = content.replace(regex, `const CACHE_VERSION = '${VERSION}';`);

    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Updated ${CACHE_BUSTER_JS}`);
}

/**
 * Updates asset links in HTML files
 */
function updateHtmlFiles() {
    HTML_FILES.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (!fs.existsSync(filePath)) return;

        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to find assets (css, js, images) with optional existing version query
        // Matches things like href="assets/css/styles.css" or src="assets/img/logo.png?v=123"
        const assetRegex = /(src|href)="((?:assets\/|https?:\/\/.*assets\/)[^"]+?)(\?v=[^"]+)?("+)/g;

        const updatedContent = content.replace(assetRegex, (match, attr, url, existingV, closeQuotes) => {
            // Only bust local assets starting with 'assets/' or containing '/assets/'
            if (!url.includes('assets/')) return match;

            return `${attr}="${url}?v=${VERSION}"`;
        });

        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`✅ Updated asset links in ${file}`);
        }
    });
}

// Execution
try {
    updateJsUtility();
    updateHtmlFiles();
    console.log('✨ Cache busting complete!');
} catch (error) {
    console.error('❌ Error during cache busting:', error);
    process.exit(1);
}
