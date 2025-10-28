const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function generateContactsIndex() {
    const contactsDir = path.join(__dirname, '../content/contacts');
    const outputFile = path.join(__dirname, '../data/contacts-index.json');
    
    let contacts = [];

    try {
        if (!fs.existsSync(contactsDir)) {
            console.warn('⚠️ Contacts directory not found. Creating empty contacts index...');
            fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
            return;
        }

        const files = fs.readdirSync(contactsDir);

        files.forEach(file => {
            if (path.extname(file) === '.md') {
                const filePath = path.join(contactsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const segments = content.split('---');

                if (segments.length < 2) {
                    console.warn(`⚠️ Skipping ${file}: Missing valid frontmatter`);
                    return;
                }

                try {
                    const frontmatter = yaml.load(segments[1]);

                    if (!frontmatter || typeof frontmatter !== 'object') {
                        console.warn(`⚠️ Skipping ${file}: Empty or invalid YAML`);
                        return;
                    }

                    // Add slug based on filename
                    const contact = {
                        slug: path.basename(file, '.md'),
                        name: frontmatter.name || 'Unnamed Contact',
                        phone: frontmatter.phone || '',
                        role: frontmatter.role || 'Sales',
                        whatsapp: frontmatter.whatsapp || '',
                        featured: frontmatter.featured || false
                    };

                    contacts.push(contact);
                    console.log(`✅ Processed contact: ${contact.name}`);
                } catch (parseError) {
                    console.error(`❌ Error parsing ${file}:`, parseError.message);
                }
            }
        });

        // Sort featured contacts first
        contacts.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));

        fs.writeFileSync(outputFile, JSON.stringify(contacts, null, 2));
        console.log(`📇 Generated contacts index successfully with ${contacts.length} entries → ${outputFile}`);
    } catch (error) {
        console.error('❌ Error generating contacts index:', error.message);
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    }
}

generateContactsIndex();
