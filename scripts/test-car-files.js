const fs = require('fs');
const path = require('path');
let carsManager;

try {
    carsManager = require('./cars-manager');
} catch (error) {
    console.warn('⚠️ cars-manager not found, skipping advanced validation.');
    carsManager = {
        getAllCars: () => [],
        validateCarData: () => {}
    };
}

class CarFilesTester {
    constructor() {
        this.testResults = [];
    }

    runAllTests() {
        console.log('\n🧪 Starting Comprehensive Car Files Tests...\n');

        this.testResults = [];

        this.testDataDirectories();
        this.testCarFiles();
        this.testContactFiles();
        this.testIndexFiles();
        this.testCarDataValidation();
        this.testImageReferences();

        this.generateReport();
    }

    // ========== DIRECTORY TEST ==========
    testDataDirectories() {
        console.log('📁 Checking Data Directories...');
        const requiredDirs = [
            '../data',
            '../content/cars',
            '../content/contacts',
            '../static/images/cars'
        ];

        requiredDirs.forEach(dir => {
            const fullPath = path.join(__dirname, dir);
            const exists = fs.existsSync(fullPath);
            this.recordTest(
                `Directory exists: ${dir}`,
                exists,
                exists ? '' : `⚠️ Missing: ${dir}`
            );
        });
    }

    // ========== CAR FILE TEST ==========
    testCarFiles() {
        console.log('\n🚗 Checking Car JSON Files...');
        const carsDir = path.join(__dirname, '../data');

        if (!fs.existsSync(path.join(carsDir, 'cars-index.json'))) {
            this.recordTest('Cars index file found', false, 'cars-index.json not found');
            return;
        }

        try {
            const cars = JSON.parse(fs.readFileSync(path.join(carsDir, 'cars-index.json')));
            this.recordTest('cars-index.json valid JSON', Array.isArray(cars));

            cars.forEach(car => {
                const requiredFields = ['title', 'brand', 'model', 'year', 'price', 'status'];
                const missingFields = requiredFields.filter(f => !car[f]);
                const slug = car.slug || car.title || 'unknown';

                this.recordTest(
                    `Car data valid: ${slug}`,
                    missingFields.length === 0,
                    missingFields.length
                        ? `Missing fields in ${slug}: ${missingFields.join(', ')}`
                        : 'OK'
                );
            });
        } catch (err) {
            this.recordTest('cars-index.json parseable', false, err.message);
        }
    }

    // ========== CONTACT FILE TEST ==========
    testContactFiles() {
        console.log('\n📞 Checking Contact JSON Files...');
        const contactsFile = path.join(__dirname, '../data/contacts-index.json');

        if (!fs.existsSync(contactsFile)) {
            this.recordTest('contacts-index.json exists', false, 'contacts-index.json not found');
            return;
        }

        try {
            const contacts = JSON.parse(fs.readFileSync(contactsFile));
            this.recordTest('contacts-index.json valid JSON', Array.isArray(contacts));

            contacts.forEach(c => {
                const requiredFields = ['name', 'whatsapp', 'role'];
                const missing = requiredFields.filter(f => !c[f]);
                this.recordTest(
                    `Contact data valid: ${c.slug || c.name}`,
                    missing.length === 0,
                    missing.length
                        ? `Missing fields in ${c.name}: ${missing.join(', ')}`
                        : 'OK'
                );
            });
        } catch (error) {
            this.recordTest('contacts-index.json parseable', false, error.message);
        }
    }

    // ========== INDEX FILE TEST ==========
    testIndexFiles() {
        console.log('\n📊 Checking Index Files...');
        const indexFiles = ['../data/cars-index.json', '../data/contacts-index.json'];

        indexFiles.forEach(file => {
            const fullPath = path.join(__dirname, file);
            const exists = fs.existsSync(fullPath);
            this.recordTest(`Index exists: ${file}`, exists, exists ? '' : `Missing ${file}`);
        });
    }

    // ========== VALIDATION ==========
    testCarDataValidation() {
        console.log('\n✅ Validating Car Data Structure...');
        const cars = carsManager.getAllCars();

        cars.forEach(car => {
            try {
                carsManager.validateCarData(car);
                this.recordTest(`Car validation: ${car.slug}`, true, 'OK');
            } catch (error) {
                this.recordTest(`Car validation: ${car.slug}`, false, error.message);
            }
        });
    }

    // ========== IMAGE REFERENCE TEST ==========
    testImageReferences() {
        console.log('\n🖼️ Checking Image References...');
        const carsFile = path.join(__dirname, '../data/cars-index.json');

        if (!fs.existsSync(carsFile)) return;

        const cars = JSON.parse(fs.readFileSync(carsFile));
        const staticDir = path.join(__dirname, '../static/images/cars');

        cars.forEach(car => {
            if (!Array.isArray(car.images)) return;
            car.images.forEach(img => {
                if (!img.startsWith('http')) {
                    const filename = path.basename(img);
                    const imgPath = path.join(staticDir, filename);
                    const exists = fs.existsSync(imgPath);
                    this.recordTest(
                        `Image exists: ${filename} (${car.slug})`,
                        exists,
                        exists ? '' : `⚠️ Missing: ${filename}`
                    );
                }
            });
        });
    }

    // ========== HELPERS ==========
    recordTest(name, passed, message) {
        this.testResults.push({
            name,
            passed,
            message: message || (passed ? 'OK' : 'Failed')
        });
    }

    generateReport() {
        console.log('\n📋 TEST REPORT');
        console.log('='.repeat(50));

        const passed = this.testResults.filter(t => t.passed).length;
        const failed = this.testResults.filter(t => !t.passed).length;
        const total = this.testResults.length;

        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📊 Total: ${total}`);
        console.log(`🎯 Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

        if (failed > 0) {
            console.log('🚨 FAILED TESTS:');
            this.testResults
                .filter(t => !t.passed)
                .forEach(t => console.log(`❌ ${t.name}\n   ↳ ${t.message}`));
        } else {
            console.log('🎉 All tests passed perfectly!');
        }

        console.log('='.repeat(50));
    }
}

// Run directly
if (require.main === module) {
    const tester = new CarFilesTester();
    tester.runAllTests();
}

module.exports = CarFilesTester;
