const fs = require('fs');
const path = require('path');
const carsManager = require('./cars-manager');

class CarFilesTester {
    constructor() {
        this.testResults = [];
    }

    // Run all tests
    runAllTests() {
        console.log('🧪 Starting Car Files Tests...\n');
        
        this.testResults = [];
        
        this.testDataDirectories();
        this.testCarFiles();
        this.testContactFiles();
        this.testIndexFiles();
        this.testCarDataValidation();
        this.testImageReferences();
        
        this.generateReport();
    }

    // Test if data directories exist
    testDataDirectories() {
        console.log('📁 Testing Data Directories...');
        
        const requiredDirs = [
            '../data',
            '../data/cars',
            '../data/contacts',
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
                exists ? '' : `Directory missing: ${dir}`
            );
        });
    }

    // Test car JSON files
    testCarFiles() {
        console.log('🚗 Testing Car Files...');
        
        const carsPath = path.join(__dirname, '../data/cars');
        
        if (!fs.existsSync(carsPath)) {
            this.recordTest('Cars directory exists', false, 'Cars directory not found');
            return;
        }

        const files = fs.readdirSync(carsPath);
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        this.recordTest(
            'Car JSON files found',
            jsonFiles.length > 0,
            jsonFiles.length === 0 ? 'No car JSON files found' : `Found ${jsonFiles.length} car files`
        );

        // Test each car file
        jsonFiles.forEach(file => {
            const filePath = path.join(carsPath, file);
            this.testIndividualCarFile(filePath, file);
        });
    }

    // Test individual car file
    testIndividualCarFile(filePath, filename) {
        try {
            const carData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const slug = path.basename(filename, '.json');
            
            // Test required fields
            const requiredFields = ['title', 'brand', 'model', 'year', 'price', 'status'];
            const missingFields = requiredFields.filter(field => !carData[field]);
            
            this.recordTest(
                `Car file valid: ${slug}`,
                missingFields.length === 0,
                missingFields.length > 0 ? 
                    `Missing fields in ${slug}: ${missingFields.join(', ')}` : 
                    `${slug} - OK`
            );

            // Test data types
            if (carData.year && typeof carData.year !== 'number') {
                this.recordTest(
                    `Car year is number: ${slug}`,
                    false,
                    `Year should be number in ${slug}`
                );
            }

            // Test status values
            const validStatuses = ['available', 'sold', 'incoming'];
            if (carData.status && !validStatuses.includes(carData.status)) {
                this.recordTest(
                    `Valid status: ${slug}`,
                    false,
                    `Invalid status in ${slug}: ${carData.status}`
                );
            }

            // Test images array
            if (carData.images && !Array.isArray(carData.images)) {
                this.recordTest(
                    `Images is array: ${slug}`,
                    false,
                    `Images should be array in ${slug}`
                );
            }

        } catch (error) {
            this.recordTest(
                `Car file parseable: ${filename}`,
                false,
                `Cannot parse ${filename}: ${error.message}`
            );
        }
    }

    // Test contact files
    testContactFiles() {
        console.log('📞 Testing Contact Files...');
        
        const contactsPath = path.join(__dirname, '../data/contacts');
        
        if (!fs.existsSync(contactsPath)) {
            this.recordTest('Contacts directory exists', false, 'Contacts directory not found');
            return;
        }

        const files = fs.readdirSync(contactsPath);
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        this.recordTest(
            'Contact JSON files found',
            jsonFiles.length > 0,
            jsonFiles.length === 0 ? 'No contact JSON files found' : `Found ${jsonFiles.length} contact files`
        );

        // Test each contact file
        jsonFiles.forEach(file => {
            const filePath = path.join(contactsPath, file);
            this.testIndividualContactFile(filePath, file);
        });
    }

    // Test individual contact file
    testIndividualContactFile(filePath, filename) {
        try {
            const contactData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const slug = path.basename(filename, '.json');
            
            // Test required fields
            const requiredFields = ['name', 'phone', 'whatsapp', 'role'];
            const missingFields = requiredFields.filter(field => !contactData[field]);
            
            this.recordTest(
                `Contact file valid: ${slug}`,
                missingFields.length === 0,
                missingFields.length > 0 ? 
                    `Missing fields in ${slug}: ${missingFields.join(', ')}` : 
                    `${slug} - OK`
            );

            // Test phone format (basic)
            if (contactData.phone && !this.isValidPhone(contactData.phone)) {
                this.recordTest(
                    `Valid phone format: ${slug}`,
                    false,
                    `Phone format may be invalid in ${slug}: ${contactData.phone}`
                );
            }

        } catch (error) {
            this.recordTest(
                `Contact file parseable: ${filename}`,
                false,
                `Cannot parse ${filename}: ${error.message}`
            );
        }
    }

    // Test index files
    testIndexFiles() {
        console.log('📊 Testing Index Files...');
        
        const indexFiles = [
            '../data/cars-index.json',
            '../data/contacts-index.json'
        ];

        indexFiles.forEach(indexFile => {
            const fullPath = path.join(__dirname, indexFile);
            const exists = fs.existsSync(fullPath);
            
            this.recordTest(
                `Index file exists: ${indexFile}`,
                exists,
                exists ? '' : `Index file missing: ${indexFile}`
            );

            if (exists) {
                this.testIndexFileContent(fullPath, indexFile);
            }
        });
    }

    // Test index file content
    testIndexFileContent(filePath, filename) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            this.recordTest(
                `Index file valid JSON: ${filename}`,
                Array.isArray(data),
                Array.isArray(data) ? 
                    `${filename} has ${data.length} items` : 
                    `${filename} should contain an array`
            );

        } catch (error) {
            this.recordTest(
                `Index file parseable: ${filename}`,
                false,
                `Cannot parse ${filename}: ${error.message}`
            );
        }
    }

    // Test car data validation using cars-manager
    testCarDataValidation() {
        console.log('✅ Testing Car Data Validation...');
        
        const cars = carsManager.getAllCars();
        
        cars.forEach(car => {
            try {
                carsManager.validateCarData(car);
                this.recordTest(
                    `Car data valid: ${car.slug}`,
                    true,
                    `${car.slug} - Validation passed`
                );
            } catch (error) {
                this.recordTest(
                    `Car data valid: ${car.slug}`,
                    false,
                    `Validation failed for ${car.slug}: ${error.message}`
                );
            }
        });
    }

    // Test image references
    testImageReferences() {
        console.log('🖼️ Testing Image References...');
        
        const cars = carsManager.getAllCars();
        const imagesPath = path.join(__dirname, '../static/images/cars');
        
        cars.forEach(car => {
            if (car.images && Array.isArray(car.images)) {
                car.images.forEach((imagePath, index) => {
                    // Extract filename from path
                    const filename = path.basename(imagePath);
                    const fullImagePath = path.join(imagesPath, filename);
                    const exists = fs.existsSync(fullImagePath);
                    
                    this.recordTest(
                        `Image exists: ${filename} (${car.slug})`,
                        exists,
                        exists ? '' : `Missing image: ${filename} for car ${car.slug}`
                    );
                });
            }
        });
    }

    // Basic phone validation
    isValidPhone(phone) {
        // Basic international phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    // Record test result
    recordTest(name, passed, message) {
        this.testResults.push({
            name,
            passed,
            message: message || (passed ? 'OK' : 'Failed')
        });
    }

    // Generate test report
    generateReport() {
        console.log('\n📋 TEST REPORT');
        console.log('=' .repeat(50));
        
        const passed = this.testResults.filter(test => test.passed).length;
        const failed = this.testResults.filter(test => !test.passed).length;
        const total = this.testResults.length;

        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📊 Total: ${total}`);
        console.log(`🎯 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

        // Show failed tests
        if (failed > 0) {
            console.log('\n🚨 FAILED TESTS:');
            this.testResults
                .filter(test => !test.passed)
                .forEach(test => {
                    console.log(`   ❌ ${test.name}`);
                    console.log(`      ${test.message}`);
                });
        }

        // Show passed tests summary
        if (passed > 0) {
            console.log('\n✅ PASSED TESTS:');
            this.testResults
                .filter(test => test.passed)
                .slice(0, 10) // Show first 10 passed tests
                .forEach(test => {
                    console.log(`   ✅ ${test.name}`);
                });
            
            if (passed > 10) {
                console.log(`   ... and ${passed - 10} more passed tests`);
            }
        }

        console.log('\n' + '=' .repeat(50));
        
        if (failed === 0) {
            console.log('🎉 All tests passed! Your car files are ready.');
        } else {
            console.log('⚠️ Some tests failed. Please check the issues above.');
            process.exit(1); // Exit with error code
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new CarFilesTester();
    tester.runAllTests();
}

module.exports = CarFilesTester;
