// generatecarsindex.js - Updated version
const fs = require('fs');
const path = require('path');

const carsDir = './data/cars';
const outputFile = './data/cars-index.json';

function generateIndex() {
  const files = fs.readdirSync(carsDir);
  const carsIndex = {
    lastUpdated: new Date().toISOString(),
    totalCars: files.length,
    cars: []
  };

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const carData = JSON.parse(fs.readFileSync(path.join(carsDir, file), 'utf8'));
      
      // Create lightweight version for index
      carsIndex.cars.push({
        id: carData.id || path.basename(file, '.json'),
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        featuredImage: carData.images ? carData.images[0] : '/images/default-car.jpg',
        location: carData.location,
        fuelType: carData.specifications?.fuelType,
        transmission: carData.specifications?.transmission,
        quickView: carData.quickView || `${carData.specifications?.mileage} km`
      });
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(carsIndex, null, 2));
  console.log(`Generated index with ${carsIndex.cars.length} cars`);
}

generateIndex();