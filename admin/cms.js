// Initialize Decap CMS
if (typeof window !== 'undefined') {
    // Wait for the Netlify Identity widget to initialize
    window.netlifyIdentity = require('netlify-identity-widget');
    window.netlifyIdentity.on('init', user => {
        if (!user) {
            window.netlifyIdentity.on('login', () => {
                document.location.href = '/admin/';
            });
        }
    });
    
    // Initialize Decap CMS
    const CMS = require('decap-cms-app');
    
    CMS.init({
        config: {
            backend: {
                name: "git-gateway",
                branch: "main"
            },
            media_folder: "static/images",
            public_folder: "/images",
            collections: [
                {
                    name: "cars",
                    label: "Cars",
                    folder: "content/cars",
                    create: true,
                    slug: "{{slug}}",
                    fields: [
                        { label: "Title", name: "title", widget: "string", required: true },
                        { label: "Brand", name: "brand", widget: "string", required: true },
                        { label: "Model", name: "model", widget: "string", required: true },
                        { label: "Year", name: "year", widget: "number", required: true },
                        { label: "Price", name: "price", widget: "string", required: true },
                        { 
                            label: "Status", 
                            name: "status", 
                            widget: "select", 
                            options: ["available", "sold", "incoming"],
                            default: "available",
                            required: true 
                        },
                        { 
                            label: "Featured", 
                            name: "featured", 
                            widget: "boolean", 
                            default: false 
                        },
                        { 
                            label: "Description", 
                            name: "description", 
                            widget: "text",
                            required: true 
                        },
                        { 
                            label: "Features", 
                            name: "features", 
                            widget: "list",
                            field: { label: "Feature", name: "feature", widget: "string" },
                            required: false 
                        },
                        { 
                            label: "Images", 
                            name: "images", 
                            widget: "list", 
                            field: { 
                                label: "Image", 
                                name: "image", 
                                widget: "image",
                                allow_multiple: false
                            },
                            required: true 
                        }
                    ]
                }
            ]
        }
    });
}