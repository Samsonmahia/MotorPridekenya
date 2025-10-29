// Emergency fallback script if everything else fails
const fs = require('fs');
const path = require('path');

console.log('🆘 Running emergency fallback script...');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
fs.mkdirSync(dataDir, { recursive: true });

// Create a basic cars index
const fallbackCars = [
  {
    slug: "sample-car",
    title: "Sample Premium Vehicle",
    brand: "Toyota",
    model: "Sample Model",
    year: "2023",
    price: "KSh 2,500,000",
    status: "available",
    featured: true,
    description: "This is a sample vehicle. Your cars will appear here once the CMS is properly configured.",
    features: ["Automatic", "AC", "Bluetooth"],
    images: ["/images/car-placeholder.jpg"],
    primary_image: "/images/car-placeholder.jpg"
  }
];

fs.writeFileSync(path.join(dataDir, 'cars-index.json'), JSON.stringify(fallbackCars, null, 2));
console.log('✅ Emergency fallback cars-index.json created');

// Create contacts index
const fallbackContacts = [
  {
    name: "Sales Team",
    phone: "254712345678",
    whatsapp: "254712345678",
    email: "sales@motorpridekenya.com",
    role: "Sales Agent"
  }
];

fs.writeFileSync(path.join(dataDir, 'contacts-index.json'), JSON.stringify(fallbackContacts, null, 2));
console.log('✅ Emergency fallback contacts-index.json created');

console.log('🎉 Emergency setup complete!');
process.exit(0);
