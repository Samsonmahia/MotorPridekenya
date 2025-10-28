const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateCarsIndex() {
    const carsDir = path.join(__dirname, '../content/cars');
    const outputFile = path.join(__dirname, '../data/cars-index.json');

    let cars = [];

    try {
        if (!fs.existsSync(carsDir)) {
            console.warn('⚠️ Cars directory not found. Creating empty cars index...');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }

        const files = fs.readdirSync(carsDir);

        files.forEach(file => {
            if (path.extname(file) === '.md') {
                const filePath = path.join(carsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const segments = content.split('---');

                if (segments.length < 2) {
                    console.warn(`⚠️ Skipping ${file}: No valid frontmatter`);
                    return;
                }

                try {
                    const frontmatter = yaml.load(segments[1]);

                    if (!frontmatter || typeof frontmatter !== 'object') {
                        console.warn(`⚠️ Skipping ${file}: Empty or invalid YAML`);
                        return;
                    }

                    // Add slug from filename
                    const carData = { slug: path.basename(file, '.md'), ...frontmatter };

                    // Normalize data fields
                    carData.features = Array.isArray(carData.features)
                        ? carData.features
                        : (carData.features ? carData.features.split(',').map(f => f.trim()) : []);

                    carData.images = Array.isArray(carData.images)
                        ? carData.images
                        : (carData.images ? [carData.images] : []);

                    // Default values if missing
                    carData.status = carData.status || 'available';
                    carData.price = carData.price || 'On Request';
                    carData.year = parseInt(carData.year) || 0;
                    carData.brand = carData.brand || 'Unknown';
                    carData.model = carData.model || carData.name || 'Unnamed Vehicle';

                    cars.push(carData);
                    console.log(`✅ Processed: ${carData.slug}`);
                } catch (parseError) {
                    console.error(`❌ Error parsing ${file}:`, parseError.message);
                }
            }
        });

        // Sort cars: featured first, then newest year
        cars.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.year - a.year;
        });

        fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
        console.log(`🚗 Generated cars index successfully with ${cars.length} entries → ${outputFile}`);
    } catch (error) {
        console.error('❌ Error generating cars index:', error.message);
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

generateCarsIndex();
