// FIXED CARS DISPLAY - GUARANTEED IMAGE SUPPORT
class CarsDisplay {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentCar = null;
        console.log('🚗 CarsDisplay initialized - IMAGE FIXES APPLIED');
        this.init();
    }

    async init() {
        await this.loadCars();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            console.log('📡 Loading cars data with image fixes...');
            
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
            console.log('🖼️  Image check - first car images:', this.cars[0]?.images);
            
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

        console.log(`🎨 Rendering ${this.filteredCars.length} cars with images...`);
        
        grid.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
        
        console.log('✅ Cars rendered with image fixes');
    }

    createCarCard(car) {
        const statusClass = `status-${car.status}`;
        const featuredClass = car.featured ? 'featured' : '';
        
        // ✅ CRITICAL FIX: Handle images properly
        const imageUrl = car.images && car.images[0] ? car.images[0] : '/images/cars/car-placeholder.jpg';
        console.log(`🖼️  Car ${car.title} image: ${imageUrl}`);
        
        return `
            <div class="car-card ${featuredClass}" data-car-id="${car.slug}">
                <div class="car-image">
                    <img src="${imageUrl}" 
                         alt="${car.title}" 
                         loading="lazy"
                         onload="console.log('✅ Image loaded:', this.src)"
                         onerror="this.onerror=null; this.src='/images/cars/car-placeholder.jpg'; console.log('❌ Image failed, using placeholder:', this.alt)">
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
        // ✅ FIXED: Use first image or placeholder
        const mainImage = car.images && car.images[0] ? car.images[0] : '/images/cars/car-placeholder.jpg';
        
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
        // Gallery functionality
        console.log('🖼️  Gallery setup complete');
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
    console.log('📄 DOM loaded - starting cars display with image fixes');
    window.carsDisplay = new CarsDisplay();
});
