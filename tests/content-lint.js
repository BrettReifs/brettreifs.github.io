#!/usr/bin/env node
// Content lint — validates _data/projects.yml schema
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const YAML_PATH = path.join(ROOT, '_data', 'projects.yml');

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
    if (condition) { passed++; }
    else { failed++; errors.push(message); }
}

// Parse YAML manually (simple frontmatter-free list)
function parseProjectsYaml(content) {
    // Use the JSON embedded in index.html instead for reliable parsing
    // But for CI, parse the YAML directly with a simple approach
    const projects = [];
    let current = null;
    const lines = content.split('\n');
    
    for (const line of lines) {
        if (line.match(/^- id:/)) {
            if (current) projects.push(current);
            current = { id: line.match(/^- id:\s*"?([^"]+)"?/)[1] };
        } else if (current && line.match(/^\s{2}\w+:/)) {
            const match = line.match(/^\s{2}(\w+):\s*"?([^"]*)"?/);
            if (match) {
                const key = match[1];
                const value = match[2].replace(/^"/, '').replace(/"$/, '');
                if (key === 'published') current[key] = value === 'true';
                else if (key === 'featured') current[key] = value === 'true';
                else current[key] = value;
            }
        }
    }
    if (current) projects.push(current);
    return projects;
}

// Read and parse
const yamlContent = fs.readFileSync(YAML_PATH, 'utf8');
const projects = parseProjectsYaml(yamlContent);

// Validate project count
assert(projects.length >= 10, `Expected ≥10 projects, got ${projects.length}`);

// Required fields for each project
const REQUIRED_FIELDS = ['id', 'title', 'description', 'heroIcon', 'status'];

for (const p of projects) {
    const prefix = `[${p.id}]`;
    
    // Required fields
    for (const field of REQUIRED_FIELDS) {
        assert(p[field], `${prefix} missing required field: ${field}`);
    }
    
    // ID is kebab-case
    assert(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id), `${prefix} id is not kebab-case`);
    
    // Published projects with 'released' status should have images
    if (p.status === 'released' && p.published) {
        assert(p.image && p.image !== '', `${prefix} released project missing image`);
    }
    
    // Image path format validation
    if (p.image) {
        assert(p.image.startsWith('/assets/images/'), `${prefix} image path should start with /assets/images/`);
        assert(p.image.endsWith('.webp') || p.image.endsWith('.jpg') || p.image.endsWith('.jpeg') || p.image.endsWith('.png'),
            `${prefix} image should be webp/jpg/png`);
    }
    
    // heroImage path validation
    if (p.heroImage) {
        assert(p.heroImage.startsWith('/assets/images/hero/'), `${prefix} heroImage path should start with /assets/images/hero/`);
    }
    
    // GitHub URL format
    if (p.githubUrl) {
        assert(p.githubUrl.startsWith('https://github.com/'), `${prefix} githubUrl should be a GitHub URL`);
    }
}

// Unique IDs
const ids = projects.map(p => p.id);
const uniqueIds = new Set(ids);
assert(ids.length === uniqueIds.size, `Duplicate project IDs found: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);

// CSS hero video responsive check
const cssPath = path.join(ROOT, 'assets', 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    assert(css.includes('object-fit: cover') || css.includes('object-fit:cover'),
        'CSS must use object-fit: cover for responsive media scaling');
    assert(!css.match(/\.hero-video\s*\{[^}]*width:\s*auto/),
        'hero-video must NOT use width: auto (causes 4K overflow)');
    assert(!css.match(/\.hero-video\s*\{[^}]*min-width:\s*100%/),
        'hero-video must NOT use min-width: 100% (causes overflow on ultrawide)');
}

// Report
console.log(`\n📋 Content Lint Results`);
console.log(`========================`);
if (errors.length > 0) {
    errors.forEach(e => console.log(`  ❌ ${e}`));
}
console.log(`\n✅ Passed: ${passed} | ❌ Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
}
