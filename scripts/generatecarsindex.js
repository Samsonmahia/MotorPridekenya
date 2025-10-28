const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Building from CMS .md files - FIXED IMAGE HANDLING');

// Ensure directories exist
const directories = ['content/cars', 'content/contacts', 'data', 'static/images/cars'];
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// ✅ NEW: Helper function to normalize image paths
function normalizeImagePath(imgPath) {
  if (!imgPath) return null;
  
  // Remove leading/trailing spaces
  imgPath = imgPath.toString().trim();
  
  // If already has /images/ prefix, return as is
  if (imgPath.startsWith('/images/')) {
    return imgPath;
  }
  
  // If it's just a filename, add /images/ prefix
  if (!imgPath.includes('/')) {
    return `/images/${imgPath}`;
  }
  
  // If it has a different path structure, ensure it starts with /images/
  return `/images/${imgPath.replace(/^\/?images\//, '')}`;
}

// ✅ NEW: Find existing images in static directory
function findExistingImages(slug, frontmatter) {
  const staticImagesDir = path.join(__dirname, '../static/images');
  const possiblePaths = [
    `cars/${slug}/primary.jpg`,
    `cars/${slug}/1.jpg`,
    `cars/${slug}.jpg`,
    `cars/${frontmatter.brand}/${frontmatter.model}.jpg`,
    `cars/placeholder.jpg`
  ];
  
  for (const imgPath of possiblePaths) {
    const fullPath = path.join(staticImagesDir, imgPath);
    if (fs.existsSync(fullPath)) {
      console.log(`   📍 Found existing image: /images/${imgPath}`);
      return [`/images/${imgPath}`];
    }
  }
  
  // Ultimate fallback
  return ['/images/cars/car-placeholder.jpg'];
}

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
      
      const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`❌ No frontmatter found in ${file}`);
        return;
      }

      const frontmatter = yaml.load(frontmatterMatch[1]);
      const slug = path.basename(file, '.md');
      
      console.log(`✅ Frontmatter extracted for: ${frontmatter.title || 'Untitled'}`);
      
      // ✅ FIXED: Properly handle ALL CMS image formats
      let images = [];
      
      if (frontmatter.images) {
        console.log('🖼️ Raw images data:', frontmatter.images);
        
        // Case 1: Array of objects [{image: "url"}, {image: "url"}]
        if (Array.isArray(frontmatter.images)) {
          images = frontmatter.images.map(img => {
            if (typeof img === 'object' && img.image) {
              return normalizeImagePath(img.image);
            }
            // Case 2: Array of strings ["url1", "url2"]
            else if (typeof img === 'string') {
              return normalizeImagePath(img);
            }
            return null;
          }).filter(img => img !== null);
        } 
        // Case 3: Single object {image: "url"}
        else if (typeof frontmatter.images === 'object' && frontmatter.images.image) {
          images = [normalizeImagePath(frontmatter.images.image)];
        }
        // Case 4: Single string "url"
        else if (typeof frontmatter.images === 'string') {
          images = [normalizeImagePath(frontmatter.images)];
        }
      }
      
      // ✅ Remove duplicates
      images = [...new Set(images)];
      
      // ✅ If no images, check for single image field (common CMS pattern)
      if (images.length === 0 && frontmatter.image) {
        console.log('📸 Found single image field:', frontmatter.image);
        images = [normalizeImagePath(frontmatter.image)];
      }
      
      // ✅ Final fallback - check static images directory
      if (images.length === 0) {
        console.log(`⚠️ No valid images found for ${frontmatter.title}`);
        images = findExistingImages(slug, frontmatter);
      }
      
      console.log(`🖼️ Final images for ${frontmatter.title}:`, images);
      
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
        images: images,
        // ✅ Add primary_image for frontend
        primary_image: images[0] || '/images/cars/car-placeholder.jpg',
        // ✅ Add car_id for image directory structure
        car_id: frontmatter.car_id || slug,
        // ✅ Add contact reference
        contact_ref: frontmatter.contact_ref || 'default'
      };
      
      cars.push(car);
      console.log(`✅ Added to JSON: ${car.title} with ${car.images.length} images`);
      
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

  fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
  console.log(`\n🎉 Generated cars-index.json with ${cars.length} vehicles`);
  
  // Log what was created
  cars.forEach(car => {
    console.log(`   🚗 ${car.title} - ${car.images.length} images: ${car.images[0]}`);
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
            role: frontmatter.role || 'Staff',
            // ✅ Add contact image
            image: frontmatter.image || `contacts/${slug}/profile.jpg`
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
      { slug: "samuel", name: "Samuel Maina", whatsapp: "+254712345678", role: "Sales Manager", image: "contacts/samuel/profile.jpg" },
      { slug: "elizabeth", name: "Elizabeth Wanjiku", whatsapp: "+254723456789", role: "Sales Agent", image: "contacts/elizabeth/profile.jpg" },
      { slug: "klarie", name: "Klarie Mwangi", whatsapp: "+254734567890", role: "Customer Support", image: "contacts/klarie/profile.jpg" },
      { slug: "john", name: "John Kamau", whatsapp: "+254745678901", role: "Sales Agent", image: "contacts/john/profile.jpg" },
      { slug: "sarah", name: "Sarah Otieno", whatsapp: "+254756789012", role: "Sales Agent", image: "contacts/sarah/profile.jpg" }
    ];
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
  console.log(`🎉 Generated contacts-index.json with ${contacts.length} contacts`);
}

// Run the build
processCarsFromMD();
processContactsFromMD();

console.log('\n✅ BUILD COMPLETED!');
console.log('🖼️  Images now properly handled from CMS format');
