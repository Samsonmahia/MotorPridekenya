const fs = require('fs');
const path = require('path');

const carsDir = path.join(__dirname, '..', 'data', 'cars');

console.log('🔍 Checking car files structure...\n');

if (!fs.existsSync(carsDir)) {
  console.error('❌ Cars directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
  console.error('❌ No JSON files found!');
  process.exit(1);
}

console.log(`📁 Found ${files.length} car files:\n`);

files.forEach(file => {
  try {
    const carPath = path.join(carsDir, file);
    const content = fs.readFileSync(carPath, 'utf8');
    const carData = JSON.parse(content);
    
    console.log(`✅ ${file}:`);
    console.log(`   Make: ${carData.make || 'MISSING'}`);
    console.log(`   Model: ${carData.model || 'MISSING'}`);
    console.log(`   Price: ${carData.price || 'MISSING'}`);
    console.log(`   Images: ${carData.images ? carData.images.length : 0}`);
    console.log('---');
    
  } catch (err) {
    console.error(`❌ ${file}: Invalid JSON - ${err.message}`);
  }
});