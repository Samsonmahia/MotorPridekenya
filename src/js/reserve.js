class ReserveManager {
    constructor() {
        this.contacts = [];
        this.selectedCar = null;
        this.init();
    }

    async init() {
        await this.loadContacts();
    }

    async loadContacts() {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`/data/contacts-index.json?t=${timestamp}`);
            if (!response.ok) throw new Error('Failed to load contacts');
            
            this.contacts = await response.json();
            console.log(`📞 Loaded ${this.contacts.length} contacts`);
        } catch (error) {
            console.error('Error loading contacts:', error);
            // Create fallback contacts
            this.contacts = this.createFallbackContacts();
        }
    }

    createFallbackContacts() {
        return [
            { name: "Samuel Maina", whatsapp: "+254712345678", role: "Sales Manager" },
            { name: "Elizabeth Wanjiku", whatsapp: "+254723456789", role: "Sales Agent" },
            { name: "Klarie Mwangi", whatsapp: "+254734567890", role: "Customer Support" },
            { name: "John Kamau", whatsapp: "+254745678901", role: "Sales Agent" },
            { name: "Sarah Otieno", whatsapp: "+254756789012", role: "Sales Agent" }
        ];
    }

    openReserveModal() {
        this.selectedCar = window.carsDisplay?.currentCar;
        if (!this.selectedCar) {
            console.error('No car selected for reservation');
            return;
        }

        const modal = document.getElementById('reserve-modal');
        const carInfo = document.getElementById('selected-car-info');
        const contactsList = document.getElementById('contacts-list');

        // Update car info
        carInfo.innerHTML = `
            <div style="text-align: center;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--midnight-blue);">${this.selectedCar.title}</h4>
                <p style="margin: 0.2rem 0; font-size: 1.1rem; font-weight: bold; color: var(--electric-blue);">${this.selectedCar.price}</p>
                <p style="margin: 0.2rem 0; font-size: 0.9rem; color: var(--dark-gray);">Reference: ${this.selectedCar.slug}</p>
            </div>
        `;

        // Show exactly 5 contacts
        const contactsToShow = this.contacts.slice(0, 5);
        
        // Render contacts
        contactsList.innerHTML = contactsToShow.map(contact => 
            this.createContactCard(contact)
        ).join('');

        modal.style.display = 'block';
    }

    createContactCard(contact) {
        return `
            <div class="contact-card">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-role">${contact.role}</div>
                <button class="whatsapp-btn" onclick="reserveManager.contactViaWhatsApp('${contact.whatsapp}', '${contact.name}')">
                    💬 WhatsApp ${contact.name}
                </button>
            </div>
        `;
    }

    contactViaWhatsApp(phoneNumber, contactName) {
        if (!this.selectedCar) return;

        const message = this.createReservationMessage(contactName);
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        this.showSuccessMessage(contactName);
        
        // Track the reservation
        this.trackReservation(contactName);
    }

    createReservationMessage(contactName) {
        const car = this.selectedCar;
        return `Hey MotorPride, I want to reserve… ${car.title}

Vehicle Details:
• Model: ${car.brand} ${car.model}
• Year: ${car.year}
• Price: ${car.price}

Please contact me to proceed with the reservation. Thank you!`;
    }

    trackReservation(contactName) {
        console.log(`📝 Reservation initiated for ${this.selectedCar.title} via ${contactName}`);
    }

    showSuccessMessage(contactName) {
        const modal = document.getElementById('reserve-modal');
        const existingMessage = modal.querySelector('.success-message');
        
        if (!existingMessage) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.cssText = `
                background: var(--success);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
                text-align: center;
                animation: slideIn 0.5s ease-out;
            `;
            successDiv.innerHTML = `
                <strong>✅ WhatsApp opened!</strong>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">
                    Message prepared for ${contactName}. Please send it to proceed.
                </div>
            `;
            
            const contactsSection = modal.querySelector('.contacts-section');
            contactsSection.parentNode.insertBefore(successDiv, contactsSection);
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.style.animation = 'slideOut 0.3s ease-in';
                    setTimeout(() => successDiv.remove(), 300);
                }
            }, 5000);
        }
    }
}

// Add animation styles
const reserveStyles = `
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-20px); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = reserveStyles;
document.head.appendChild(styleSheet);

// Initialize
const reserveManager = new ReserveManager();
window.reserveManager = reserveManager;
