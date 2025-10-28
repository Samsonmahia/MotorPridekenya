// In the createCarDetailHTML method, replace the gallery section with:
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

        <!-- IMPROVED IMAGE GALLERY -->
        <div class="car-detail-gallery">
            <div class="main-image" onclick="this.classList.toggle('zoomed')">
                <img src="${car.images[0]}" alt="${car.title}" id="main-image">
                <div class="image-overlay">🔍 Click to zoom</div>
            </div>
            
            ${car.images.length > 1 ? `
            <div class="thumbnail-grid" id="thumbnail-grid">
                ${car.images.map((image, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                         onclick="carsDisplay.changeMainImage('${image}')">
                        <img src="${image}" alt="${car.title} - Image ${index + 1}">
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
                    <span style="font-weight: bold; color: var(--electric-blue);">${car.price}</span>
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
