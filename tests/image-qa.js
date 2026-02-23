#!/usr/bin/env node
// Image QA — validates image assets match spec
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const THUMBS_DIR = path.join(ROOT, 'assets', 'images', 'thumbs');
const HERO_DIR = path.join(ROOT, 'assets', 'images', 'hero');

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
    if (condition) { passed++; }
    else { failed++; errors.push(message); }
}

// Get project IDs from YAML
function getProjectIds() {
    const yamlPath = path.join(ROOT, '_data', 'projects.yml');
    const content = fs.readFileSync(yamlPath, 'utf8');
    const ids = [];
    for (const line of content.split('\n')) {
        const match = line.match(/^- id:\s*"([^"]+)"/);
        if (match) ids.push(match[1]);
    }
    return ids;
}

const projectIds = getProjectIds();
assert(projectIds.length >= 10, `Expected ≥10 project IDs, got ${projectIds.length}`);

// Check directories exist
assert(fs.existsSync(THUMBS_DIR), `Thumbs directory missing: ${THUMBS_DIR}`);
assert(fs.existsSync(HERO_DIR), `Hero directory missing: ${HERO_DIR}`);

if (!fs.existsSync(THUMBS_DIR) || !fs.existsSync(HERO_DIR)) {
    console.log('❌ Image directories missing, cannot continue');
    process.exit(1);
}

// Expected sizes
const THUMB_SIZES = ['342x192', '480x270', '665x374'];
const HERO_SIZES = ['768x432', '1280x720', '1920x1080'];

// Size budgets (bytes)
const THUMB_MAX_WEBP = 80 * 1024;  // 80KB
const HERO_MAX_WEBP = 250 * 1024;  // 250KB

for (const id of projectIds) {
    const prefix = `[${id}]`;
    
    // Check thumbnail variants
    for (const size of THUMB_SIZES) {
        const webpFile = path.join(THUMBS_DIR, `${id}-thumb-${size}.webp`);
        const jpegFile = path.join(THUMBS_DIR, `${id}-thumb-${size}.jpeg`);
        const jpgFile = path.join(THUMBS_DIR, `${id}-thumb-${size}.jpg`);
        
        const webpExists = fs.existsSync(webpFile);
        const jpegExists = fs.existsSync(jpegFile) || fs.existsSync(jpgFile);
        
        assert(webpExists, `${prefix} missing thumb WebP: ${size}`);
        assert(jpegExists, `${prefix} missing thumb JPEG/JPG: ${size}`);
        
        // Size budget for smallest thumb WebP
        if (webpExists && size === '342x192') {
            const stat = fs.statSync(webpFile);
            assert(stat.size <= THUMB_MAX_WEBP, 
                `${prefix} thumb ${size}.webp too large: ${(stat.size/1024).toFixed(1)}KB > ${THUMB_MAX_WEBP/1024}KB`);
        }
    }
    
    // Check hero variants
    for (const size of HERO_SIZES) {
        const webpFile = path.join(HERO_DIR, `${id}-hero-${size}.webp`);
        const jpegFile = path.join(HERO_DIR, `${id}-hero-${size}.jpeg`);
        const jpgFile = path.join(HERO_DIR, `${id}-hero-${size}.jpg`);
        
        const webpExists = fs.existsSync(webpFile);
        const jpegExists = fs.existsSync(jpegFile) || fs.existsSync(jpgFile);
        
        assert(webpExists, `${prefix} missing hero WebP: ${size}`);
        assert(jpegExists, `${prefix} missing hero JPEG/JPG: ${size}`);
        
        // Size budget for hero WebP
        if (webpExists && size === '1280x720') {
            const stat = fs.statSync(webpFile);
            assert(stat.size <= HERO_MAX_WEBP,
                `${prefix} hero ${size}.webp too large: ${(stat.size/1024).toFixed(1)}KB > ${HERO_MAX_WEBP/1024}KB`);
        }
    }
}

// Naming convention check — no unexpected files
const thumbFiles = fs.readdirSync(THUMBS_DIR);
const heroFiles = fs.readdirSync(HERO_DIR);

const thumbPattern = /^[a-z0-9-]+-thumb-\d+x\d+\.(webp|jpeg|jpg)$/;
const heroPattern = /^[a-z0-9-]+-hero-\d+x\d+\.(webp|jpeg|jpg)$/;

for (const f of thumbFiles) {
    assert(thumbPattern.test(f), `Unexpected thumb filename: ${f}`);
}
for (const f of heroFiles) {
    assert(heroPattern.test(f), `Unexpected hero filename: ${f}`);
}

// Report
console.log(`\n🖼️  Image QA Results`);
console.log(`========================`);
if (errors.length > 0) {
    errors.forEach(e => console.log(`  ❌ ${e}`));
}
console.log(`\n✅ Passed: ${passed} | ❌ Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}
