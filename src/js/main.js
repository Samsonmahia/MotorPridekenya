// 🚗 FIXED CARS DISPLAY - PROPER IMAGE HANDLING & CLICK FUNCTIONALITY
class CarsDisplay {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentCar = null;
        console.log('🚗 CarsDisplay initialized - FIXED VERSION');
        this.init();
    }

    async init() {
        await this.loadCars();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            console.log('📡 Loading cars data...');
            
            // Force no cache
            const timestamp = new Date().getTime();
            const response = await fetch(`/data/cars-index.json?t=${timestamp}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Data is not an array');
            }
            
            this.cars = this.processCarData(data);
            this.filteredCars = [...this.cars];
            
            console.log(`✅ Successfully loaded ${this.cars.length} vehicles`);
            this.hideLoading();
            this.renderCars();
            
        } catch (error) {
            console.error('❌ Error loading cars:', error);
            this.showError(`Failed to load vehicles: ${error.message}`);
        }
    }

    processCarData(cars) {
        return cars.map(car => {
            // ✅ FIX: Ensure all image paths are properly formatted
            let images = car.images || [];
            
            // Process each image path
            images = images.map(img => {
                if (!img) return '/images/car-placeholder.jpg';
                
                // Handle different image path formats
                if (img.startsWith('/')) return img;
                if (img.startsWith('http')) return img;
                
                // CMS stores images in static/images, public path is /images
                return `/images/${img}`;
            });

            // Set primary image
            const primary_image = images.length > 0 ? images[0] : '/images/car-placeholder.jpg';

            return {
                ...car,
                images: images,
                primary_image: primary_image
            };
        });
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

        grid.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
        
        // ✅ FIX: Add click event listeners to car cards
        this.setupCardClickEvents();
    }

    createCarCard(car) {
        const statusClass = `status-${car.status}`;
        const featuredClass = car.featured ? 'featured' : '';
        
        // ✅ FIX: Use processed image paths
        const imageUrl = car.primary_image;
        
        return `
            <div class="car-card ${featuredClass}" data-car-slug="${car.slug}">
                <div class="car-image">
                    <img src="${imageUrl}" 
                         alt="${car.title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='/images/car-placeholder.jpg';">
                    <div class="status-badge ${statusClass}">
                        ${car.status.toUpperCase()}
                    </div>
                    ${car.featured ? `<div class="featured-badge">⭐ Featured</div>` : ''}
                </div>
                <div class="car-info">
                    <h3 class="car-title">${car.title}</h3>
                    <div class="car-meta">
                        <span class="car-brand">${car.brand}</span>
                        <span class="car-model">${car.model}</span>
                        <span class="car-year">${car.year}</span>
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
                    <button class="view-details-btn" data-car-slug="${car.slug}">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    // ✅ FIX: Proper click event setup
    setupCardClickEvents() {
        // Card click
        document.querySelectorAll('.car-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking button specifically
                if (!e.target.closest('.view-details-btn')) {
                    const slug = card.getAttribute('data-car-slug');
                    this.openCarDetail(slug);
                }
            });
        });

        // Button click
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const slug = btn.getAttribute('data-car-slug');
                this.openCarDetail(slug);
            });
        });
    }

    openCarDetail(carSlug) {
        this.currentCar = this.cars.find(car => car.slug === carSlug);
        if (!this.currentCar) {
            console.error('Car not found:', carSlug);
            return;
        }

        const modal = document.getElementById('car-modal');
        const content = document.getElementById('car-detail-content');
        
        if (!modal || !content) {
            console.error('Modal elements not found');
            return;
        }

        content.innerHTML = this.createCarDetailHTML(this.currentCar);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        this.setupGallery();
    }

    createCarDetailHTML(car) {
        const mainImage = car.primary_image;
        
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
                         id="main-car-image"
                         onerror="this.src='/images/car-placeholder.jpg'">
                </div>
                ${car.images && car.images.length > 1 ? `
                <div class="thumbnail-grid" id="thumbnail-grid">
                    ${car.images.map((image, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="carsDisplay.changeMainImage('${image}')">
                            <img src="${image}" 
                                 alt="${car.title} - Image ${index + 1}"
                                 onerror="this.style.display='none'">
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <div class="car-detail-info">
                <div class="car-description">
                    <h3>Description</h3>
                    <p>${car.description}</p>
                    
                    ${car.features && car.features.length > 0 ? `
                        <h3 style="margin-top: 1.5rem;">Features</h3>
                        <div class="car-features-detail">
                            ${car.features.map(feature => 
                                `<span class="feature-tag">${feature}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="reserve-section">
                <button class="reserve-btn" onclick="reserveManager.openReserveModal()">
                    🚗 Reserve This Vehicle
                </button>
            </div>
        `;
    }

    changeMainImage(imageUrl) {
        const mainImage = document.getElementById('main-car-image');
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
        // Add any gallery-specific functionality here
        console.log('🖼️ Gallery setup complete');
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
                <div class="error-message">
                    <h3>😕 Loading Failed</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">🔄 Refresh Page</button>
                </div>
            `;
        }
    }
}

// Modal Manager
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
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
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
        document.body.style.overflow = 'auto';
    }
}

// Reserve Manager
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
            const response = await fetch(`/data/contacts-index.json?t=${Date.now()}`);
            if (response.ok) {
                this.contacts = await response.json();
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.contacts = this.createFallbackContacts();
        }
    }

    createFallbackContacts() {
        return [
            { name: "Samuel Maina", whatsapp: "254712345678", role: "Sales Manager" },
            { name: "Elizabeth Wanjiku", whatsapp: "254723456789", role: "Sales Agent" }
        ];
    }

    openReserveModal() {
        this.selectedCar = window.carsDisplay?.currentCar;
        if (!this.selectedCar) return;

        const modal = document.getElementById('reserve-modal');
        const carInfo = document.getElementById('selected-car-info');
        const contactsList = document.getElementById('contacts-list');

        if (!modal || !carInfo || !contactsList) return;

        carInfo.innerHTML = `
            <div class="reserve-header">
                <h3>${this.selectedCar.title}</h3>
                <p><strong>${this.selectedCar.price}</strong></p>
            </div>
        `;

        const contactsToShow = this.contacts.slice(0, 3);
        contactsList.innerHTML = contactsToShow.map(contact => this.createContactCard(contact)).join('');

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    createContactCard(contact) {
        const cleanNumber = contact.whatsapp.replace(/\D/g, '');
        return `
            <div class="contact-card">
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-role">${contact.role}</div>
                </div>
                <a href="https://wa.me/${cleanNumber}?text=Hi ${contact.name}, I'm interested in a vehicle from MotorPride Kenya" 
                   target="_blank" class="whatsapp-btn">
                    💬 WhatsApp
                </a>
            </div>
        `;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚗 Initializing MotorPride Cars Display');
    
    // Initialize managers
    window.modalManager = new ModalManager();
    window.reserveManager = new ReserveManager();
    window.carsDisplay = new CarsDisplay();
});
