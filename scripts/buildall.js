const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Starting MotorPride Kenya Build Process...');

// Ensure required directories exist
const directories = [
    'content/cars',
    'content/contacts', 
    'data'
];

directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Function to process cars from CMS
function generateCarsIndex() {
    const carsDir = path.join(__dirname, '../content/cars');
    const outputFile = path.join(__dirname, '../data/cars-index.json');
    
    let cars = [];
    
    try {
        if (!fs.existsSync(carsDir)) {
            console.log('❌ Cars directory not found');
            return;
        }

        const files = fs.readdirSync(carsDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📄 Found ${mdFiles.length} car files in CMS`);

        mdFiles.forEach(file => {
            try {
                const filePath = path.join(carsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Parse frontmatter (between --- and ---)
                const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const frontmatter = yaml.load(frontmatterMatch[1]);
                    const slug = path.basename(file, '.md');
                    
                    // Add slug and ensure proper data structure
                    const carData = {
                        slug: slug,
                        title: frontmatter.title || '',
                        brand: frontmatter.brand || '',
                        model: frontmatter.model || '',
                        year: frontmatter.year || 2020,
                        price: frontmatter.price || '',
                        status: frontmatter.status || 'available',
                        featured: frontmatter.featured || false,
                        description: frontmatter.description || '',
                        features: Array.isArray(frontmatter.features) ? frontmatter.features : [],
                        images: Array.isArray(frontmatter.images) ? frontmatter.images : []
                    };
                    
                    cars.push(carData);
                    console.log(`✅ Processed: ${carData.title}`);
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        });

        // Sort cars: featured first, then by year
        cars.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.year - a.year;
        });

        fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
        console.log(`🎉 Generated cars index with ${cars.length} vehicles`);

    } catch (error) {
        console.error('❌ Error generating cars index:', error);
    }
}

// Function to process contacts from CMS
function generateContactsIndex() {
    const contactsDir = path.join(__dirname, '../content/contacts');
    const outputFile = path.join(__dirname, '../data/contacts-index.json');
    
    let contacts = [];
    
    try {
        if (!fs.existsSync(contactsDir)) {
            console.log('❌ Contacts directory not found');
            return;
        }

        const files = fs.readdirSync(contactsDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📄 Found ${mdFiles.length} contact files in CMS`);

        mdFiles.forEach(file => {
            try {
                const filePath = path.join(contactsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const frontmatter = yaml.load(frontmatterMatch[1]);
                    const slug = path.basename(file, '.md');
                    
                    const contactData = {
                        slug: slug,
                        name: frontmatter.name || '',
                        phone: frontmatter.phone || '',
                        whatsapp: frontmatter.whatsapp || '',
                        email: frontmatter.email || '',
                        role: frontmatter.role || ''
                    };
                    
                    contacts.push(contactData);
                    console.log(`✅ Processed: ${contactData.name}`);
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        });

        fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
        console.log(`🎉 Generated contacts index with ${contacts.length} contacts`);

    } catch (error) {
        console.error('❌ Error generating contacts index:', error);
    }
}

// Run the build process
console.log('\n📊 Processing CMS content...');
generateCarsIndex();
generateContactsIndex();

console.log('\n✅ Build completed! CMS content → Frontend data synchronized');
