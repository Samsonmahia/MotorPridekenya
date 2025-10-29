// scripts/generateCarsIndex.js

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const carsDir = path.join(__dirname, '../content/cars');
const outputFile = path.join(__dirname, '../data/cars-index.json');

function generateCarsIndex() {
  if (!fs.existsSync(carsDir)) {
    console.error(`❌ Directory not found: ${carsDir}`);
    return;
  }

  const carFiles = fs.readdirSync(carsDir).filter(file => file.endsWith('.md'));

  if (carFiles.length === 0) {
    console.warn('⚠️ No Markdown files found in content/cars.');
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
  console.log(`✅ cars-index.json successfully generated with ${cars.length} cars.`);
}

generateCarsIndex();
