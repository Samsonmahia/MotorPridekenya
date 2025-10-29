const fs = require('fs');
const path = require('path');

console.log('🆘 Creating emergency JSON files...');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
fs.mkdirSync(dataDir, { recursive: true });

// Create a valid cars-index.json with sample data
const sampleCars = [
  {
    "slug": "toyota-corolla",
    "title": "Toyota Corolla 2023",
    "brand": "Toyota", 
    "model": "Corolla",
    "year": 2023,
    "price": "KSh 2,800,000",
    "status": "available",
    "featured": true,
    "description": "Brand new Toyota Corolla with excellent fuel efficiency.",
    "features": ["Automatic", "AC", "Bluetooth", "Backup Camera"],
    "images": ["/images/car-placeholder.jpg"],
    "primary_image": "/images/car-placeholder.jpg"
  },
  {
    "slug": "honda-civic", 
    "title": "Honda Civic 2022",
    "brand": "Honda",
    "model": "Civic",
    "year": 2022,
    "price": "KSh 2,500,000",
    "status": "available",
    "featured": false,
    "description": "Well maintained Honda Civic with low mileage.",
    "features": ["Automatic", "Sunroof", "Leather Seats"],
    "images": ["/images/car-placeholder.jpg"],
    "primary_image": "/images/car-placeholder.jpg"
  }
];

fs.writeFileSync(path.join(dataDir, 'cars-index.json'), JSON.stringify(sampleCars, null, 2));
console.log('✅ cars-index.json created with sample data');

// Create contacts index
const sampleContacts = [
  {
    "name": "Samuel Maina",
    "phone": "254712345678", 
    "whatsapp": "254712345678",
    "email": "samuel@motorpridekenya.com",
    "role": "Sales Manager"
  },
  {
    "name": "Elizabeth Wanjiku",
    "phone": "254723456789",
    "whatsapp": "254723456789", 
    "email": "elizabeth@motorpridekenya.com",
    "role": "Sales Agent"
  }
];

fs.writeFileSync(path.join(dataDir, 'contacts-index.json'), JSON.stringify(sampleContacts, null, 2));
console.log('✅ contacts-index.json created with sample data');

console.log('🎉 All JSON files created successfully!');
