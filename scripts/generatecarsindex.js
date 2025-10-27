const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateCarsIndex() {
    const carsDir = path.join(__dirname, '../content/cars');
    const outputFile = path.join(__dirname, '../data/cars-index.json');
    
    console.log('🚗 Generating cars index...');
    
    let cars = [];
    
    try {
        if (!fs.existsSync(carsDir)) {
            console.log('📁 Creating cars directory...');
            fs.mkdirSync(carsDir, { recursive: true });
        }
        
        const files = fs.readdirSync(carsDir);
        const mdFiles = files.filter(file => path.extname(file) === '.md');
        
        console.log(`📄 Found ${mdFiles.length} car files`);
        
        mdFiles.forEach(file => {
            const filePath = path.join(carsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
                // Parse frontmatter
                const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
                if (match) {
                    const frontmatter = yaml.load(match[1]);
                    const body = match[2].trim();
                    
                    // Add slug from filename
                    frontmatter.slug = path.basename(file, '.md');
                    
                    // Use body as description if no description in frontmatter
                    if (body && !frontmatter.description) {
                        frontmatter.description = body;
                    }
                    
                    // Ensure arrays are properly formatted
                    if (frontmatter.features && typeof frontmatter.features === 'string') {
                        frontmatter.features = frontmatter.features.split(',').map(f => f.trim());
                    }
                    
                    if (frontmatter.images && typeof frontmatter.images === 'string') {
                        frontmatter.images = [frontmatter.images];
                    }
                    
                    cars.push(frontmatter);
                    console.log(`✅ Processed: ${frontmatter.slug}`);
                }
            } catch (parseError) {
                console.error(`❌ Error parsing ${file}:`, parseError.message);
            }
        });
        
        // Sort cars: featured first, then by year (newest first)
        cars.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.year - a.year;
        });
        
        // Ensure data directory exists
        if (!fs.existsSync(path.dirname(outputFile))) {
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        }
        
        fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
        console.log(`✅ Generated cars index with ${cars.length} vehicles`);
        
    } catch (error) {
        console.error('❌ Error generating cars index:', error);
        // Write empty array as fallback
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

// Run if called directly
if (require.main === module) {
    generateCarsIndex();
}

module.exports = generateCarsIndex;