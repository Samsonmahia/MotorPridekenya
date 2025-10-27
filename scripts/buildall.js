const fs = require('fs');
const path = require('path');

console.log('🚀 Starting MotorPride Kenya Build Process...\n');

// Import generators
const generateCarsIndex = require('./generatecarsindex');
const generateContactsIndex = require('./generatecontactsindex');

// Ensure required directories exist
const directories = [
    'content/cars',
    'content/contacts', 
    'data',
    'src/css',
    'src/js',
    'static/images/cars'
];

directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Run generators
console.log('\n📊 Generating data indexes...');
generateCarsIndex();
generateContactsIndex();

console.log('\n✅ Build process completed!');
console.log('\n🎯 Next Steps:');
console.log('1. Visit /admin to add cars and contacts through CMS');
console.log('2. Run this build script after adding content');
console.log('3. Deploy to Netlify for live updates');