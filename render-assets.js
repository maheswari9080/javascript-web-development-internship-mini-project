const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const tasks = [
  {
    html: path.join(__dirname, 'docs', 'render_templates', 'linkedin_card.html'),
    out: path.join(__dirname, 'image.png'),
    width: 1280,
    height: 720
  },
  {
    html: path.join(__dirname, 'docs', 'render_templates', 'hero_banner.html'),
    out: path.join(__dirname, 'docs', 'images', 'hero-banner.png'),
    width: 1200,
    height: 420
  },
  {
    html: path.join(__dirname, 'docs', 'render_templates', 'inventory_dashboard.html'),
    out: path.join(__dirname, 'docs', 'images', 'inventory-dashboard.png'),
    width: 1100,
    height: 600
  },
  {
    html: path.join(__dirname, 'docs', 'render_templates', 'core_curriculum.html'),
    out: path.join(__dirname, 'docs', 'images', 'core-curriculum.png'),
    width: 1100,
    height: 520
  },
  {
    html: path.join(__dirname, 'docs', 'render_templates', 'test_runner.html'),
    out: path.join(__dirname, 'docs', 'images', 'test-runner.png'),
    width: 1100,
    height: 500
  }
];

console.log('Rendering high-res light-theme graphics...');

for (const task of tasks) {
  const fileUrl = 'file:///' + task.html.replace(/\\/g, '/');
  console.log(`Rendering ${path.basename(task.out)} (${task.width}x${task.height})...`);
  
  execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    `--window-size=${task.width},${task.height}`,
    '--hide-scrollbars',
    `--screenshot=${task.out}`,
    fileUrl
  ]);

  if (fs.existsSync(task.out)) {
    const stat = fs.statSync(task.out);
    console.log(`✓ Generated ${task.out} (${stat.size} bytes)`);
  } else {
    console.error(`✗ Failed to create ${task.out}`);
  }
}

console.log('All image assets generated successfully!');
