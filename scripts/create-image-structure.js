const fs = require('fs');
const path = require('path');

function createImageStructure() {
    const carsIndexPath = path.join(__dirname, '../data/cars-index.json');
    const imagesBaseDir = path.join(__dirname, '../static/images');
    
    try {
        if (!fs.existsSync(carsIndexPath)) {
            console.log('⚠️ Cars index not found. Run generatecarsindex.js first.');
            return;
        }

        const cars = JSON.parse(fs.readFileSync(carsIndexPath, 'utf8'));
        
        cars.forEach(car => {
            const carImageDir = path.join(imagesBaseDir, 'cars', car.car_id);
            const thumbnailsDir = path.join(carImageDir, 'thumbnails');
            const fullsizeDir = path.join(carImageDir, 'fullsize');
            
            // Create directories if they don't exist
            [carImageDir, thumbnailsDir, fullsizeDir].forEach(dir => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                    console.log(`📁 Created: ${path.relative(imagesBaseDir, dir)}`);
                }
            });

            // Create placeholder readme files
            const readmeContent = `# Images for ${car.car_id}\n\nUpload:\n- primary.jpg (600x400) - Main card image\n- fullsize/1.jpg, 2.jpg, etc. (1200x800) - Gallery images\n- thumbnails/1.jpg, 2.jpg, etc. (200x150) - Thumbnail images`;
            
            fs.writeFileSync(path.join(carImageDir, 'README.md'), readmeContent);
        });

        console.log(`✅ Created image directory structure for ${cars.length} cars`);
    } catch (error) {
        console.error('❌ Error creating image structure:', error.message);
    }
}

createImageStructure();
