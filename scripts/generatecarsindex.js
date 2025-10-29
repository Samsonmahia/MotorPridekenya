const fs = require('fs');
const path = require('path');

console.log('🚗 Starting CMS cars index generation...');

const carsDir = path.join(__dirname, '../content/cars');
const outputFile = path.join(__dirname, '../data/cars-index.json');

// Ensure data directory exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

try {
  // Check if cars directory exists
  if (!fs.existsSync(carsDir)) {
    console.log('📁 Creating cars directory...');
    fs.mkdirSync(carsDir, { recursive: true });
    fs.writeFileSync(outputFile, '[]');
    console.log('✅ Empty cars index created (no cars yet)');
    process.exit(0);
  }

  const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
  console.log(`📁 Found ${files.length} car files in CMS`);

  if (files.length === 0) {
    console.log('ℹ️ No car files found in CMS yet');
    fs.writeFileSync(outputFile, '[]');
    process.exit(0);
  }

  const cars = [];
  let matter;

  // Try to load gray-matter, but continue without it if needed
  try {
    matter = require('gray-matter');
  } catch (error) {
    console.log('⚠️ gray-matter not available, using basic parsing');
  }

  for (const file of files) {
    try {
      const fullPath = path.join(carsDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let carData = {};
      const slug = file.replace('.md', '');

      if (matter) {
        // Use gray-matter if available
        const { data } = matter(content);
        carData = data;
      } else {
        // Basic YAML frontmatter parsing (fallback)
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontMatterMatch) {
          const yamlContent = frontMatterMatch[1];
          yamlContent.split('\n').forEach(line => {
            const match = line.match(/(\w+):\s*(.*)/);
            if (match) {
              const key = match[1].trim();
              let value = match[2].trim();
              
              // Handle arrays (like features, images)
              if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
              }
              
              // Handle boolean values
              if (value === 'true') value = true;
              if (value === 'false') value = false;
              
              carData[key] = value;
            }
          });
        }
      }

      console.log(`📄 Processing: ${file}`, carData.title || carData.brand);

      // Process images from CMS - CRITICAL FIX
      let images = [];
      if (carData.images && Array.isArray(carData.images)) {
        images = carData.images.map(img => {
          if (typeof img === 'string') return img;
          if (img && typeof img === 'object') return img.image || img.url || '';
          return '';
        }).filter(img => img && img !== '');
      }

      // If no images from CMS, use placeholder
      if (images.length === 0) {
        images = ['/images/car-placeholder.jpg'];
      }

      // Format the car object for frontend
      const car = {
        slug: slug,
        title: carData.title || `${carData.brand || 'Car'} ${carData.model || ''}`.trim() || 'Untitled Car',
        brand: carData.brand || 'Unknown',
        model: carData.model || '',
        year: carData.year || '2023',
        price: carData.price || 'Contact for price',
        status: carData.status || 'available',
        featured: carData.featured || false,
        description: carData.description || 'No description available.',
        features: Array.isArray(carData.features) ? carData.features : [],
        images: images,
        primary_image: images[0] || '/images/car-placeholder.jpg'
      };

      cars.push(car);
      console.log(`✅ Added: ${car.title}`);

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  // Write the final JSON file
  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`🎉 Success! Generated cars-index.json with ${cars.length} cars from CMS`);
  
  // Debug: Show first car to verify
  if (cars.length > 0) {
    console.log('🔍 First car sample:', {
      title: cars[0].title,
      images: cars[0].images,
      primary_image: cars[0].primary_image
    });
  }

} catch (error) {
  console.error('💥 Critical error:', error);
  // Always create valid JSON, even if empty
  fs.writeFileSync(outputFile, '[]');
  console.log('✅ Created empty cars index as fallback');
}
