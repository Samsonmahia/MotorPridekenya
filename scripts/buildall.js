const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 FORCE BUILD - MotorPride Kenya');
console.log('📅 Build time:', new Date().toISOString());

// Ensure directories exist
const directories = ['content/cars', 'content/contacts', 'data'];
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// SIMPLE CAR PROCESSING - NO COMPLEX PARSING
function buildCarsIndex() {
  console.log('\n📊 Processing cars...');
  
  const carsDir = path.join(__dirname, '../content/cars');
  const outputFile = path.join(__dirname, '../data/cars-index.json');
  
  let cars = [];
  
  // Check if content directory exists
  if (!fs.existsSync(carsDir)) {
    console.log('❌ content/cars folder not found');
  } else {
    // Read all markdown files
    const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));
    console.log(`📄 Found ${files.length} car files`);
    
    files.forEach(file => {
      try {
        const filePath = path.join(carsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // SIMPLE FRONTMATTER EXTRACTION
        const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]);
          const slug = path.basename(file, '.md');
          
          // Create car object
          const car = {
            slug: slug,
            title: frontmatter.title || 'No Title',
            brand: frontmatter.brand || 'Unknown',
            model: frontmatter.model || 'Unknown',
            year: frontmatter.year || 2024,
            price: frontmatter.price || 'KSh 0',
            status: frontmatter.status || 'available',
            featured: frontmatter.featured || false,
            description: frontmatter.description || '',
            features: Array.isArray(frontmatter.features) ? frontmatter.features : [],
            images: Array.isArray(frontmatter.images) ? frontmatter.images : ['/images/cars/sample.jpg']
          };
          
          cars.push(car);
          console.log(`✅ Added: ${car.title}`);
        }
      } catch (error) {
        console.log(`⚠️ Skipped ${file}: ${error.message}`);
      }
    });
  }
  
  // If no cars, create sample data
  if (cars.length === 0) {
    console.log('📝 Creating sample car data');
    cars = [{
      slug: "sample-car",
      title: "TEST CAR - Build is working!",
      brand: "MotorPride",
      model: "Test Model", 
      year: 2024,
      price: "KSh 999,999",
      status: "available",
      featured: true,
      description: "If you see this car, your build process is working! Now add real cars through CMS.",
      features: ["Test Feature 1", "Test Feature 2"],
      images: ["/images/cars/sample.jpg"]
    }];
  }
  
  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`🎉 Saved ${cars.length} cars to data/cars-index.json`);
}

// SIMPLE CONTACTS PROCESSING
function buildContactsIndex() {
  console.log('\n📞 Processing contacts...');
  
  const contactsDir = path.join(__dirname, '../content/contacts');
  const outputFile = path.join(__dirname, '../data/contacts-index.json');
  
  let contacts = [];
  
  if (!fs.existsSync(contactsDir)) {
    console.log('❌ content/contacts folder not found');
  } else {
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
            email: frontmatter.email || 'email@example.com',
            role: frontmatter.role || 'Staff'
          };
          
          contacts.push(contact);
          console.log(`✅ Added: ${contact.name}`);
        }
      } catch (error) {
        console.log(`⚠️ Skipped ${file}: ${error.message}`);
      }
    });
  }
  
  // If no contacts, create sample data
  if (contacts.length === 0) {
    console.log('📝 Creating sample contact data');
    contacts = [{
      slug: "sample-contact",
      name: "Test Contact - Build Working!",
      phone: "+254711223344",
      whatsapp: "+254711223344", 
      email: "test@motorpridekenya.com",
      role: "Sales Manager"
    }];
  }
  
  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
  console.log(`🎉 Saved ${contacts.length} contacts to data/contacts-index.json`);
}

// Run build
buildCarsIndex();
buildContactsIndex();

console.log('\n✅ BUILD COMPLETED SUCCESSFULLY!');
console.log('🚀 Your site should now show the latest data');
