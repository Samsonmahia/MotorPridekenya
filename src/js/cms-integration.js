// Enhanced CMS Integration
class CMSIntegration {
    constructor() {
        this.isPreview = window.location.search.includes('preview');
        this.lastUpdateTime = null;
        this.init();
    }

    init() {
        if (this.isPreview) {
            this.enablePreviewMode();
        }
        
        this.setupAutoRefresh();
        this.setupCMSNotifications();
    }

    enablePreviewMode() {
        // Add preview mode indicators
        const style = document.createElement('style');
        style.textContent = `
            .preview-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        const indicator = document.createElement('div');
        indicator.className = 'preview-indicator';
        indicator.textContent = '🚀 CMS Preview Mode';
        document.body.appendChild(indicator);

        console.log('🔧 CMS Preview Mode Enabled');
    }

    setupAutoRefresh() {
        // Auto-refresh data every 30 seconds in preview mode
        if (this.isPreview) {
            setInterval(() => {
                this.checkForUpdates();
            }, 30000);
        }
    }

    async checkForUpdates() {
        try {
            const carsResponse = await fetch('/data/cars-index.json?t=' + Date.now());
            const contactsResponse = await fetch('/data/contacts-index.json?t=' + Date.now());
            
            if (carsResponse.ok && contactsResponse.ok) {
                const carsData = await carsResponse.json();
                const contactsData = await contactsResponse.json();
                
                // Check if data actually changed
                const currentTime = Date.now();
                if (!this.lastUpdateTime || this.hasDataChanged(carsData, contactsData)) {
                    this.lastUpdateTime = currentTime;
                    this.refreshContent(carsData, contactsData);
                    this.showUpdateNotification();
                }
            }
        } catch (error) {
            console.log('CMS Update Check: Network error');
        }
    }

    hasDataChanged(newCars, newContacts) {
        // Simple check - compare array lengths
        return newCars.length !== window.carsDisplay?.cars.length || 
               newContacts.length !== window.reserveManager?.contacts.length;
    }

    refreshContent(carsData, contactsData) {
        // Update cars display
        if (window.carsDisplay) {
            window.carsDisplay.cars = carsData;
            window.carsDisplay.filteredCars = [...carsData];
            window.carsDisplay.renderCars();
        }
        
        // Update contacts
        if (window.reserveManager) {
            window.reserveManager.contacts = contactsData;
        }
        
        console.log('🔄 Content refreshed from CMS');
    }

    setupCMSNotifications() {
        // Listen for CMS events
        document.addEventListener('DOMContentLoaded', () => {
            this.showWelcomeMessage();
        });
    }

    showWelcomeMessage() {
        if (this.isPreview) {
            setTimeout(() => {
                this.showNotification(
                    'CMS Preview Active', 
                    'Content updates will refresh automatically.',
                    'info'
                );
            }, 1000);
        }
    }

    showUpdateNotification() {
        this.showNotification(
            'Content Updated',
            'Latest changes from CMS have been loaded.',
            'success'
        );
    }

    showNotification(title, message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.cms-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `cms-notification cms-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideDown 0.3s ease-out;
            max-width: 400px;
            text-align: center;
        `;
        
        notification.innerHTML = `
            <strong>${title}</strong>
            <div style="font-size: 0.9rem; margin-top: 0.5rem;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideUp 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize CMS integration
const cmsIntegration = new CMSIntegration();
window.cmsIntegration = cmsIntegration;