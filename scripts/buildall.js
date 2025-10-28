const fs = require('fs');
const path = require('path');

console.log('🚀 EMERGENCY BUILD - Fixing Images & Data');

// Create directories
const dirs = ['content/cars', 'content/contacts', 'data', 'static/images/cars'];
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// FORCE CREATE cars data with working images
const carsData = [
  {
    slug: "mazda-cx5-2020",
    title: "Mazda CX-5 2020",
    brand: "Mazda",
    model: "CX-5",
    year: 2020,
    price: "KSh 3,450,000",
    status: "available",
    featured: true,
    description: "6-Speed Manual Petrol. Well-maintained with full service history.",
    features: ["6-Speed Manual", "Petrol", "Air Conditioning", "Power Steering"],
    images: ["https://via.placeholder.com/600x400/0066cc/ffffff?text=Mazda+CX-5"]
  },
  {
    slug: "toyota-axio-2020",
    title: "Toyota Axio 2020",
    brand: "Toyota", 
    model: "Axio",
    year: 2020,
    price: "KSh 2,000,000",
    status: "available",
    featured: false,
    description: "Smart and efficient vehicle perfect for city driving.",
    features: ["Automatic", "Fuel Efficient", "AC", "Bluetooth"],
    images: ["https://via.placeholder.com/600x400/28a745/ffffff?text=Toyota+Axio"]
  }
];

// FORCE CREATE contacts data
const contactsData = [
  {
    slug: "samuel-maina",
    name: "Samuel Maina",
    phone: "+254712345678",
    whatsapp: "+254712345678",
    email: "sam@motorpridekenya.com",
    role: "Sales Manager"
  },
  {
    slug: "elizabeth-wanjiku",
    name: "Elizabeth Wanjiku",
    phone: "+254723456789", 
    whatsapp: "+254723456789",
    email: "liz@motorpridekenya.com",
    role: "Sales Agent"
  },
  {
    slug: "klarie-mwangi",
    name: "Klarie Mwangi",
    phone: "+254734567890",
    whatsapp: "+254734567890",
    email: "klarie@motorpridekenya.com",
    role: "Customer Support"
  },
  {
    slug: "john-kamau", 
    name: "John Kamau",
    phone: "+254745678901",
    whatsapp: "+254745678901",
    email: "john@motorpridekenya.com",
    role: "Sales Agent"
  },
  {
    slug: "sarah-otieno",
    name: "Sarah Otieno",
    phone: "+254756789012",
    whatsapp: "+254756789012", 
    email: "sarah@motorpridekenya.com",
    role: "Sales Agent"
  }
];

// Write data files
fs.writeFileSync('./data/cars-index.json', JSON.stringify(carsData, null, 2));
fs.writeFileSync('./data/contacts-index.json', JSON.stringify(contactsData, null, 2));

console.log('✅ EMERGENCY DATA CREATED');
console.log('🚗 Cars:', carsData.length);
console.log('📞 Contacts:', contactsData.length);
console.log('🎯 Using placeholder images that WILL work');
