const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateCarsIndex() {
    const carsDir = path.join(__dirname, '../content/cars');
    const outputDir = path.join(__dirname, '../data');
    const outputFile = path.join(outputDir, 'cars-index.json');

    let cars = [];

    try {
        // Ensure /data folder exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log('📁 Created data directory');
        }

        if (!fs.existsSync(carsDir)) {
            console.warn('⚠️ Cars directory not found. Creating empty cars index...');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }

        const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.md'));

        if (files.length === 0) {
            console.warn('⚠️ No markdown files found in cars directory.');
        }

        files.forEach(file => {
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

                const carData = { slug: path.basename(file, '.md'), ...frontmatter };

                // Normalize data
                carData.features = Array.isArray(carData.features)
                    ? carData.features
                    : (carData.features ? carData.features.split(',').map(f => f.trim()) : []);

                carData.images = Array.isArray(carData.images)
                    ? carData.images
                    : (carData.images ? [carData.images] : []);

                if (carData.images.length === 0) {
                    carData.images = ["https://via.placeholder.com/600x400/cccccc/000000?text=MotorPride+Car"];
                }

                // Defaults
                carData.status = carData.status || 'available';
                carData.price = carData.price || 'On Request';
                carData.year = parseInt(carData.year) || 0;
                carData.brand = carData.brand || 'Unknown';
                carData.model = carData.model || carData.name || 'Unnamed Vehicle';
                carData.description = carData.description || 'No description available.';
                carData.featured = !!carData.featured;

                cars.push(carData);
                console.log(`✅ Processed: ${carData.slug}`);
            } catch (parseError) {
                console.error(`❌ Error parsing ${file}:`, parseError.message);
            }
        });

        // Sort order: featured first → available → newest year
        cars.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            if (a.status === 'available' && b.status !== 'available') return -1;
            if (b.status === 'available' && a.status !== 'available') return 1;
            return b.year - a.year;
        });

        fs.writeFileSync(outputFile, JSON.stringify(cars, null, 2));
        console.log(`🚗 Successfully generated cars index with ${cars.length} entries → ${outputFile}`);
    } catch (error) {
        console.error('❌ Error generating cars index:', error.message);
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

generateCarsIndex();
