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

    // ✅ FIX: Proper image path handling for CMS
    let images = data.images || [];
    
    // Convert CMS image objects to proper paths
    if (images.length > 0 && typeof images[0] === 'object') {
      images = images.map(img => {
        // Handle both string paths and image objects from CMS
        return typeof img === 'string' ? img : (img.image || '');
      }).filter(img => img); // Remove empty values
    }

    // Use first image as primary
    const primary_image = images.length > 0 ? images[0] : '/images/car-placeholder.jpg';

    cars.push({
      slug: file.replace('.md', ''),
      title: data.title || `${data.brand} ${data.model}` || 'Unnamed Car',
      brand: data.brand || 'Unknown',
      model: data.model || '',
      year: data.year || '',
      price: data.price || 'Contact for price',
      status: data.status || 'available',
      featured: data.featured || false,
      description: data.description || 'No description available.',
      features: data.features || [],
      images: images,
      primary_image: primary_image
    });
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}

fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
console.log(`✅ cars-index.json created successfully with ${cars.length} entries.`);
