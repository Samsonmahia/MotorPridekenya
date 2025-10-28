class CarsDisplay {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentCar = null;
        console.log('🚗 CarsDisplay initialized');
        this.init();
    }

    async init() {
        console.log('🔧 Starting car loading...');
        await this.loadCars();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            console.log('📡 Attempting to fetch cars data...');
            
            // Force no cache
            const timestamp = new Date().getTime();
            const url = `/data/cars-index.json?nocache=${timestamp}`;
            console.log('🔗 Fetching from:', url);
            
            const response = await fetch(url);
            console.log('📡 Response status:', response.status, response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 Data received:', data);
            
            if (!Array.isArray(data)) {
                throw new Error('Data is not an array');
            }
            
            this.cars = data;
            this.filteredCars = [...data];
            
            console.log(`✅ Successfully loaded ${this.cars.length} vehicles`);
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
            console.log('👋 Loading spinner hidden');
        }
    }

    renderCars() {
        const grid = document.getElementById('cars-grid');
        
        if (!grid) {
            console.error('❌ cars-grid element not found!');
            return;
        }

        console.log('🎨 Rendering cars grid...');
        
        if (this.filteredCars.length === 0) {
            grid.innerHTML = `
                <div class="no-cars" style="text-align: center; padding: 3rem;">
                    <h3>No vehicles found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem;">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
        console.log(`✅ Rendered ${this.filteredCars.length} car cards`);
    }

    createCarCard(car) {
        const statusClass = `status-${car.status}`;
        const featuredClass = car.featured ? 'featured' : '';
        
        return `
            <div class="car-card ${featuredClass}" data-car-id="${car.slug}">
                <div class="car-image">
                    <img src="${car.images[0] || '/images/cars/sample.jpg'}" 
                         alt="${car.title}" 
                         loading="lazy"
                         onerror="this.src='/images/cars/sample.jpg'">
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
        console.log('Opening car detail:', carSlug);
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
                    <img src="${car.images[0] || '/images/cars/sample.jpg'}" 
                         alt="${car.title}" 
                         id="main-image"
                         onerror="this.src='/images/cars/sample.jpg'">
                </div>
            </div>

            <div class="car-detail-info">
                <div class="car-description">
                    <h3>Description</h3>
                    <p>${car.description}</p>
                </div>
                
                <div class="car-specs">
                    <h3>Vehicle Details</h3>
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
                        <span>Price:</span>
                        <span style="font-weight: bold; color: #0066cc;">${car.price}</span>
                    </div>
                </div>
            </div>

            <div class="reserve-section">
                <button class="reserve-btn" onclick="reserveManager.openReserveModal()">
                    🚗 Reserve This Vehicle
                </button>
            </div>
        `;
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
        
        console.log('✅ Event listeners setup');
    }

    filterCars() {
        console.log('🔍 Filtering cars...');
        // Simple filtering for now
        this.renderCars();
    }

    showError(message) {
        const grid = document.getElementById('cars-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 3rem;">
                    <h3 style="color: #dc3545; margin-bottom: 1rem;">😕 Loading Failed</h3>
                    <p style="margin-bottom: 1.5rem; color: #666;">${message}</p>
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="location.reload()" 
                                style="padding: 0.8rem 1.5rem; background: #0066cc; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            🔄 Refresh Page
                        </button>
                        <button onclick="carsDisplay.loadCars()" 
                                style="padding: 0.8rem 1.5rem; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            🔁 Retry Load
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded - initializing cars display');
    window.carsDisplay = new CarsDisplay();
});

console.log('🚗 cars-display.js loaded successfully');
