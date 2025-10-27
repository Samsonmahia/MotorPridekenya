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
            const response = await fetch('/data/contacts-index.json');
            if (!response.ok) throw new Error('Failed to load contacts');
            
            this.contacts = await response.json();
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    openReserveModal() {
        this.selectedCar = carsDisplay.currentCar;
        if (!this.selectedCar) return;

        const modal = document.getElementById('reserve-modal');
        const carInfo = document.getElementById('selected-car-info');
        const contactsList = document.getElementById('contacts-list');

        // Update car info
        carInfo.innerHTML = `
            <h4>${this.selectedCar.title}</h4>
            <p><strong>Price:</strong> ${this.selectedCar.price}</p>
            <p><strong>Reference:</strong> ${this.selectedCar.slug}</p>
        `;

        // Render contacts
        contactsList.innerHTML = this.contacts.map(contact => 
            this.createContactCard(contact)
        ).join('');

        modal.style.display = 'block';
    }

    createContactCard(contact) {
        return `
            <div class="contact-card">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-role">${contact.role}</div>
                ${contact.phone ? `<p><small>📞 ${contact.phone}</small></p>` : ''}
                ${contact.email ? `<p><small>📧 ${contact.email}</small></p>` : ''}
                <button class="whatsapp-btn" onclick="reserveManager.contactViaWhatsApp('${contact.whatsapp}')">
                    💬 WhatsApp
                </button>
            </div>
        `;
    }

    contactViaWhatsApp(phoneNumber) {
        if (!this.selectedCar) return;

        const message = this.createReservationMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Track reservation attempt
        this.trackReservation(phoneNumber);
    }

    createReservationMessage() {
        const car = this.selectedCar;
        return `Hello! I am interested in reserving the following vehicle:

🚗 *${car.title}*
💰 Price: ${car.price}
📅 Year: ${car.year}
🔧 Status: ${car.status}

Please provide me with more details about this vehicle and the reservation process.

Thank you!`;
    }

    trackReservation(contactPhone) {
        // Here you can add analytics or tracking for reservations
        console.log(`Reservation initiated for ${this.selectedCar.title} via ${contactPhone}`);
        
        // Show success message
        this.showSuccessMessage();
    }

    showSuccessMessage() {
        // You can implement a toast notification here
        const modal = document.getElementById('reserve-modal');
        const existingMessage = modal.querySelector('.success-message');
        
        if (!existingMessage) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.cssText = `
                background: var(--success);
                color: white;
                padding: 1rem;
                border-radius: 5px;
                margin: 1rem 0;
                text-align: center;
                animation: bounceIn 0.6s ease-out;
            `;
            successDiv.textContent = '✅ WhatsApp opened! Please send the pre-filled message to contact our sales team.';
            
            const contactsSection = modal.querySelector('.contacts-section');
            contactsSection.parentNode.insertBefore(successDiv, contactsSection);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    }
}

// Initialize reserve manager
const reserveManager = new ReserveManager();