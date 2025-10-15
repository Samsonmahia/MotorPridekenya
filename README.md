<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoHub | Find Your Perfect Vehicle</title>
    <style>
        :root {
            --primary-color: #1a73e8;
            --secondary-color: #f8f9fa;
            --accent-color: #ff6b35;
            --text-color: #333;
            --light-text: #666;
            --border-color: #e0e0e0;
            --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f5f5f5;
            color: var(--text-color);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header Styles */
        header {
            background-color: white;
            box-shadow: var(--shadow);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
        }

        nav ul {
            display: flex;
            list-style: none;
        }

        nav ul li {
            margin-left: 25px;
        }

        nav ul li a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            transition: var(--transition);
        }

        nav ul li a:hover {
            color: var(--primary-color);
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                        url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
            background-size: cover;
            background-position: center;
            color: white;
            padding: 100px 0;
            text-align: center;
            margin-bottom: 60px;
        }

        .hero h1 {
            font-size: 42px;
            margin-bottom: 20px;
        }

        .hero p {
            font-size: 18px;
            max-width: 600px;
            margin: 0 auto 30px;
        }

        /* Search Section */
        .search-section {
            background: #0A1F44;
            color: #fff;
            padding: 40px 30px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            margin-top: 40px;
            margin-bottom: 60px;
        }
        
        .search-section h2 {
            text-align: center;
            margin-bottom: 25px;
            color: #00AEEF;
        }
        
        .search-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
        }
        
        .form-group label {
            font-weight: bold;
            color: #E6E8EB;
            display: block;
            margin-bottom: 8px;
        }
        
        .form-control {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: none;
            background: #E6E8EB;
            font-size: 16px;
            cursor: pointer;
        }
        
        .search-btn {
            grid-column: 1 / -1;
            background: #00AEEF;
            color: #fff;
            border: none;
            padding: 14px;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.3s;
            font-size: 16px;
            font-weight: 600;
            margin-top: 10px;
        }
        
        .search-btn:hover {
            background: #007bbd;
        }
        
        .search-btn:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }

        /* Features Section */
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 60px;
        }

        .feature-card {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            box-shadow: var(--shadow);
            transition: var(--transition);
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 40px;
            margin-bottom: 20px;
            color: var(--primary-color);
        }

        .feature-title {
            font-size: 20px;
            margin-bottom: 15px;
        }

        .feature-description {
            color: var(--light-text);
        }

        /* Footer */
        footer {
            background-color: #333;
            color: white;
            padding: 40px 0;
            text-align: center;
        }

        .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .footer-logo {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: white;
        }

        .footer-links {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .footer-links a {
            color: #ccc;
            text-decoration: none;
            transition: var(--transition);
        }

        .footer-links a:hover {
            color: white;
        }

        .copyright {
            color: #999;
            font-size: 14px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .search-form {
                grid-template-columns: 1fr;
            }
            
            .header-content {
                flex-direction: column;
                gap: 15px;
            }
            
            nav ul {
                margin-top: 10px;
            }
            
            .hero h1 {
                font-size: 32px;
            }
        }

        @media (max-width: 480px) {
            .search-section {
                padding: 20px;
            }
            
            .section-title {
                font-size: 24px;
            }
            
            .feature-card {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">AutoHub</div>
                <nav>
                    <ul>
                        <li><a href="#" class="active">Home</a></li>
                        <li><a href="allcars.html">All Cars</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Find Your Perfect Vehicle</h1>
            <p>Browse through our extensive collection of quality vehicles at competitive prices</p>
        </div>
    </section>

    <!-- Search Section -->
    <section class="container">
        <div class="search-section">
            <h2 class="section-title">Search Our Inventory</h2>
            
            <form class="search-form" id="searchForm">
                <div class="form-group">
                    <label for="make">Make</label>
                    <select id="make" class="form-control" name="make">
                        <option value="">Select Make</option>
                        <!-- Options will be populated by JavaScript -->
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="model">Model</label>
                    <select id="model" class="form-control" name="model" disabled>
                        <option value="">Select Model</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="year">Year</label>
                    <select id="year" class="form-control" name="year" disabled>
                        <option value="">Select Year</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="transmission">Transmission</label>
                    <select id="transmission" class="form-control" name="transmission" disabled>
                        <option value="">Select Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="fuel">Fuel Type</label>
                    <select id="fuel" class="form-control" name="fuel" disabled>
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                    </select>
                </div>
                
                <button type="submit" class="search-btn" id="searchBtn" disabled>Search Vehicles</button>
            </form>
        </div>
    </section>

    <!-- Features Section -->
    <section class="container">
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">🚗</div>
                <h3 class="feature-title">Wide Selection</h3>
                <p class="feature-description">Browse through hundreds of quality vehicles from various brands and models.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">💰</div>
                <h3 class="feature-title">Best Prices</h3>
                <p class="feature-description">We offer competitive pricing and flexible payment options for all budgets.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔧</div>
                <h3 class="feature-title">Quality Assurance</h3>
                <p class="feature-description">All our vehicles undergo thorough inspection and come with warranty options.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🚚</div>
                <h3 class="feature-title">Nationwide Delivery</h3>
                <p class="feature-description">We deliver vehicles to any location across the country at your convenience.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">AutoHub</div>
                <div class="footer-links">
                    <a href="#">Home</a>
                    <a href="allcars.html">All Cars</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
                <div class="copyright">
                    &copy; 2023 AutoHub. All rights reserved.
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Car data structure for the search functionality
        const carsData = [
            { make: "Mazda", model: "CX-5", year: 2020, transmission: "6-Speed Manual", fuel: "Petrol" },
            { make: "Mazda", model: "Demio", year: 2018, transmission: "Automatic", fuel: "Petrol" },
            { make: "Mercedes-Benz", model: "A180", year: 2018, transmission: "Automatic", fuel: "Petrol" },
            { make: "Volvo", model: "V40 T3", year: 2019, transmission: "Automatic", fuel: "Petrol" },
            { make: "Suzuki", model: "Swift", year: 2016, transmission: "Automatic", fuel: "Petrol" },
            { make: "Mazda", model: "CX-5", year: 2020, transmission: "Automatic", fuel: "Diesel" },
            { make: "Mercedes Benz", model: "GLC220D 4MATIC", year: 2018, transmission: "Automatic", fuel: "Diesel" },
            { make: "Toyota", model: "Voxy", year: 2018, transmission: "Automatic", fuel: "Petrol" },
            { make: "Nissan", model: "Dualis", year: 2011, transmission: "Automatic", fuel: "Petrol" },
            { make: "Toyota", model: "Ractis", year: 2009, transmission: "Automatic", fuel: "Petrol" },
            { make: "Toyota", model: "Ractis", year: 2016, transmission: "Automatic", fuel: "Petrol" },
            { make: "Mitsubishi", model: "Mirage", year: 2015, transmission: "Automatic", fuel: "Petrol" },
            { make: "Volvo", model: "XC60", year: 2017, transmission: "Automatic", fuel: "Diesel" },
            { make: "Lexus", model: "RX270", year: 2014, transmission: "Automatic", fuel: "Petrol" }
        ];

        // DOM Elements
        const searchForm = document.getElementById('searchForm');
        const makeSelect = document.getElementById('make');
        const modelSelect = document.getElementById('model');
        const yearSelect = document.getElementById('year');
        const transmissionSelect = document.getElementById('transmission');
        const fuelSelect = document.getElementById('fuel');
        const searchBtn = document.getElementById('searchBtn');

        // Initialize the search form
        function initSearchForm() {
            populateMakes();
            setupEventListeners();
        }

        // Populate makes dropdown
        function populateMakes() {
            const makes = [...new Set(carsData.map(car => car.make))].sort();
            
            makes.forEach(make => {
                const option = document.createElement('option');
                option.value = make;
                option.textContent = make;
                makeSelect.appendChild(option);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Make selection event
            makeSelect.addEventListener('change', function() {
                if (this.value) {
                    populateModels(this.value);
                    modelSelect.disabled = false;
                } else {
                    resetDependentSelects([modelSelect, yearSelect, transmissionSelect, fuelSelect]);
                    disableSearchButton();
                }
            });

            // Model selection event
            modelSelect.addEventListener('change', function() {
                if (this.value && makeSelect.value) {
                    populateYears(makeSelect.value, this.value);
                    yearSelect.disabled = false;
                } else {
                    resetDependentSelects([yearSelect, transmissionSelect, fuelSelect]);
                    disableSearchButton();
                }
            });

            // Year selection event
            yearSelect.addEventListener('change', function() {
                if (this.value && makeSelect.value && modelSelect.value) {
                    populateTransmissions(makeSelect.value, modelSelect.value, this.value);
                    transmissionSelect.disabled = false;
                } else {
                    resetDependentSelects([transmissionSelect, fuelSelect]);
                    disableSearchButton();
                }
            });

            // Transmission selection event
            transmissionSelect.addEventListener('change', function() {
                if (this.value && makeSelect.value && modelSelect.value && yearSelect.value) {
                    populateFuelTypes(makeSelect.value, modelSelect.value, yearSelect.value, this.value);
                    fuelSelect.disabled = false;
                } else {
                    resetDependentSelects([fuelSelect]);
                    disableSearchButton();
                }
            });

            // Fuel type selection event
            fuelSelect.addEventListener('change', function() {
                if (this.value && makeSelect.value && modelSelect.value && yearSelect.value && transmissionSelect.value) {
                    enableSearchButton();
                } else {
                    disableSearchButton();
                }
            });

            // Form submission - redirect to all-cars.html with search parameters
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                redirectToAllCars();
            });
        }

        // Populate models based on selected make
        function populateModels(make) {
            resetSelect(modelSelect);
            modelSelect.disabled = false;
            
            const models = [...new Set(carsData
                .filter(car => car.make === make)
                .map(car => car.model))].sort();
            
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }

        // Populate years based on selected make and model
        function populateYears(make, model) {
            resetSelect(yearSelect);
            yearSelect.disabled = false;
            
            const years = [...new Set(carsData
                .filter(car => car.make === make && car.model === model)
                .map(car => car.year))].sort((a, b) => b - a); // Sort descending (newest first)
            
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
        }

        // Populate transmissions based on selected make, model, and year
        function populateTransmissions(make, model, year) {
            resetSelect(transmissionSelect);
            transmissionSelect.disabled = false;
            
            const transmissions = [...new Set(carsData
                .filter(car => car.make === make && car.model === model && car.year == year)
                .map(car => car.transmission))].sort();
            
            transmissions.forEach(transmission => {
                const option = document.createElement('option');
                option.value = transmission;
                option.textContent = transmission;
                transmissionSelect.appendChild(option);
            });
        }

        // Populate fuel types based on selected make, model, year, and transmission
        function populateFuelTypes(make, model, year, transmission) {
            resetSelect(fuelSelect);
            fuelSelect.disabled = false;
            
            const fuelTypes = [...new Set(carsData
                .filter(car => car.make === make && car.model === model && 
                              car.year == year && car.transmission === transmission)
                .map(car => car.fuel))].sort();
            
            fuelTypes.forEach(fuel => {
                const option = document.createElement('option');
                option.value = fuel;
                option.textContent = fuel;
                fuelSelect.appendChild(option);
            });
        }

        // Reset a select element to its default state
        function resetSelect(selectElement) {
            selectElement.innerHTML = '<option value="">Select ' + 
                selectElement.name.charAt(0).toUpperCase() + 
                selectElement.name.slice(1) + '</option>';
        }

        // Reset multiple dependent selects
        function resetDependentSelects(selects) {
            selects.forEach(select => {
                resetSelect(select);
                select.disabled = true;
            });
        }

        // Enable the search button
        function enableSearchButton() {
            searchBtn.disabled = false;
        }

        // Disable the search button
        function disableSearchButton() {
            searchBtn.disabled = true;
        }

        // Redirect to all-cars.html with search parameters
        function redirectToAllCars() {
            const make = makeSelect.value;
            const model = modelSelect.value;
            const year = yearSelect.value;
            const transmission = transmissionSelect.value;
            const fuel = fuelSelect.value;
            
            // Build query string
            const params = new URLSearchParams();
            if (make) params.append('make', make);
            if (model) params.append('model', model);
            if (year) params.append('year', year);
            if (transmission) params.append('transmission', transmission);
            if (fuel) params.append('fuel', fuel);
            
            // Redirect to all-cars.html with search parameters
            window.location.href = 'allcars.html?' + params.toString();
        }

        // Initialize the search form when DOM is loaded
        document.addEventListener('DOMContentLoaded', initSearchForm);
    </script>
</body>
</html>