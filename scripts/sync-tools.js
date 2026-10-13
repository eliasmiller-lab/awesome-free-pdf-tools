const fs = require('fs');
const path = require('path');

// 1. 读取 versa-pdf 的数据定义
const versaPdfDir = 'd:/ideawork/versa-pdf';
const toolsFilePath = path.join(versaPdfDir, 'src/data/tools.ts');
const catFilePath = path.join(versaPdfDir, 'src/data/categories.ts');

if (!fs.existsSync(toolsFilePath)) {
  console.error('versa-pdf tools.ts not found at:', toolsFilePath);
  process.exit(1);
}

const catMap = {
  organize: { slug: 'organize-pdf', name: 'Organize PDF', icon: '📑', desc: 'Merge, split, reorder, remove and extract PDF pages.' },
  convert: { slug: 'convert-pdf', name: 'Convert PDF', icon: '🔄', desc: 'Convert between PDF and JPG images or structured Markdown.' },
  optimize: { slug: 'optimize-pdf', name: 'Optimize & Repair PDF', icon: '🗜️', desc: 'Diagnose and recover damaged or corrupted PDF documents.' },
  edit: { slug: 'edit-pdf', name: 'Edit PDF', icon: '✏️', desc: 'Rotate, crop, watermark, add page numbers, edit, and fill PDF forms.' },
  security: { slug: 'security-pdf', name: 'PDF Security & Privacy', icon: '🔐', desc: 'Password encryption, permission unlocking, signing, redaction, and comparison.' }
};

const toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
const regex = /id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*category:\s*'([^']+)',\s*shortDesc:\s*'([^']+)'/g;

let m;
const toolsByCategory = {
  organize: [],
  convert: [],
  optimize: [],
  edit: [],
  security: []
};

let totalTools = 0;
while ((m = regex.exec(toolsContent)) !== null) {
  const [_, id, title, category, shortDesc] = m;
  if (toolsByCategory[category]) {
    toolsByCategory[category].push({
      id,
      title,
      category,
      desc: shortDesc,
      url: `https://versapdf.com/${catMap[category].slug}/${id}/`,
      urlZh: `https://versapdf.com/zh/${catMap[category].slug}/${id}/`,
      urlEs: `https://versapdf.com/es/${catMap[category].slug}/${id}/`
    });
    totalTools++;
  }
}

// 2. 生成 README.md
let md = `<div align="center">

# 🛠️ Awesome Free Online PDF Tools

**The Official Curated Directory of Free, Privacy-First PDF Utilities by [Versa PDF](https://versapdf.com).**  
*Merge, split, convert, repair, annotate, edit, redact, and sign PDFs securely directly in your browser without file size caps or data uploads.*

[![Versa PDF Official](https://img.shields.io/badge/Official%20Site-versapdf.com-e11d48?style=for-the-badge&logo=google-chrome&logoColor=white)](https://versapdf.com)
[![Privacy First](https://img.shields.io/badge/Security-100%25%20In--Browser%20(Zero%20Upload)-success?style=for-the-badge&logo=shield)](https://versapdf.com)
[![Tool Count](https://img.shields.io/badge/Total%20Tools-${totalTools}%20Utilities-blue?style=for-the-badge)](https://versapdf.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[🌐 Explore All Tools](https://versapdf.com) • [🔒 Why In-Browser PDF?](#-why-in-browser-pdf-tools) • [🗂️ Categories](#-quick-navigation--categories) • [🤝 Contributing](#-contributing)

</div>

---

## 📑 Quick Navigation & Categories

All tools are executed **100% client-side** using WebAssembly and HTML5 local sandboxing. No documents are ever uploaded to remote servers.

`;

for (const [catKey, catMeta] of Object.entries(catMap)) {
  const catUrl = `https://versapdf.com/${catMeta.slug}/`;
  const count = toolsByCategory[catKey].length;
  md += `- [${catMeta.icon} **${catMeta.name}** (${count} Tools)](${catUrl}) — ${catMeta.desc}\n`;
}

md += `
---

## 🗂️ Complete Tool Directory by Category

`;

let catIndex = 1;
for (const [catKey, catMeta] of Object.entries(catMap)) {
  const catUrl = `https://versapdf.com/${catMeta.slug}/`;
  md += `### ${catIndex}. ${catMeta.icon} [${catMeta.name}](${catUrl})\n\n`;
  md += `> 📂 **Category Landing Hub**: [${catUrl}](${catUrl})\n\n`;
  md += `| Tool Name | Description | Direct Access |\n`;
  md += `| :--- | :--- | :--- |\n`;

  for (const tool of toolsByCategory[catKey]) {
    md += `| **[${tool.title}](${tool.url})** | ${tool.desc} | [Launch ${tool.title} ↗](${tool.url}) |\n`;
  }
  md += `\n---\n\n`;
  catIndex++;
}

md += `## 🌐 Multilingual Access

Versa PDF provides localized workflows across international languages:
- 🇺🇸 **English Hub**: [https://versapdf.com/](https://versapdf.com/)
- 🇨🇳 **简体中文专区**: [https://versapdf.com/zh/](https://versapdf.com/zh/)
- 🇪🇸 **Español Hub**: [https://versapdf.com/es/](https://versapdf.com/es/)

---

## 🔒 Why In-Browser PDF Tools?

Unlike traditional PDF web services, [Versa PDF](https://versapdf.com) operates entirely in your local browser sandbox:
1. **100% Confidentiality**: Personal IDs, legal contracts, sensitive financials, and medical records never touch any remote cloud.
2. **Zero Upload/Download Latency**: Process multi-gigabyte or hundreds-of-pages documents instantly without network bottlenecks.
3. **Unlimited Usage**: No daily quotas, no hidden paywalls, and no file size restrictions.
4. **Offline Capability**: Can operate once loaded, immune to server downtime.

---

## 🤝 Contributing

Suggestions, bug reports, and tool requests are welcome!
1. Fork this repository.
2. Submit an issue or PR with enhancements.
3. Check out the official platform at [https://versapdf.com](https://versapdf.com).

---

## 📄 License

This directory project is distributed under the [MIT License](LICENSE).  
Copyright (c) 2026 [Versa PDF](https://versapdf.com).
`;

fs.writeFileSync(path.join(__dirname, '../README.md'), md, 'utf8');
console.log(`Successfully generated README.md with ${totalTools} tools across 5 categories.`);
