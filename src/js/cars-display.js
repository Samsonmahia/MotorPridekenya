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
        this.showLoading();
        await this.loadCars();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`/data/cars-index.json?nocache=${timestamp}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid cars data format');

            this.cars = data;
            this.filteredCars = [...data];
            console.log(`✅ Loaded ${this.cars.length} vehicles`);

            localStorage.setItem('carsCache', JSON.stringify(data)); // Cache locally
            this.hideLoading();
            this.renderCars();
        } catch (error) {
            console.error('❌ Error loading cars:', error);
            const cached = localStorage.getItem('carsCache');
            if (cached) {
                console.warn('⚠️ Using cached cars data');
                this.cars = JSON.parse(cached);
                this.filteredCars = [...this.cars];
                this.hideLoading();
                this.renderCars();
            } else {
                this.showError(`Failed to load vehicles: ${error.message}`);
            }
        }
    }

    showLoading() {
        const grid = document.getElementById('cars-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading vehicles...</p>
                </div>
            `;
        }
    }

    hideLoading() {
        const loading = document.querySelector('.loading-spinner');
        if (loading) loading.remove();
    }

    renderCars() {
        const grid = document.getElementById('cars-grid');
        if (!grid) return console.error('❌ Missing #cars-grid element');

        if (this.filteredCars.length === 0) {
            grid.innerHTML = `<div class="no-cars"><h3>No vehicles found</h3></div>`;
            return;
        }

        grid.innerHTML = this.filteredCars.map(car => this.createCarCard(car)).join('');
        this.animateCards();
    }

    animateCards() {
        const cards = document.querySelectorAll('.car-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * i);
        });
    }

    createCarCard(car) {
        const statusClass = `status-${(car.status || 'available').toLowerCase()}`;
        const price = car.price && car.price !== 'On Request' ? car.price : '<em>Contact for price</em>';
        const img = car.images?.[0] || '/images/cars/sample.jpg';

        return `
            <div class="car-card" data-car-id="${car.slug}">
                <div class="car-image">
                    <img src="${img}" 
                         alt="${car.title}" 
                         loading="lazy"
                         onerror="this.src='/images/cars/sample.jpg'">
                    <div class="status-badge ${statusClass}">
                        ${car.status?.toUpperCase() || 'AVAILABLE'}
                    </div>
                </div>
                <div class="car-info">
                    <h3>${car.title}</h3>
                    <div class="car-meta">
                        <span>${car.brand} • ${car.model}</span>
                        <span>${car.year}</span>
                    </div>
                    <div class="car-price">${price}</div>
                    <div class="car-actions">
                        <button class="view-details-btn" onclick="carsDisplay.openCarDetail('${car.slug}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>`;
    }

    openCarDetail(slug) {
        this.currentCar = this.cars.find(c => c.slug === slug);
        if (!this.currentCar) return console.error('Car not found:', slug);

        const modal = document.getElementById('car-modal');
        const content = document.getElementById('car-detail-content');
        if (!modal || !content) return console.error('Modal missing in DOM');

        content.innerHTML = this.createCarDetailHTML(this.currentCar);
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    createCarDetailHTML(car) {
        const thumbnails = car.images?.slice(0, 7).map((img, i) =>
            `<img src="${img}" alt="${car.title}" class="thumb"
                  onclick="document.getElementById('main-image').src='${img}'">`
        ).join('') || '';

        const features = car.features?.length
            ? `<div class="car-features">${car.features.map(f => `<span>${f}</span>`).join('')}</div>`
            : '<p>No features listed</p>';

        const price = car.price && car.price !== 'On Request' ? car.price : 'Contact for price';
        const mainImg = car.images?.[0] || '/images/cars/sample.jpg';

        return `
            <div class="car-detail-header">
                <h2>${car.title}</h2>
                <div class="car-detail-meta">
                    <span><strong>${car.brand}</strong> ${car.model} (${car.year})</span>
                    <span class="status-badge status-${car.status?.toLowerCase() || 'available'}">
                        ${car.status?.toUpperCase() || 'AVAILABLE'}
                    </span>
                </div>
                <div class="car-detail-price">${price}</div>
            </div>

            <div class="car-detail-gallery">
                <img id="main-image" src="${mainImg}" alt="${car.title}">
                <div class="thumbnail-row">${thumbnails}</div>
            </div>

            <div class="car-detail-body">
                ${car.description ? `<p>${car.description}</p>` : ''}
                ${features}
                <div class="spec-list">
                    <p><strong>Brand:</strong> ${car.brand}</p>
                    <p><strong>Model:</strong> ${car.model}</p>
                    <p><strong>Year:</strong> ${car.year}</p>
                </div>
            </div>

            <div class="reserve-section">
                <button class="reserve-btn" onclick="reserveManager.openReserveModal()">
                    🚗 Reserve This Vehicle
                </button>
            </div>`;
    }

    setupEventListeners() {
        const modal = document.getElementById('car-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => modal.style.display = 'none', 200);
                }
            });
        }
        console.log('✅ Event listeners set up');
    }

    showError(message) {
        const grid = document.getElementById('cars-grid');
        if (grid) grid.innerHTML = `<div class="error">${message}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.carsDisplay = new CarsDisplay();
});
