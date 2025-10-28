const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Building from CMS .md files - FIXED IMAGE HANDLING');

function normalizeImagePath(imgPath) {
    if (!imgPath) return null;
    
    // Handle both strings and objects from CMS
    if (typeof imgPath === 'object' && imgPath.image) {
        imgPath = imgPath.image;
    }
    
    imgPath = imgPath.toString().trim();
    
    // Ensure path starts with /images/
    if (imgPath.startsWith('/images/')) {
        return imgPath;
    }
    
    if (!imgPath.includes('/')) {
        return `/images/${imgPath}`;
    }
    
    return `/images/${imgPath.replace(/^\/?images\//, '')}`;
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
            
            // ✅ FIXED: Handle ALL CMS image formats
            let images = [];
            
            if (frontmatter.images) {
                console.log('🖼️ Raw images data:', frontmatter.images);
                
                if (Array.isArray(frontmatter.images)) {
                    images = frontmatter.images.map(img => normalizeImagePath(img)).filter(img => img !== null);
                } else if (typeof frontmatter.images === 'object' && frontmatter.images.image) {
                    images = [normalizeImagePath(frontmatter.images.image)];
                } else if (typeof frontmatter.images === 'string') {
                    images = [normalizeImagePath(frontmatter.images)];
                }
            }
            
            // ✅ Check for single image field
            if (images.length === 0 && frontmatter.image) {
                console.log('📸 Found single image field:', frontmatter.image);
                images = [normalizeImagePath(frontmatter.image)];
            }
            
            // ✅ Remove duplicates and validate
            images = [...new Set(images)].filter(img => img && img.trim() !== '');
            
            // ✅ Final fallback
            if (images.length === 0) {
                console.log(`⚠️ No valid images found for ${frontmatter.title}, using placeholder`);
                images = ['/images/cars/car-placeholder.jpg'];
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
                primary_image: images[0],
                car_id: frontmatter.car_id || slug,
                contact_ref: frontmatter.contact_ref || 'default'
            };
            
            cars.push(car);
            console.log(`✅ Added: ${car.title} with ${car.images.length} images`);
            
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
    
    if (contacts.length === 0) {
        console.log('📝 Creating sample contacts for WhatsApp');
        contacts = [
            { slug: "samuel", name: "Samuel Maina", whatsapp: "+254712345678", role: "Sales Manager" },
            { slug: "elizabeth", name: "Elizabeth Wanjiku", whatsapp: "+254723456789", role: "Sales Agent" },
            { slug: "klarie", name: "Klarie Mwangi", whatsapp: "+254734567890", role: "Customer Support" }
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
