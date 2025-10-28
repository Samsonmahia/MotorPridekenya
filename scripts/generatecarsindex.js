const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateCarsIndex() {
    const carsDir = path.join(__dirname, '../content/cars');
    const outputFile = path.join(__dirname, '../data/cars-index.json');
    
    let cars = [];
    
    try {
        if (!fs.existsSync(carsDir)) {
            console.log('Cars directory not found, creating empty index...');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }
        
        const files = fs.readdirSync(carsDir);
        
        files.forEach(file => {
            if (path.extname(file) === '.md') {
                const filePath = path.join(carsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                try {
                    const frontmatter = content.split('---')[1];
                    const carData = yaml.load(frontmatter);
                    
                    // Add slug from filename
                    carData.slug = path.basename(file, '.md');
                    
                    // Ensure arrays are properly formatted
                    if (carData.features && typeof carData.features === 'string') {
                        carData.features = carData.features.split(',').map(f => f.trim());
                    }
                    
                    if (carData.images && typeof carData.images === 'string') {
                        carData.images = [carData.images];
                    }
                    
                    cars.push(carData);
                } catch (parseError) {
                    console.error(`Error parsing ${file}:`, parseError);
                }
            }
        });
        
        // Sort cars: featured first, then by year (newest first)
        cars.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.year - a.year;
        });
        
        fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
        console.log(`✅ Generated cars index with ${cars.length} vehicles`);
        
    } catch (error) {
        console.error('❌ Error generating cars index:', error);
        // Write empty array as fallback
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

generateCarsIndex();
