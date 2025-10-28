const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting MotorPride Kenya build process...\n');

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

// Run index generators
console.log('\n📊 Generating data indexes...');

exec('node scripts/generatecarsindex.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error generating cars index: ${error}`);
        return;
    }
    console.log(stdout);
});

exec('node scripts/generatecontactsindex.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error generating contacts index: ${error}`);
        return;
    }
    console.log(stdout);
});

console.log('\n✅ Build process completed!');
console.log('\n📝 Next steps:');
console.log('1. Add your car markdown files to content/cars/');
console.log('2. Add contact markdown files to content/contacts/');
console.log('3. Upload car images to static/images/cars/');
console.log('4. Run this build script again to update indexes');
console.log('5. Deploy to Netlify!');
