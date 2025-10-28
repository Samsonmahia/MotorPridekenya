const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Building MotorPride Kenya...');
console.log('📅 Build time:', new Date().toISOString());

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
  console.log('\n📊 Processing cars...');
  
  const carsDir = path.join(__dirname, '../content/cars');
  const outputFile = path.join(__dirname, '../data/cars-index.json');
  
  let cars = [];
  
  if (fs.existsSync(carsDir)) {
    const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} car files`);
    
    files.forEach(file => {
      try {
        const filePath = path.join(carsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]);
          const slug = path.basename(file, '.md');
          
          // FIX IMAGE PATHS - Ensure they start with /images/
          let images = [];
          if (frontmatter.images) {
            images = frontmatter.images.map(img => {
              if (img.startsWith('/images/')) {
                return img;
              } else if (img.startsWith('images/')) {
                return '/' + img;
              } else {
                return '/images/' + img;
              }
            });
          }
          
          // If no images, use placeholder
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
            images: images
          };
          
          cars.push(car);
          console.log(`✅ ${car.title} - ${images.length} images`);
        }
      } catch (error) {
        console.log(`⚠️ Error with ${file}:`, error.message);
      }
    });
  }
  
  // Sort: featured first, then by year
  cars.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year - a.year;
  });
  
  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`🎉 Saved ${cars.length} cars`);
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
          console.log(`✅ ${contact.name}`);
        }
      } catch (error) {
        console.log(`⚠️ Error with ${file}:`, error.message);
      }
    });
  }
  
  // Ensure we have at least 5 contacts for WhatsApp buttons
  while (contacts.length < 5) {
    contacts.push({
      slug: `contact-${contacts.length + 1}`,
      name: `Sales Agent ${contacts.length + 1}`,
      phone: '+254711223344',
      whatsapp: '+254711223344',
      email: `agent${contacts.length + 1}@motorpridekenya.com`,
      role: 'Sales Agent'
    });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
  console.log(`🎉 Saved ${contacts.length} contacts (5 required for WhatsApp)`);
}

// Run build
buildCarsIndex();
buildContactsIndex();

console.log('\n✅ BUILD COMPLETED!');
