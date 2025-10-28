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

            if (!Array.isArray(this.contacts) || this.contacts.length === 0) {
                console.warn('⚠️ No contacts found in JSON, using fallback list');
                this.contacts = this.createFallbackContacts();
            }

            console.log(`📞 Loaded ${this.contacts.length} contacts`);
        } catch (error) {
            console.error('❌ Error loading contacts:', error);
            this.contacts = this.createFallbackContacts();
        }
    }

    createFallbackContacts() {
        return [
            { name: "Samuel Maina", whatsapp: "254712345678", role: "Sales Manager" },
            { name: "Elizabeth Wanjiku", whatsapp: "254723456789", role: "Sales Agent" },
            { name: "Klarie Mwangi", whatsapp: "254734567890", role: "Customer Support" },
            { name: "John Kamau", whatsapp: "254745678901", role: "Sales Agent" },
            { name: "Sarah Otieno", whatsapp: "254756789012", role: "Sales Agent" }
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

        if (!modal || !carInfo || !contactsList) {
            console.error('❌ Reserve modal elements missing');
            return;
        }

        // ✅ Car Info
        carInfo.innerHTML = `
            <div class="reserve-header">
                <h3>${this.selectedCar.title}</h3>
                <p><strong>${this.selectedCar.price}</strong></p>
                <p class="car-ref">Reference: ${this.selectedCar.slug}</p>
            </div>
        `;

        // ✅ Limit to 5 contacts
        const contactsToShow = this.contacts.slice(0, 5);
        contactsList.innerHTML = contactsToShow.map(contact => this.createContactCard(contact)).join('');

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    createContactCard(contact) {
        const cleanNumber = this.formatNumber(contact.whatsapp);
        return `
            <div class="contact-card">
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-role">${contact.role}</div>
                </div>
                <button class="whatsapp-btn" 
                    onclick="reserveManager.contactViaWhatsApp('${cleanNumber}', '${contact.name}')">
                    💬 Chat ${contact.name}
                </button>
            </div>
        `;
    }

    formatNumber(number) {
        // Normalize to Kenyan format (no + or spaces)
        return number.replace(/\D/g, '').replace(/^0/, '254');
    }

    contactViaWhatsApp(phoneNumber, contactName) {
        if (!this.selectedCar) return;

        const message = this.createReservationMessage(contactName);
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        this.showSuccessMessage(contactName);
        console.log(`📝 Reservation initiated for ${this.selectedCar.title} via ${contactName}`);
    }

    createReservationMessage(contactName) {
        const car = this.selectedCar;
        return `Hey MotorPride, I want to reserve… ${car.title}.

Vehicle Details:
• Brand: ${car.brand}
• Model: ${car.model}
• Year: ${car.year}
• Price: ${car.price}

Please contact me to proceed. (via ${contactName})`;
    }

    showSuccessMessage(contactName) {
        const modal = document.getElementById('reserve-modal');
        const existing = modal.querySelector('.success-message');
        if (existing) existing.remove();

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <strong>✅ WhatsApp opened!</strong><br>
            Message prepared for <b>${contactName}</b>.
        `;
        modal.querySelector('.contacts-section').prepend(successDiv);

        setTimeout(() => successDiv.remove(), 5000);
    }
}

// Add CSS animations
const reserveStyles = `
.success-message {
    background: #28a745;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 1rem;
    animation: fadeIn 0.4s ease-out;
}
.contact-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f7fa;
    border-radius: 10px;
    padding: 0.8rem 1rem;
    margin-bottom: 0.6rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.contact-name {
    font-weight: 600;
    color: #0A1F44;
}
.contact-role {
    font-size: 0.85rem;
    color: #555;
}
.whatsapp-btn {
    background: #25D366;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s;
}
.whatsapp-btn:hover {
    background: #1ebe5d;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${reserveStyles}</style>`);

// Initialize
const reserveManager = new ReserveManager();
window.reserveManager = reserveManager;
