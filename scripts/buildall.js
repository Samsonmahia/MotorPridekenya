const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Building from CMS .md files...');

// Ensure directories exist
const directories = ['content/cars', 'content/contacts', 'data', 'static/images/cars'];
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

function processCarsFromMD() {
  console.log('\n📊 Processing cars from .md files...');
  
  const carsDir = path.join(__dirname, '../content/cars');
  const outputFile = path.join(__dirname, '../data/cars-index.json');
  
  let cars = [];
  
  if (!fs.existsSync(carsDir)) {
    console.log('❌ content/cars directory not found');
    return;
  }

  const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
  console.log(`📄 Found ${files.length} .md car files`);
  
  if (files.length === 0) {
    console.log('⚠️ No .md files found in content/cars/');
  }

  files.forEach(file => {
    try {
      const filePath = path.join(carsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      console.log(`\n🔍 Processing: ${file}`);
      
      // Extract frontmatter (between --- markers)
      const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`❌ No frontmatter found in ${file}`);
        return;
      }

      const frontmatter = yaml.load(frontmatterMatch[1]);
      const slug = path.basename(file, '.md');
      
      console.log(`✅ Frontmatter extracted for: ${frontmatter.title || 'Untitled'}`);
      
      // Process images - handle both string and object formats from CMS
      let images = [];
      if (frontmatter.images) {
        if (Array.isArray(frontmatter.images)) {
          images = frontmatter.images.map(img => {
            if (typeof img === 'object' && img.image) {
              // CMS stores as {image: "/images/cars/filename.jpg"}
              return img.image;
            }
            return img; // Already a string
          });
        } else if (typeof frontmatter.images === 'string') {
          // Single image as string
          images = [frontmatter.images];
        }
      }
      
      // Ensure images have correct path format
      images = images.map(img => {
        if (img.startsWith('/images/')) {
          return img;
        } else if (img.startsWith('images/')) {
          return '/' + img;
        } else {
          return '/images/' + img;
        }
      }).filter(img => img); // Remove empty values
      
      // If no images, use placeholder
      if (images.length === 0) {
        images = ['/images/cars/car-placeholder.jpg'];
        console.log(`⚠️ No images found, using placeholder for ${frontmatter.title}`);
      }
      
      console.log(`🖼️ Images processed: ${images.length} images`);
      
      const car = {
        slug: slug,
        title: frontmatter.title || 'Untitled Car',
        brand: frontmatter.brand || '',
        model: frontmatter.model || '',
        year: frontmatter.year || 2024,
        price: frontmatter.price || 'KSh 0',
        status: frontmatter.status || 'available',
        featured: frontmatter.featured || false,
        description: frontmatter.description || '',
        features: Array.isArray(frontmatter.features) ? frontmatter.features : [],
        images: images
      };
      
      cars.push(car);
      console.log(`✅ Added to JSON: ${car.title}`);
      
    } catch (error) {
      console.log(`❌ Error processing ${file}:`, error.message);
    }
  });

  // Sort cars: featured first, then by year
  cars.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year - a.year;
  });

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`\n🎉 Generated cars-index.json with ${cars.length} vehicles from .md files`);
  
  // Log what was created
  cars.forEach(car => {
    console.log(`   🚗 ${car.title} - ${car.images.length} images`);
  });
}

function processContactsFromMD() {
  console.log('\n📞 Processing contacts from .md files...');
  
  const contactsDir = path.join(__dirname, '../content/contacts');
  const outputFile = path.join(__dirname, '../data/contacts-index.json');
  
  let contacts = [];
  
  if (fs.existsSync(contactsDir)) {
    const files = fs.readdirSync(contactsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} .md contact files`);
    
    files.forEach(file => {
      try {
        const filePath = path.join(contactsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]);
          const slug = path.basename(file, '.md');
          
          const contact = {
            slug: slug,
            name: frontmatter.name || 'Unknown',
            phone: frontmatter.phone || '+254000000000',
            whatsapp: frontmatter.whatsapp || '+254000000000',
            email: frontmatter.email || '',
            role: frontmatter.role || 'Staff'
          };
          
          contacts.push(contact);
          console.log(`✅ Added contact: ${contact.name}`);
        }
      } catch (error) {
        console.log(`❌ Error processing ${file}:`, error.message);
      }
    });
  }
  
  // Ensure we have contacts for WhatsApp
  if (contacts.length === 0) {
    console.log('📝 Creating sample contacts for WhatsApp');
    contacts = [
      { slug: "samuel", name: "Samuel Maina", whatsapp: "+254712345678", role: "Sales Manager" },
      { slug: "elizabeth", name: "Elizabeth Wanjiku", whatsapp: "+254723456789", role: "Sales Agent" },
      { slug: "klarie", name: "Klarie Mwangi", whatsapp: "+254734567890", role: "Customer Support" },
      { slug: "john", name: "John Kamau", whatsapp: "+254745678901", role: "Sales Agent" },
      { slug: "sarah", name: "Sarah Otieno", whatsapp: "+254756789012", role: "Sales Agent" }
    ];
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
  console.log(`🎉 Generated contacts-index.json with ${contacts.length} contacts`);
}

// Run the build
processCarsFromMD();
processContactsFromMD();

console.log('\n✅ BUILD COMPLETED!');
console.log('📊 CMS .md files → JSON data conversion successful');
console.log('🚀 Your cars should now appear on the live site!');
