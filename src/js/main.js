// FIXED CARS DISPLAY - PROPER IMAGE HANDLING
class CarsDisplay {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentCar = null;
        console.log('🚗 CarsDisplay initialized - PROPER IMAGE HANDLING');
        this.init();
    }

    async init() {
        await this.loadCars();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            console.log('📡 Loading cars data with proper image handling...');
            
            // Force no cache
            const timestamp = new Date().getTime();
            const response = await fetch(`/data/cars-index.json?t=${timestamp}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 Raw data received:', data);
            
            if (!Array.isArray(data)) {
                throw new Error('Data is not an array');
            }
            
            this.cars = data;
            this.filteredCars = [...data];
            
            console.log(`✅ Successfully loaded ${this.cars.length} vehicles`);
            console.log('🖼️  First car image check:', {
                title: this.cars[0]?.title,
                primary_image: this.cars[0]?.primary_image,
                images: this.cars[0]?.images
            });
            
            this.hideLoading();
            this.renderCars();
            
        } catch (error) {
            console.error('❌ Error loading cars:', error);
            this.showError(`Failed to load vehicles: ${error.message}`);
        }
    }

    hideLoading() {
        const loadingElement = document.querySelector('.loading-spinner');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    renderCars() {
        const grid = document.getElementById('cars-grid');
        
        if (!grid) {
            console.error('❌ cars-grid element not found!');
            return;
        }

        if (this.filteredCars.length === 0) {
            grid.innerHTML = `
                <div class="no-cars" style="text-align: center; padding: 3rem;">
                    <h3>No vehicles found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            `;
            return;
        }

        console.log(`🎨 Rendering ${this.filteredCars.length} cars with primary images...`);
        
        grid.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
        
        console.log('✅ Cars rendered with proper image handling');
    }

    createCarCard(car) {
        const statusClass = `status-${car.status}`;
        const featuredClass = car.featured ? 'featured' : '';
        
        // ✅ CRITICAL FIX: Handle all image scenarios
        let imageUrl = '/images/cars/car-placeholder.jpg';
        
        if (car.primary_image) {
            imageUrl = car.primary_image;
        } else if (car.images && car.images.length > 0) {
            imageUrl = car.images[0];
        }
        
        // Ensure the URL is properly formatted
        if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
            imageUrl = '/images/' + imageUrl;
        }
        
        console.log(`🖼️  Car ${car.title} image: ${imageUrl}`);
        
        return `
            <div class="car-card ${featuredClass}" data-car-id="${car.slug}">
                <div class="car-image">
                    <img src="${imageUrl}" 
                         alt="${car.title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='/images/cars/car-placeholder.jpg';">
                    <div class="status-badge ${statusClass}">
                        ${car.status.toUpperCase()}
                    </div>
                </div>
                <div class="car-info">
                    <h3 class="car-title">${car.title}</h3>
                    <div class="car-meta">
                        <span>${car.brand} • ${car.model}</span>
                        <span>${car.year}</span>
                    </div>
                    <div class="car-price">${car.price}</div>
                    ${car.features && car.features.length > 0 ? `
                        <div class="car-features">
                            ${car.features.slice(0, 3).map(feature => 
                                `<span class="feature-tag">${feature}</span>`
                            ).join('')}
                            ${car.features.length > 3 ? 
                                `<span class="feature-tag">+${car.features.length - 3} more</span>` : ''
                            }
                        </div>
                    ` : ''}
                    <button class="view-details-btn" onclick="carsDisplay.openCarDetail('${car.slug}')">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    openCarDetail(carSlug) {
        this.currentCar = this.cars.find(car => car.slug === carSlug);
        if (!this.currentCar) return;

        const modal = document.getElementById('car-modal');
        const content = document.getElementById('car-detail-content');
        
        content.innerHTML = this.createCarDetailHTML(this.currentCar);
        modal.style.display = 'block';

        this.setupGallery();
    }

    createCarDetailHTML(car) {
        // ✅ FIXED: Use primary_image with proper fallbacks
        let mainImage = '/images/cars/car-placeholder.jpg';
        
        if (car.primary_image) {
            mainImage = car.primary_image;
        } else if (car.images && car.images.length > 0) {
            mainImage = car.images[0];
        }
        
        // Ensure the URL is properly formatted
        if (!mainImage.startsWith('/') && !mainImage.startsWith('http')) {
            mainImage = '/images/' + mainImage;
        }
        
        return `
            <div class="car-detail-header">
                <div class="car-detail-title">
                    <h2>${car.title}</h2>
                    <div class="car-detail-meta">
                        <span><strong>Brand:</strong> ${car.brand}</span>
                        <span><strong>Model:</strong> ${car.model}</span>
                        <span><strong>Year:</strong> ${car.year}</span>
                        <span class="status-badge status-${car.status}">
                            ${car.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div class="car-detail-price">${car.price}</div>
            </div>

            <div class="car-detail-gallery">
                <div class="main-image">
                    <img src="${mainImage}" 
                         alt="${car.title}" 
                         id="main-image"
                         onerror="this.src='/images/cars/car-placeholder.jpg'">
                    <div class="image-overlay">Click to zoom</div>
                </div>
                ${car.images && car.images.length > 1 ? `
                <div class="thumbnail-grid" id="thumbnail-grid">
                    ${car.images.map((image, index) => {
                        // Format thumbnail images properly
                        let thumbImage = image;
                        if (!thumbImage.startsWith('/') && !thumbImage.startsWith('http')) {
                            thumbImage = '/images/' + thumbImage;
                        }
                        return `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="carsDisplay.changeMainImage('${thumbImage}')">
                            <img src="${thumbImage}" 
                                 alt="${car.title} - Image ${index + 1}"
                                 onerror="this.style.display='none'">
                        </div>
                    `}).join('')}
                </div>
                ` : ''}
            </div>

            <div class="car-detail-info">
                <div class="car-description">
                    <h3>Description</h3>
                    <p>${car.description}</p>
                    
                    ${car.features && car.features.length > 0 ? `
                        <h3 style="margin-top: 1.5rem;">Features & Specifications</h3>
                        <div class="car-features">
                            ${car.features.map(feature => 
                                `<span class="feature-tag">${feature}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="car-specs">
                    <h3>Quick Specs</h3>
                    <div class="spec-item">
                        <span>Brand:</span>
                        <span>${car.brand}</span>
                    </div>
                    <div class="spec-item">
                        <span>Model:</span>
                        <span>${car.model}</span>
                    </div>
                    <div class="spec-item">
                        <span>Year:</span>
                        <span>${car.year}</span>
                    </div>
                    <div class="spec-item">
                        <span>Status:</span>
                        <span class="status-badge status-${car.status}">
                            ${car.status.toUpperCase()}
                        </span>
                    </div>
                    ${car.featured ? `
                        <div class="spec-item">
                            <span>Featured:</span>
                            <span>⭐ Yes</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="reserve-section">
                <button class="reserve-btn pulse" onclick="reserveManager.openReserveModal()">
                    🚗 Reserve This Vehicle
                </button>
            </div>
        `;
    }

    changeMainImage(imageUrl) {
        const mainImage = document.getElementById('main-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (mainImage) {
            mainImage.src = imageUrl;
        }
        
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            const thumbImg = thumb.querySelector('img');
            if (thumbImg && thumbImg.src.includes(imageUrl)) {
                thumb.classList.add('active');
            }
        });
    }

    setupGallery() {
        // Add click to zoom functionality
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.addEventListener('click', function() {
                this.classList.toggle('zoomed');
            });
        }
        console.log('🖼️  Gallery setup with zoom complete');
    }

    setupEventListeners() {
        const statusFilter = document.getElementById('status-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterCars());
        }
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.filterCars());
        }
    }

    filterCars() {
        const statusFilter = document.getElementById('status-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        this.filteredCars = statusFilter === 'all' 
            ? [...this.cars] 
            : this.cars.filter(car => car.status === statusFilter);

        this.sortCars(sortFilter);
        this.renderCars();
    }

    sortCars(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.filteredCars.sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price));
                break;
            case 'price-high':
                this.filteredCars.sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price));
                break;
            case 'year-new':
                this.filteredCars.sort((a, b) => b.year - a.year);
                break;
            case 'featured':
            default:
                this.filteredCars.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? -1 : 1);
                break;
        }
    }

    parsePrice(priceString) {
        return parseFloat(priceString.replace(/[^\d.]/g, '')) || 0;
    }

    showError(message) {
        const grid = document.getElementById('cars-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 3rem;">
                    <h3 style="color: #dc3545; margin-bottom: 1rem;">😕 Loading Failed</h3>
                    <p style="margin-bottom: 1.5rem; color: #666;">${message}</p>
                    <button onclick="location.reload()" 
                            style="padding: 0.8rem 1.5rem; 
                                   background: linear-gradient(135deg, #0066cc, #0099ff); 
                                   color: white; 
                                   border: none; 
                                   border-radius: 8px; 
                                   cursor: pointer;">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded - starting cars display with proper image handling');
    window.carsDisplay = new CarsDisplay();
});

// CMS Integration and data management
class CMSIntegration {
    constructor() {
        this.isPreview = window.location.search.includes('preview');
        this.init();
    }

    init() {
        if (this.isPreview) {
            this.enablePreviewMode();
        }
        
        this.setupLiveReload();
    }

    enablePreviewMode() {
        // Add preview mode indicators
        const style = document.createElement('style');
        style.textContent = `
            .preview-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: #ff6b6b;
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 12px;
                z-index: 10000;
            }
        `;
        document.head.appendChild(style);

        const indicator = document.createElement('div');
        indicator.className = 'preview-indicator';
        indicator.textContent = 'CMS Preview Mode';
        document.body.appendChild(indicator);
    }

    setupLiveReload() {
        // Simulate live reload for CMS preview
        if (this.isPreview) {
            setInterval(() => {
                this.checkForUpdates();
            }, 5000);
        }
    }

    async checkForUpdates() {
        try {
            const response = await fetch('/data/cars-index.json?t=' + Date.now());
            if (response.ok) {
                console.log('CMS Update Check: No changes detected');
            }
        } catch (error) {
            console.log('CMS Update Check: Failed to check for updates');
        }
    }
}

// Initialize CMS integration
const cmsIntegration = new CMSIntegration();
window.cmsIntegration = cmsIntegration;

class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Close modals when clicking X
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize modal manager
const modalManager = new ModalManager();

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

        // Car Info
        carInfo.innerHTML = `
            <div class="reserve-header">
                <h3>${this.selectedCar.title}</h3>
                <p><strong>${this.selectedCar.price}</strong></p>
                <p class="car-ref">Reference: ${this.selectedCar.slug}</p>
            </div>
        `;

        // Limit to 5 contacts
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

// Add CSS animations for reserve manager
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

// Smooth animations for car grid and modals
const animationStyles = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Car card animations */
.car-card {
    animation: fadeInUp 0.6s ease-out;
}

.car-card:nth-child(odd) {
    animation-delay: 0.1s;
}

.car-card:nth-child(even) {
    animation-delay: 0.2s;
}

/* Modal animations */
.modal-content {
    animation: scaleIn 0.3s ease-out;
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Hover animations */
.car-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Status badge animations */
.status-badge {
    animation: slideInRight 0.5s ease-out;
}

/* Button pulse animation for reserve button */
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(0, 102, 204, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
    }
}

.reserve-btn.pulse {
    animation: pulse 2s infinite;
}

/* Feature tag animations */
.feature-tag {
    transition: all 0.3s ease;
}

.feature-tag:hover {
    background: var(--accent-blue);
    color: var(--white);
    transform: translateY(-2px);
}

/* Success message animation */
@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.success-message {
    animation: bounceIn 0.6s ease-out;
}
`;

document.head.insertAdjacentHTML('beforeend', `<style>${animationStyles}</style>`);
