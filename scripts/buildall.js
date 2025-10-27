const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

console.log('🚀 Starting MotorPride Kenya Build Process...');
console.log('📅 Build time:', new Date().toISOString());

// Ensure required directories exist
const directories = [
    'content/cars',
    'content/contacts', 
    'data',
    'static/images/cars'
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
            console.log('❌ Cars directory not found - creating sample');
            // Create sample data if no content
            const sampleCars = [{
                slug: "sample-car",
                title: "Add cars through CMS",
                brand: "MotorPride",
                model: "Sample",
                year: 2024,
                price: "KSh 0",
                status: "available",
                featured: false,
                description: "Use the CMS dashboard to add your vehicles",
                features: ["Add features in CMS"],
                images: ["/images/cars/sample-car.jpg"]
            }];
            
            fs.writeFileSync(outputFile, JSON.stringify(sampleCars, null, 2));
            console.log('✅ Created sample cars data');
            return;
        }

        const files = fs.readdirSync(carsDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📄 Found ${mdFiles.length} car files in CMS`);

        if (mdFiles.length === 0) {
            console.log('ℹ️ No car files found in CMS - creating sample');
            const sampleCars = [{
                slug: "sample-car",
                title: "Add cars through CMS",
                brand: "MotorPride", 
                model: "Sample",
                year: 2024,
                price: "KSh 0",
                status: "available",
                featured: false,
                description: "Use the CMS dashboard to add your vehicles",
                features: ["Add features in CMS"],
                images: ["/images/cars/sample-car.jpg"]
            }];
            
            fs.writeFileSync(outputFile, JSON.stringify(sampleCars, null, 2));
            return;
        }

        mdFiles.forEach(file => {
            try {
                const filePath = path.join(carsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Parse frontmatter (content between --- markers)
                const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const frontmatter = yaml.load(frontmatterMatch[1]);
                    const slug = path.basename(file, '.md');
                    
                    // Create car data with proper structure
                    const carData = {
                        slug: slug,
                        title: frontmatter.title || 'Untitled Car',
                        brand: frontmatter.brand || 'Unknown',
                        model: frontmatter.model || 'Unknown',
                        year: frontmatter.year || 2024,
                        price: frontmatter.price || 'KSh 0',
                        status: frontmatter.status || 'available',
                        featured: frontmatter.featured || false,
                        description: frontmatter.description || '',
                        features: Array.isArray(frontmatter.features) ? frontmatter.features : [],
                        images: Array.isArray(frontmatter.images) ? frontmatter.images : []
                    };
                    
                    cars.push(carData);
                    console.log(`✅ Processed: ${carData.title}`);
                } else {
                    console.log(`❌ No frontmatter found in: ${file}`);
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

        // Write to file
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
            console.log('❌ Contacts directory not found - creating sample');
            const sampleContacts = [{
                slug: "sample-contact",
                name: "Add contacts through CMS",
                phone: "+254700000000",
                whatsapp: "+254700000000", 
                email: "contact@example.com",
                role: "Sales Agent"
            }];
            
            fs.writeFileSync(outputFile, JSON.stringify(sampleContacts, null, 2));
            console.log('✅ Created sample contacts data');
            return;
        }

        const files = fs.readdirSync(contactsDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        console.log(`📄 Found ${mdFiles.length} contact files in CMS`);

        if (mdFiles.length === 0) {
            console.log('ℹ️ No contact files found in CMS - creating sample');
            const sampleContacts = [{
                slug: "sample-contact",
                name: "Add contacts through CMS",
                phone: "+254700000000",
                whatsapp: "+254700000000",
                email: "contact@example.com",
                role: "Sales Agent"
            }];
            
            fs.writeFileSync(outputFile, JSON.stringify(sampleContacts, null, 2));
            return;
        }

        mdFiles.forEach(file => {
            try {
                const filePath = path.join(contactsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
                if (frontmatterMatch) {
                    const frontmatter = yaml.load(frontmatterMatch[1]);
                    const slug = path.basename(file, '.md');
                    
                    const contactData = {
                        slug: slug,
                        name: frontmatter.name || 'Unknown',
                        phone: frontmatter.phone || '',
                        whatsapp: frontmatter.whatsapp || '',
                        email: frontmatter.email || '',
                        role: frontmatter.role || 'Sales Agent'
                    };
                    
                    contacts.push(contactData);
                    console.log(`✅ Processed: ${contactData.name}`);
                }
            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        });

        // Write to file
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
console.log('🕒 Build finished at:', new Date().toISOString());
