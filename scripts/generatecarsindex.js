// generateCarsIndex.js
// This script scans /data/cars for all .json files and creates cars-index.json

const fs = require('fs');
const path = require('path');

const carsDir = path.join(__dirname, 'data', 'cars');
const outputFile = path.join(__dirname, 'data', 'cars-index.json');

function generateCarsIndex() {
  if (!fs.existsSync(carsDir)) {
    console.error(`❌ Directory not found: ${carsDir}`);
    return;
  }

  const carFiles = fs.readdirSync(carsDir).filter(file => file.endsWith('.json'));

  if (carFiles.length === 0) {
    console.warn('⚠️ No car JSON files found in data/cars.');
    return;
  }

  const cars = carFiles.map(file => {
    const filePath = path.join(carsDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return {
        slug: file.replace('.json', ''),
        name: data.name || 'Unnamed Car',
        brand: data.brand || 'Unknown',
        model: data.model || '',
        year: data.year || '',
        price: data.price || '',
        fuel: data.fuel || '',
        transmission: data.transmission || '',
        image: data.image || '',
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
