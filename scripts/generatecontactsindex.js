const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateContactsIndex() {
    const contactsDir = path.join(__dirname, '../content/contacts');
    const outputFile = path.join(__dirname, '../data/contacts-index.json');
    
    let contacts = [];
    
    try {
        if (!fs.existsSync(contactsDir)) {
            console.log('Contacts directory not found, creating empty index...');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }
        
        const files = fs.readdirSync(contactsDir);
        
        files.forEach(file => {
            if (path.extname(file) === '.md') {
                const filePath = path.join(contactsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                try {
                    const frontmatter = content.split('---')[1];
                    const contactData = yaml.load(frontmatter);
                    
                    // Add slug from filename
                    contactData.slug = path.basename(file, '.md');
                    contacts.push(contactData);
                } catch (parseError) {
                    console.error(`Error parsing ${file}:`, parseError);
                }
            }
        });
        
        fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
        console.log(`✅ Generated contacts index with ${contacts.length} contacts`);
        
    } catch (error) {
        console.error('❌ Error generating contacts index:', error);
        // Write empty array as fallback
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

generateContactsIndex();
