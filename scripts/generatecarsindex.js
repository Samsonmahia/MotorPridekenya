// scripts/generateCarsIndex.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Define paths
const carsDir = path.join(__dirname, '../content/cars');
const outputFile = path.join(__dirname, '../data/cars-index.json');

// Ensure /data exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

if (!fs.existsSync(carsDir)) {
  console.error(`❌ Missing directory: ${carsDir}`);
  fs.writeFileSync(outputFile, '[]');
  process.exit(0);
}

const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
if (files.length === 0) {
  console.warn('⚠️ No Markdown files found in /content/cars');
  fs.writeFileSync(outputFile, '[]');
  process.exit(0);
}

const cars = [];

for (const file of files) {
  const fullPath = path.join(carsDir, file);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(content);

    cars.push({
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
    });
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}

fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
console.log(`✅ cars-index.json created successfully with ${cars.length} entries.`);
