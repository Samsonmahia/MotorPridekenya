class CarsDisplay {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentCar = null;
        this.init();
    }

    async init() {
        await this.loadCars();
        this.renderCars();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            const response = await fetch('/data/cars-index.json');
            if (!response.ok) throw new Error('Failed to load cars');
            
            this.cars = await response.json();
            this.filteredCars = [...this.cars];
            
            // Preload images
            this.preloadImages();
        } catch (error) {
            console.error('Error loading cars:', error);
            this.showError('Failed to load vehicles. Please try again later.');
        }
    }

    preloadImages() {
        this.cars.forEach(car => {
            if (car.images && car.images.length > 0) {
                car.images.forEach(imageUrl => {
                    const img = new Image();
                    img.src = imageUrl;
                });
            }
        });
    }

    renderCars() {
        const grid = document.getElementById('cars-grid');
        
        if (this.filteredCars.length === 0) {
            grid.innerHTML = `
                <div class="no-cars">
                    <h3>No vehicles found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
    }

    createCarCard(car) {
        const statusClass = `status-${car.status}`;
        const featuredClass = car.featured ? 'featured' : '';
        
        return `
            <div class="car-card ${featuredClass}" data-car-id="${car.slug}">
                <div class="car-image">
                    <img src="${car.images[0]}" alt="${car.title}" loading="lazy" 
                         onload="this.classList.add('loaded')">
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
                    ${car.features ? `
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

    filterCars() {
        const statusFilter = document.getElementById('status-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;

        // Filter by status
        this.filteredCars = statusFilter === 'all' 
            ? [...this.cars] 
            : this.cars.filter(car => car.status === statusFilter);

        // Sort cars
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
        // Remove currency symbols and commas, then parse as number
        return parseFloat(priceString.replace(/[^\d.]/g, '')) || 0;
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
                    <img src="${car.images[0]}" alt="${car.title}" id="main-image">
                </div>
                <div class="thumbnail-grid" id="thumbnail-grid">
                    ${car.images.map((image, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="carsDisplay.changeMainImage('${image}')">
                            <img src="${image}" alt="${car.title} - Image ${index + 1}">
                        </div>
                    `).join('')}
                </div>
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
        
        mainImage.src = imageUrl;
        
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.querySelector('img').src === imageUrl) {
                thumb.classList.add('active');
            }
        });
    }

    setupGallery() {
        // Additional gallery functionality can be added here
    }

    setupEventListeners() {
        document.getElementById('status-filter').addEventListener('change', () => this.filterCars());
        document.getElementById('sort-filter').addEventListener('change', () => this.filterCars());
    }

    showError(message) {
        const grid = document.getElementById('cars-grid');
        grid.innerHTML = `
            <div class="error-message">
                <h3>😕 Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

// Initialize cars display
const carsDisplay = new CarsDisplay();