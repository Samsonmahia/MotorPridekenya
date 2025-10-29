// generateCarsIndex.js
// This script scans /content/cars for Markdown (.md) files,
// extracts YAML frontmatter, and builds /data/cars-index.json

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // make sure gray-matter is installed

const carsDir = path.join(__dirname, 'content', 'cars');
const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'cars-index.json');

function generateCarsIndex() {
  if (!fs.existsSync(carsDir)) {
    console.error(`❌ Directory not found: ${carsDir}`);
    return;
  }

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created /data directory.');
  }

  const carFiles = fs.readdirSync(carsDir).filter(file => file.endsWith('.md'));

  if (carFiles.length === 0) {
    console.warn('⚠️ No Markdown car files found in /content/cars.');
    fs.writeFileSync(outputFile, '[]');
    return;
  }

  const cars = carFiles.map(file => {
    const filePath = path.join(carsDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);

      return {
        slug: file.replace('.md', ''),
        name: data.name || 'Unnamed Car',
        brand: data.brand || 'Unknown',
        model: data.model || '',
        year: data.year || '',
        price: data.price || '',
        fuel: data.fuel || '',
        transmission: data.transmission || '',
        images: data.images || [],
        status: data.status || 'Available'
      };
    } catch (err) {
      console.error(`❌ Error reading ${file}:`, err.message);
      return null;
    }
  }).filter(Boolean);

  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`✅ cars-index.json generated with ${cars.length} cars.`);
}

generateCarsIndex();
