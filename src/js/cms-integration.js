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
        // Simulate live reload for CMS preview (in real scenario, use WebSockets or similar)
        if (this.isPreview) {
            setInterval(() => {
                this.checkForUpdates();
            }, 5000); // Check every 5 seconds
        }
    }

    async checkForUpdates() {
        try {
            const response = await fetch('/data/cars-index.json?t=' + Date.now());
            if (response.ok) {
                // In a real implementation, compare with current data
                // and reload if changed
                console.log('CMS Update Check: No changes detected');
            }
        } catch (error) {
            console.log('CMS Update Check: Failed to check for updates');
        }
    }
}

// Initialize CMS integration
const cmsIntegration = new CMSIntegration();

// Export for global access
window.cmsIntegration = cmsIntegration;
