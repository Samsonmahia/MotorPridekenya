const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Building MotorPride Kenya - FIXING IMAGES');

// Ensure directories exist
const directories = ['content/cars', 'content/contacts', 'data', 'static/images/cars'];
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

function buildCarsIndex() {
  console.log('\n📊 Processing cars from CMS...');
  
  const carsDir = path.join(__dirname, '../content/cars');
  const outputFile = path.join(__dirname, '../data/cars-index.json');
  
  let cars = [];
  
  if (fs.existsSync(carsDir)) {
    const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} car files in CMS`);
    
    files.forEach(file => {
      try {
        const filePath = path.join(carsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]);
          const slug = path.basename(file, '.md');
          
          // ✅ CRITICAL FIX: Process images correctly
          let images = [];
          if (frontmatter.images && Array.isArray(frontmatter.images)) {
            images = frontmatter.images.map(img => {
              // CMS stores images as objects with path property
              if (typeof img === 'object' && img.image) {
                return img.image; // Extract the actual image path
              }
              return img; // Already a string path
            }).filter(img => img); // Remove empty values
          }
          
          // ✅ Ensure images start with correct path
          images = images.map(img => {
            if (img.startsWith('/images/')) {
              return img; // Already correct
            } else if (img.startsWith('images/')) {
              return '/' + img; // Add leading slash
            } else if (img.startsWith('static/images/')) {
              return img.replace('static/', '/'); // Fix static path
            } else {
              return '/images/' + img; // Assume it's just filename
            }
          });
          
          // ✅ If no images, use placeholder
          if (images.length === 0) {
            images = ['/images/cars/car-placeholder.jpg'];
          }
          
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
            images: images // ✅ Now properly formatted
          };
          
          cars.push(car);
          console.log(`✅ ${car.title} - ${car.images.length} images: ${car.images[0]}`);
        }
      } catch (error) {
        console.log(`⚠️ Error with ${file}:`, error.message);
      }
    });
  }
  
  // If no cars from CMS, create sample with working images
  if (cars.length === 0) {
    console.log('📝 No cars in CMS - creating sample data');
    cars = [{
      slug: "sample-car",
      title: "Add cars through CMS",
      brand: "MotorPride Kenya",
      model: "Sample",
      year: 2024,
      price: "KSh 0",
      status: "available",
      featured: false,
      description: "Use the CMS dashboard to add your vehicles",
      features: ["Add features in CMS"],
      images: ["/images/cars/car-placeholder.jpg"]
    }];
  }
  
  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`🎉 Saved ${cars.length} cars with FIXED image paths`);
}

function buildContactsIndex() {
  console.log('\n📞 Processing contacts...');
  
  const contactsDir = path.join(__dirname, '../content/contacts');
  const outputFile = path.join(__dirname, '../data/contacts-index.json');
  
  let contacts = [];
  
  if (fs.existsSync(contactsDir)) {
    const files = fs.readdirSync(contactsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} contact files`);
    
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
        }
      } catch (error) {
        console.log(`⚠️ Error with ${file}:`, error.message);
      }
    });
  }
  
  // Ensure we have contacts for WhatsApp
  if (contacts.length === 0) {
    contacts = [
      { slug: "contact-1", name: "Samuel Maina", whatsapp: "+254712345678", role: "Sales Manager" },
      { slug: "contact-2", name: "Elizabeth Wanjiku", whatsapp: "+254723456789", role: "Sales Agent" },
      { slug: "contact-3", name: "Klarie Mwangi", whatsapp: "+254734567890", role: "Customer Support" },
      { slug: "contact-4", name: "John Kamau", whatsapp: "+254745678901", role: "Sales Agent" },
      { slug: "contact-5", name: "Sarah Otieno", whatsapp: "+254756789012", role: "Sales Agent" }
    ];
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
  console.log(`🎉 Saved ${contacts.length} contacts`);
}

// Run build
buildCarsIndex();
buildContactsIndex();

console.log('\n✅ BUILD COMPLETED - Images should now work!');
console.log('🖼️  Image paths have been fixed in cars-index.json');
