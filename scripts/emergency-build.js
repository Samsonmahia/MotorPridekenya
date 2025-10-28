const fs = require('fs');

console.log('🚨 EMERGENCY BUILD - Creating test data');

const testData = {
  cars: [{
    slug: "emergency-test",
    title: "🚨 EMERGENCY TEST CAR - DELETE ME",
    brand: "Test",
    model: "Emergency",
    year: 2024, 
    price: "KSh 1",
    status: "available",
    featured: true,
    description: "This is an emergency test. If you see this, the build works but CMS content isn't being processed.",
    features: ["Emergency Feature"],
    images: ["/images/cars/sample.jpg"]
  }],
  contacts: [{
    slug: "emergency-contact",
    name: "Emergency Contact",
    phone: "+254711223344",
    whatsapp: "+254711223344",
    email: "emergency@test.com",
    role: "Test Role"
  }]
};

fs.writeFileSync('./data/cars-index.json', JSON.stringify(testData.cars, null, 2));
fs.writeFileSync('./data/contacts-index.json', JSON.stringify(testData.contacts, null, 2));

console.log('✅ Emergency data created');
console.log('🔍 Check your live site for "EMERGENCY TEST CAR"');
