const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SITE_PATH = path.join(__dirname, '..');

// Serve static files and handle API
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API: Create blog post
    if (req.method === 'POST' && req.url === '/api/create-post') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const result = createBlogPost(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // API: Get existing images
    if (req.method === 'GET' && req.url === '/api/images') {
        try {
            const files = fs.readdirSync(SITE_PATH);
            const images = files.filter(f => /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(images));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // API: Add card only (without creating page)
    if (req.method === 'POST' && req.url === '/api/add-card') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const result = addCardOnly(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const extname = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentTypes[extname] || 'text/plain' });
            res.end(content);
        }
    });
});

function createBlogPost(data) {
    const {
        program,
        versionType,
        buildCode,
        buildNumber,
        publishDate,
        image,
        shortDesc,
        mainContent,
        features,
        minReq,
        arch,
        downloadSize,
        license
    } = data;

    // Generate version strings
    const versionDisplay = `${buildCode}_${buildNumber.replace('build.', '')}`;
    const fileVersion = buildNumber.replace('build.', '').replace(/\//g, '-');
    const filename = `${program} (${buildCode}_${fileVersion}).html`;

    // Determine subfolder based on program type
    let subfolder = '';
    if (program.toLowerCase().includes('spe')) {
        subfolder = 'greeninsider/spe50';
    } else if (program.toLowerCase().includes('worksup')) {
        subfolder = 'greeninsider/worksup';
    }
    const targetDir = subfolder ? path.join(SITE_PATH, subfolder) : SITE_PATH;
    if (subfolder && !fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const filepath = path.join(targetDir, filename);
    const cardLink = subfolder ? `${subfolder}/${filename}` : filename;
    const pathPrefix = subfolder ? '../../' : '';

    // Format date
    const date = new Date(publishDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dateDisplay = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    // Generate features HTML
    const featuresHtml = features && features.length > 0
        ? `<h2>What's New</h2>\n                <ul>\n${features.map(f => `                    <li>${f}</li>`).join('\n')}\n                </ul>`
        : '';

    const featuresAddedHtml = features && features.length > 0
        ? features.map(f => `<li>+ ${f}</li>`).join('\n                    ')
        : '<li>+ Bug fixes and improvements</li>';

    // Generate page HTML
    const pageHtml = `<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${program} (${versionDisplay}) - GreenToast Insider Blog</title>
    <link rel="icon" type="image/png" href="${pathPrefix}Toast_4K_icon.png">
    <link rel="stylesheet" href="${pathPrefix}styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body { background: #f8fafc; font-family: Inter, Arial, sans-serif; overflow-x: hidden; }
        .blog-header {
            background: #fff;
            border-bottom: 1px solid #e5e7eb;
            padding: 2rem 0 1rem 0;
            text-align: center;
        }
        .blog-header .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }
        .blog-header .logo img {
            width: 48px;
            height: 48px;
        }
        .blog-header h1 {
            font-size: 2.2rem;
            font-weight: 700;
            color: #2563eb;
            margin: 0;
        }
        .insider-main {
            max-width: 1100px;
            margin: 0 auto;
            padding: 6rem 1rem 2rem 1rem;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        .insider-title {
            font-size: 2.7rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 2.5rem;
            color: #1a1a1a;
        }
        .insider-grid {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 3rem;
        }
        .insider-meta {
            color: #444;
            font-size: 1.05rem;
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            margin-top: 0.5rem;
        }
        .meta-label {
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 0.2rem;
        }
        .insider-content {
            color: #222;
            font-size: 1.18rem;
            line-height: 1.7;
        }
        .insider-content h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #2563eb;
        }
        .insider-img {
            width: 100%;
            max-width: 540px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(79,70,229,0.08);
            margin: 1.2rem 0 0.5rem 0;
            display: block;
        }
        .insider-caption {
            font-size: 0.98rem;
            color: #555;
            text-align: left;
            margin-bottom: 1.5rem;
        }
        .spe-details-section {
            max-width: 900px;
            margin: 0 auto 2rem auto;
            padding: 0 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .spe-details-cards {
            display: flex;
            gap: 2.5rem;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
            margin-bottom: 2rem;
        }
        .spe-card {
            background: #23202b;
            color: #fff;
            border-radius: 12px;
            padding: 2rem 1.5rem 1.5rem 1.5rem;
            min-width: 320px;
            max-width: 400px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.18);
            font-family: 'Consolas', 'Courier New', monospace;
        }
        .spe-card h2 {
            font-family: 'Inter', Arial, sans-serif;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: 1px;
        }
        .spe-card hr {
            border: none;
            border-top: 2px solid #ff2a6d;
            margin: 0.5rem 0 1rem 0;
        }
        .spe-license {
            font-size: 0.95rem;
            white-space: pre-line;
            margin: 0;
            color: #fff;
        }
        .spe-added {
            min-width: 260px;
            max-width: 340px;
            background: #23202b;
            color: #fff;
            border-radius: 12px;
            padding: 2rem 1.5rem 1.5rem 1.5rem;
            box-shadow: 0 4px 24px rgba(0,0,0,0.18);
            font-family: 'Inter', Arial, sans-serif;
        }
        .spe-added h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 1rem;
        }
        .spe-added ul {
            list-style: none;
            padding: 0;
            color: #fff;
            font-size: 1.15rem;
        }
        .spe-added li {
            margin-bottom: 0.7rem;
        }
        .spe-specs {
            text-align: center;
            color: #fff;
            font-family: 'Inter', Arial, sans-serif;
            margin-bottom: 2rem;
            background: #23202b;
            border-radius: 12px;
            padding: 2rem 1.5rem 1.5rem 1.5rem;
            box-shadow: 0 4px 24px rgba(0,0,0,0.18);
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        .spe-specs h2 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1.2rem;
        }
        .spe-specs p {
            font-size: 1.15rem;
            margin: 0.5rem 0;
        }
        .back-btn {
            display: inline-block;
            background: #2563eb;
            color: #fff;
            padding: 0.7rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s;
            margin-top: 2rem;
        }
        .back-btn:hover {
            background: #1e40af;
        }
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #fff;
            border-bottom: 1px solid #e5e7eb;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(79,70,229,0.04);
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.7rem 1.5rem;
        }
        @media (max-width: 900px) {
            .insider-grid { grid-template-columns: 1fr; gap: 0; }
            .insider-meta { flex-direction: row; gap: 2.5rem; margin-bottom: 2rem; }
            .spe-details-cards { flex-direction: column; align-items: stretch; }
            .spe-card, .spe-added { max-width: 100%; min-width: 0; }
        }
        @media (max-width: 600px) {
            .insider-title { font-size: 2rem; margin-bottom: 1.5rem; }
            .insider-main { padding: 5rem 0.8rem 1.5rem 0.8rem; }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="${pathPrefix}index.html" class="nav-logo">
                <img src="${pathPrefix}Toast_4K_icon.png" alt="Toast Icon" class="nav-logo-icon">
                <span class="logo-text">GreenToastSoftware</span>
            </a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="${pathPrefix}index.html" class="nav-link">Home</a></li>
                <li class="nav-item dropdown">
                    <a href="${pathPrefix}index.html#innovation" class="nav-link">Innovation <span class="dropdown-arrow">▾</span></a>
                    <div class="dropdown-content">
                        <a href="${pathPrefix}GreenToast Apps.html" class="dropdown-link">GreenToast Apps</a>
                        <a href="${pathPrefix}SPE_blog.html" class="dropdown-link">GreenInsider Blog</a>
                    </div>
                </li>
                <li class="nav-item"><a href="${pathPrefix}worksup.html" class="nav-link">WorksUP</a></li>
                <li class="nav-item"><a href="${pathPrefix}about.html" class="nav-link">About Us</a></li>
                <li class="nav-item"><a href="${pathPrefix}contact.html" class="nav-link">Contact Us</a></li>
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <main class="insider-main">
        <h1 class="insider-title">${program} ${versionType} VERSION (${versionDisplay})</h1>
        <div class="insider-grid">
            <aside class="insider-meta">
                <div>
                    <div class="meta-label">Author</div>
                    <div>GreenToast Software Team</div>
                </div>
                <div>
                    <div class="meta-label">Published</div>
                    <div>${dateDisplay}</div>
                </div>
                <div>
                    <div class="meta-label">Version</div>
                    <div>${versionDisplay}</div>
                </div>
            </aside>
            <article class="insider-content">
                <img src="${pathPrefix}${image}" alt="${program}" class="insider-img">
                <p class="insider-caption">${program} ${versionType} (${versionDisplay})</p>
                
                <p>${mainContent}</p>
                
                ${featuresHtml}
            </article>
        </div>
    </main>

    <section class="spe-details-section">
        <div class="spe-details-cards">
            <div class="spe-card">
                <h2>LICENSE</h2>
                <hr>
                <pre class="spe-license">${license}
Copyright (c) ${date.getFullYear()} GreenToast Software

This software is provided for preview purposes.
Use at your own risk.</pre>
            </div>
            <div class="spe-added">
                <h2>Added</h2>
                <ul>
                    ${featuresAddedHtml}
                </ul>
            </div>
        </div>
        <div class="spe-specs">
            <h2>Specifications</h2>
            <p><strong>Platform:</strong> ${minReq}</p>
            <p><strong>Architecture:</strong> ${arch}</p>
            <p><strong>Download Size:</strong> ${downloadSize || 'N/A'}</p>
        </div>
        <a href="${pathPrefix}SPE_blog.html" class="back-btn">← Back to Blog</a>
    </section>

    <script src="${pathPrefix}script.js"></script>
</body>
</html>`;

    // Write the page file
    fs.writeFileSync(filepath, pageHtml, 'utf8');

    // Generate card HTML
    const processedShortDesc = shortDesc
        .replace('{TYPE}', versionType)
        .replace('{VERSION}', versionDisplay);

    const cardHtml = `            <a href="${cardLink}" class="blog-card" style="text-decoration: none; color: inherit;">
                <img src="${image}" alt="${program}">
                <div class="blog-card-content">
                    <h3>${program} ${versionType} VERSION (${versionDisplay})</h3>
                    <p><strong>${dateDisplay}</strong></p>
                    <p style="font-size: 0.85rem;">${processedShortDesc}</p>
                    <span style="display:inline-flex;align-items:center;margin-top:1rem;"></span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="vertical-align:middle;">
                            <path d="M6 4l5 5-5 5" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </a>`;

    // Update SPE_blog.html
    const blogPath = path.join(SITE_PATH, 'SPE_blog.html');
    let blogContent = fs.readFileSync(blogPath, 'utf8');

    // Find the blog-grid section and insert the new card at the beginning
    const gridMarker = '<section class="blog-grid">';
    const insertPosition = blogContent.indexOf(gridMarker);
    
    if (insertPosition !== -1) {
        const insertPoint = insertPosition + gridMarker.length;
        blogContent = blogContent.slice(0, insertPoint) + '\n' + cardHtml + blogContent.slice(insertPoint);
        fs.writeFileSync(blogPath, blogContent, 'utf8');
    }

    return {
        success: true,
        filename: filename,
        filepath: filepath,
        message: `Post criado com sucesso!\n\nArquivo: ${filename}\nCard adicionado ao SPE_blog.html`
    };
}

// Add card only (without creating page)
function addCardOnly(data) {
    const { program, versionType, versionDisplay, dateDisplay, image, link, shortDesc } = data;

    const cardHtml = `            <a href="${link}" class="blog-card" style="text-decoration: none; color: inherit;">
                <img src="${image}" alt="${program}">
                <div class="blog-card-content">
                    <h3>${program} ${versionType} VERSION (${versionDisplay})</h3>
                    <p><strong>${dateDisplay}</strong></p>
                    <p style="font-size: 0.85rem;">${shortDesc}</p>
                    <span style="display:inline-flex;align-items:center;margin-top:1rem;">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="vertical-align:middle;">
                            <path d="M6 4l5 5-5 5" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </a>`;

    // Update SPE_blog.html
    const blogPath = path.join(SITE_PATH, 'SPE_blog.html');
    let blogContent = fs.readFileSync(blogPath, 'utf8');

    const gridMarker = '<section class="blog-grid">';
    const insertPosition = blogContent.indexOf(gridMarker);
    
    if (insertPosition !== -1) {
        const insertPoint = insertPosition + gridMarker.length;
        blogContent = blogContent.slice(0, insertPoint) + '\n' + cardHtml + blogContent.slice(insertPoint);
        fs.writeFileSync(blogPath, blogContent, 'utf8');
    } else {
        throw new Error('Não foi possível encontrar a seção blog-grid no SPE_blog.html');
    }

    return {
        success: true,
        message: 'Card adicionado ao SPE_blog.html'
    };
}

server.listen(PORT, () => {
    console.log('\n========================================');
    console.log('   Blog Version Creator - Server');
    console.log('========================================\n');
    console.log(`   Servidor rodando em: http://localhost:${PORT}`);
    console.log(`   Pasta do site: ${SITE_PATH}\n`);
    console.log('   Pressione Ctrl+C para parar\n');
    console.log('========================================\n');
});
