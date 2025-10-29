const fs = require('fs');
const path = require('path');

console.log('🚗 Generating cars index from CMS...');

const carsDir = path.join(__dirname, '../content/cars');
const outputFile = path.join(__dirname, '../data/cars-index.json');

// Ensure directories exist
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

try {
  if (!fs.existsSync(carsDir)) {
    fs.writeFileSync(outputFile, '[]');
    console.log('✅ Created empty cars index');
    process.exit(0);
  }

  const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
  console.log(`📁 Found ${files.length} car files`);

  const cars = [];

  for (const file of files) {
    try {
      const filePath = path.join(carsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse YAML frontmatter
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontMatterMatch) continue;

      const yamlContent = frontMatterMatch[1];
      const data = {};
      
      yamlContent.split('\n').forEach(line => {
        const match = line.match(/(\w+):\s*(.*)/);
        if (match) {
          let key = match[1];
          let value = match[2].trim();
          
          // Handle arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
          }
          // Handle booleans
          else if (value === 'true') value = true;
          else if (value === 'false') value = false;
          
          data[key] = value;
        }
      });

      // Process images - CRITICAL: Convert CMS paths to web paths
      let images = [];
      if (data.images && Array.isArray(data.images)) {
        images = data.images.map(img => {
          if (typeof img === 'string') {
            // CMS stores relative paths, convert to absolute
            return img.startsWith('/') ? img : `/images/${img}`;
          }
          return '/images/car-placeholder.jpg';
        }).filter(img => img);
      }

      // Ensure we have at least one image
      if (images.length === 0) {
        images = ['/images/car-placeholder.jpg'];
      }

      const car = {
        slug: file.replace('.md', ''),
        title: data.title || `${data.brand} ${data.model}`,
        brand: data.brand || 'Unknown',
        model: data.model || '',
        year: data.year || '2023',
        price: data.price || 'Contact for price',
        status: data.status || 'available',
        featured: data.featured || false,
        description: data.description || 'No description available.',
        features: Array.isArray(data.features) ? data.features : [],
        images: images,
        primary_image: images[0]
      };

      cars.push(car);
      console.log(`✅ Added: ${car.title}`);

    } catch (error) {
      console.error(`❌ Error with ${file}:`, error.message);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`🎉 Generated cars-index.json with ${cars.length} cars`);

} catch (error) {
  console.error('💥 Build failed:', error);
  fs.writeFileSync(outputFile, '[]');
}