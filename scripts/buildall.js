const fs = require('fs');
const path = require('path');

console.log('🚀 QUICK BUILD - MotorPride Kenya');

// Create directories if they don't exist
const dirs = ['content/cars', 'content/contacts', 'data'];
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// SIMPLE TEST DATA - Always create this
const testCars = [
  {
    slug: "test-car-1",
    title: "Toyota Axio 2020",
    brand: "Toyota",
    model: "Axio",
    year: 2020,
    price: "KSh 1,200,000",
    status: "available",
    featured: true,
    description: "Test car to verify build is working",
    features: ["Automatic", "AC", "Power Steering"],
    images: ["/images/cars/sample.jpg"]
  },
  {
    slug: "test-car-2", 
    title: "Mazda CX-5 2020",
    brand: "Mazda",
    model: "CX-5",
    year: 2020,
    price: "KSh 3,450,000",
    status: "available",
    featured: false,
    description: "Another test car",
    features: ["6-Speed Manual", "Petrol"],
    images: ["/images/cars/sample.jpg"]
  }
];

const testContacts = [
  {
    slug: "contact-1",
    name: "Samuel Maina",
    phone: "+254712345678",
    whatsapp: "+254712345678",
    email: "sam@motorpridekenya.com",
    role: "Sales Manager"
  },
  {
    slug: "contact-2",
    name: "Elizabeth Wanjiku", 
    phone: "+254723456789",
    whatsapp: "+254723456789",
    email: "liz@motorpridekenya.com",
    role: "Sales Agent"
  }
];

// ALWAYS write fresh data
fs.writeFileSync('./data/cars-index.json', JSON.stringify(testCars, null, 2));
fs.writeFileSync('./data/contacts-index.json', JSON.stringify(testContacts, null, 2));

console.log('✅ FORCE CREATED: cars-index.json and contacts-index.json');
console.log('📊 Cars:', testCars.length);
console.log('📞 Contacts:', testContacts.length);
console.log('🎯 If cars show on your site, build works!');
