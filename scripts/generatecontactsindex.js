const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateContactsIndex() {
    const contactsDir = path.join(__dirname, '../content/contacts');
    const outputFile = path.join(__dirname, '../data/contacts-index.json');
    
    console.log('📞 Generating contacts index...');
    
    let contacts = [];
    
    try {
        if (!fs.existsSync(contactsDir)) {
            console.log('📁 Creating contacts directory...');
            fs.mkdirSync(contactsDir, { recursive: true });
        }
        
        const files = fs.readdirSync(contactsDir);
        const mdFiles = files.filter(file => path.extname(file) === '.md');
        
        console.log(`📄 Found ${mdFiles.length} contact files`);
        
        mdFiles.forEach(file => {
            const filePath = path.join(contactsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
                const match = content.match(/^---\n([\s\S]*?)\n---/);
                if (match) {
                    const frontmatter = yaml.load(match[1]);
                    
                    // Add slug from filename
                    frontmatter.slug = path.basename(file, '.md');
                    contacts.push(frontmatter);
                    
                    console.log(`✅ Processed: ${frontmatter.slug}`);
                }
            } catch (parseError) {
                console.error(`❌ Error parsing ${file}:`, parseError.message);
            }
        });
        
        // Ensure data directory exists
        if (!fs.existsSync(path.dirname(outputFile))) {
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        }
        
        fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
        console.log(`✅ Generated contacts index with ${contacts.length} contacts`);
        
    } catch (error) {
        console.error('❌ Error generating contacts index:', error);
        // Write empty array as fallback
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

// Run if called directly
if (require.main === module) {
    generateContactsIndex();
}

module.exports = generateContactsIndex;