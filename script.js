document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('costForm');
    const materialsToggle = document.getElementById('materialsToggle');
    const materialsSection = document.getElementById('materialsSection');
    const servicesToggle = document.getElementById('servicesToggle');
    const servicesSection = document.getElementById('servicesSection');
    const saveEstimateBtn = document.getElementById('saveEstimate');
    const printEstimateBtn = document.getElementById('printEstimate');

    // Initialize toggle sections
    if (materialsToggle && materialsSection) {
        materialsToggle.addEventListener('click', function() {
            materialsSection.classList.toggle('active');
            materialsToggle.classList.toggle('active');
        });
    }

    if (servicesToggle && servicesSection) {
        servicesToggle.addEventListener('click', function() {
            servicesSection.classList.toggle('active');
            servicesToggle.classList.toggle('active');
        });
    }

    // Material quality multipliers
    const materialMultipliers = {
        'economy': 0.8,
        'standard': 1.0,
        'premium': 1.4,
        'luxury': 2.0
    };

    // Base cost per m² for different project types
    const baseCosts = {
        'residential': 12000,
        'commercial': 15000,
        'renovation': 8000,
        'extension': 10000,
        'new_build': 11000
    };

    // Service costs
    const serviceCosts = {
        'architect': 50000,
        'engineer': 35000,
        'plumbing': 25000,
        'electrical': 30000,
        'plastering': 20000
    };

    // Current estimate data
    let currentEstimate = {};

    // Form submission handler
    if (form) {
        // Calculate on page load with default values
        calculateEstimate();

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateEstimate();
        });

        // Recalculate when inputs change
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', calculateEstimate);
            input.addEventListener('input', calculateEstimate);
        });

        // Recalculate when checkboxes change
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculateEstimate);
        });
    }

    function calculateEstimate() {
        console.log('Calculating estimate...');

        // Get form values
        const area = parseFloat(document.getElementById('area').value) || 0;
        const projectType = document.getElementById('project_type').value;
        const materialQuality = document.getElementById('material_quality').value;
        const laborRate = parseFloat(document.getElementById('labor_rate').value) || 0;
        const projectDuration = parseFloat(document.getElementById('project_duration').value) || 0;
        const wasteRemoval = parseFloat(document.getElementById('waste_removal').value) || 0;
        const permits = parseFloat(document.getElementById('permits').value) || 0;
        const contingency = parseFloat(document.getElementById('contingency').value) || 0;

        console.log('Input values:', { area, projectType, materialQuality, laborRate, projectDuration, wasteRemoval, permits, contingency });

        // Calculate costs
        const baseCost = baseCosts[projectType] || 12000;
        const materialMultiplier = materialMultipliers[materialQuality] || 1.0;

        // Materials cost
        const materialsCost = area * baseCost * materialMultiplier;

        // Labor cost (assuming 40 hours per week)
        const laborCost = laborRate * 40 * projectDuration;

        // Services cost
        let servicesCost = 0;
        if (document.getElementById('architect') && document.getElementById('architect').checked) {
            servicesCost += serviceCosts.architect;
            console.log('Architect service added');
        }
        if (document.getElementById('engineer') && document.getElementById('engineer').checked) {
            servicesCost += serviceCosts.engineer;
            console.log('Engineer service added');
        }
        if (document.getElementById('plumbing') && document.getElementById('plumbing').checked) {
            servicesCost += serviceCosts.plumbing;
            console.log('Plumbing service added');
        }
        if (document.getElementById('electrical') && document.getElementById('electrical').checked) {
            servicesCost += serviceCosts.electrical;
            console.log('Electrical service added');
        }
        if (document.getElementById('plastering') && document.getElementById('plastering').checked) {
            servicesCost += serviceCosts.plastering;
            console.log('Plastering service added');
        }

        // Additional costs
        const additionalCost = wasteRemoval + permits;

        // Subtotal
        const subtotal = materialsCost + laborCost + servicesCost + additionalCost;

        // Contingency cost
        const contingencyCost = subtotal * (contingency / 100);

        // Total cost
        const totalCost = subtotal + contingencyCost;

        console.log('Calculated costs:', { materialsCost, laborCost, servicesCost, additionalCost, contingencyCost, totalCost });

        // Update UI
        if (document.getElementById('materialsCost')) {
            document.getElementById('materialsCost').textContent = 'ZAR ' + materialsCost.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        if (document.getElementById('laborCost')) {
            document.getElementById('laborCost').textContent = 'ZAR ' + laborCost.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        if (document.getElementById('servicesCost')) {
            document.getElementById('servicesCost').textContent = 'ZAR ' + servicesCost.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        if (document.getElementById('additionalCost')) {
            document.getElementById('additionalCost').textContent = 'ZAR ' + additionalCost.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        if (document.getElementById('contingencyCost')) {
            document.getElementById('contingencyCost').textContent = 'ZAR ' + contingencyCost.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        if (document.getElementById('totalCost')) {
            document.getElementById('totalCost').textContent = 'ZAR ' + totalCost.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        // Update summary
        if (document.getElementById('summaryType')) {
            document.getElementById('summaryType').textContent = document.getElementById('project_type').options[document.getElementById('project_type').selectedIndex].text;
        }
        if (document.getElementById('summaryArea')) {
            document.getElementById('summaryArea').textContent = area + ' m²';
        }
        if (document.getElementById('summaryQuality')) {
            document.getElementById('summaryQuality').textContent = materialQuality.charAt(0).toUpperCase() + materialQuality.slice(1);
        }
        if (document.getElementById('summaryDuration')) {
            document.getElementById('summaryDuration').textContent = projectDuration + ' weeks';
        }

        // Store current estimate
        currentEstimate = {
            materialsCost,
            laborCost,
            servicesCost,
            additionalCost,
            contingencyCost,
            totalCost,
            area,
            projectType,
            materialQuality,
            projectDuration
        };

        console.log('Estimate calculation complete!');
    }

    // Save estimate
    if (saveEstimateBtn) {
        saveEstimateBtn.addEventListener('click', function() {
            if (Object.keys(currentEstimate).length === 0) {
                alert('Please calculate an estimate first');
                return;
            }

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentEstimate, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "construction_estimate_" + new Date().toISOString().slice(0,10) + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            alert('Estimate saved successfully!');
        });
    }

    // Print estimate
    if (printEstimateBtn) {
        printEstimateBtn.addEventListener('click', function() {
            if (Object.keys(currentEstimate).length === 0) {
                alert('Please calculate an estimate first');
                return;
            }

            window.print();
        });
    }

    // Initialize page
    initializePage();

    function initializePage() {
        console.log('Page initialized');

        // Set current year in footer
        const copyrightElement = document.querySelector('.copyright p');
        if (copyrightElement) {
            copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', new Date().getFullYear());
        }

        // Add active class to current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Test if JavaScript is working
        console.log('JavaScript loaded successfully!');
    }
});