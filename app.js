/**
 * app.js - Application UI Logic
 *
 * This module handles all UI interactions:
 * - Tab switching
 * - Rendering data lists
 * - Form handling (create/edit)
 * - Delete operations
 * - Dropdown population for foreign keys
 */

(function() {
    'use strict';

    // State
    let currentTab = 'cars';
    let editingItem = null;

    /**
     * Validation Functions - Check if records have complete data
     */
    function validateCellModel(cell) {
        const issues = [];
        if (!cell.chemistry) issues.push('Missing chemistry');
        if (!cell.nominalVoltage) issues.push('Missing voltage');
        if (!cell.nominalCapacityMah) issues.push('Missing capacity');
        return {
            isComplete: issues.length === 0,
            issues: issues,
            completeness: Math.round((3 - issues.length) / 3 * 100)
        };
    }

    function validateBatteryPack(pack) {
        const issues = [];
        if (!pack.cellModelId) issues.push('Missing cell model');
        if (!pack.seriesCount) issues.push('Missing series count');
        if (!pack.parallelCount) issues.push('Missing parallel count');
        if (!pack.cellCount) issues.push('Missing cell count');
        return {
            isComplete: issues.length === 0,
            issues: issues,
            completeness: Math.round((4 - issues.length) / 4 * 100)
        };
    }

    function validateCar(car) {
        const issues = [];
        // Trim is optional, so we only check years
        if (!car.yearStart) issues.push('Missing start year');
        if (!car.yearEnd) issues.push('Missing end year');
        return {
            isComplete: issues.length === 0,
            issues: issues,
            completeness: issues.length === 0 ? 100 : (car.yearStart && !car.yearEnd ? 50 : (!car.yearStart && car.yearEnd ? 50 : 0))
        };
    }

    /**
     * Helper function to create validation badge HTML
     */
    function createValidationBadge(validation) {
        if (validation.isComplete) {
            return '<span class="badge badge-complete">✓ Complete</span>';
        }
        return `<span class="badge badge-incomplete" title="${validation.issues.join(', ')}">⚠ ${validation.completeness}% Complete</span>`;
    }

    /**
     * Car brand logo mapping and helper
     */
    const carBrandLogos = {
        'BMW': 'assets/logos/cars/bmw.png',
        'Tesla': 'assets/logos/cars/tesla.png',
        'Toyota': 'assets/logos/cars/toyota.png',
        'Nissan': 'assets/logos/cars/nissan.png',
        'Hyundai': 'assets/logos/cars/hyundai.png',
        'Mitsubishi': 'assets/logos/cars/mitsubishi.png',
        'Peugeot': 'assets/logos/cars/peugeot.png',
        'Citroën': 'assets/logos/cars/citroen.png',
        'Citroen': 'assets/logos/cars/citroen.png',
        'Renault': 'assets/logos/cars/renault.png',
        'Volkswagen': 'assets/logos/cars/volkswagen.png',
        'Audi': 'assets/logos/cars/audi.png',
        'Mercedes-Benz': 'assets/logos/cars/mercedes-benz.png',
        'Ford': 'assets/logos/cars/ford.png',
        'Chevrolet': 'assets/logos/cars/chevrolet.png',
        'Honda': 'assets/logos/cars/honda.png',
        'Kia': 'assets/logos/cars/kia.png',
        'Mazda': 'assets/logos/cars/mazda.png',
        'Porsche': 'assets/logos/cars/porsche.png',
        'Volvo': 'assets/logos/cars/volvo.png'
    };

    function getCarLogoHTML(brand) {
        const logoUrl = carBrandLogos[brand];
        const initials = brand.substring(0, 2).toUpperCase();

        if (logoUrl) {
            return `
                <img src="${logoUrl}"
                     alt="${brand}"
                     class="car-logo"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="car-logo-placeholder" style="display: none;">${initials}</div>
            `;
        } else {
            return `<div class="car-logo-placeholder">${initials}</div>`;
        }
    }

    /**
     * Cell manufacturer logo mapping and helper
     */
    const cellManufacturerLogos = {
        'LG': 'assets/logos/cells/lg.png',
        'Panasonic': 'assets/logos/cells/panasonic.png',
        'Samsung SDI': 'assets/logos/cells/samsung.png',
        'Toyota': 'assets/logos/cells/toyota.png',
        'GS Yuasa': 'assets/logos/cells/gs-yuasa.png'
    };

    function getCellManufacturerLogoHTML(manufacturer) {
        const logoUrl = cellManufacturerLogos[manufacturer];
        const initials = manufacturer.substring(0, 2).toUpperCase();

        if (logoUrl) {
            return `
                <img src="${logoUrl}"
                     alt="${manufacturer}"
                     class="car-logo"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="car-logo-placeholder" style="display: none;">${initials}</div>
            `;
        } else {
            return `<div class="car-logo-placeholder">${initials}</div>`;
        }
    }

    /**
     * Helper function to create visual stats summary HTML
     */
    function createStatsHTML(stats) {
        const progressClass = stats.percentage < 50 ? 'low' : stats.percentage < 80 ? 'medium' : 'high';
        return `
            <div class="stats-summary">
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Total</span>
                        <span class="stat-value">${stats.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Complete</span>
                        <span class="stat-value stat-complete">${stats.complete}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Incomplete</span>
                        <span class="stat-value stat-incomplete">${stats.incomplete}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Quality</span>
                        <span class="stat-value">${stats.percentage}%</span>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Data Completeness</span>
                        <span>${stats.percentage}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${progressClass}" style="width: ${stats.percentage}%">
                            ${stats.percentage > 10 ? '<span class="progress-text">' + stats.complete + '/' + stats.total + '</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Calculate statistics for each table
     */
    function calculateStats(tableName) {
        let items, validateFn;

        switch(tableName) {
            case 'cellModels':
                items = DB.cellModels.list();
                validateFn = validateCellModel;
                break;
            case 'batteryPacks':
                items = DB.batteryPacks.list();
                validateFn = validateBatteryPack;
                break;
            case 'cars':
                items = DB.cars.list();
                validateFn = validateCar;
                break;
            default:
                return null;
        }

        const total = items.length;
        const complete = items.filter(item => validateFn(item).isComplete).length;
        const incomplete = total - complete;
        const percentage = total > 0 ? Math.round((complete / total) * 100) : 0;

        return { total, complete, incomplete, percentage };
    }

    /**
     * Update tab counters
     */
    function updateTabCounters() {
        document.getElementById('cars-counter').textContent = DB.cars.list().length;
        document.getElementById('batteryPacks-counter').textContent = DB.batteryPacks.list().length;
        document.getElementById('cellModels-counter').textContent = DB.cellModels.list().length;
        document.getElementById('carBatteryPacks-counter').textContent = DB.carBatteryPacks.list().length;
    }

    /**
     * Initialize the application
     */
    function init() {
        setupTabs();
        setupCellModels();
        setupBatteryPacks();
        setupCars();
        setupCarBatteryPacks();

        // Update counters and render initial view
        updateTabCounters();
        renderCars();
    }

    /**
     * Tab Switching Logic
     */
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                switchTab(tabName);
            });
        });
    }

    function switchTab(tabName) {
        currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.toggle('active', section.id === `${tabName}-section`);
        });

        // Render the appropriate content
        switch(tabName) {
            case 'cellModels':
                renderCellModels();
                break;
            case 'batteryPacks':
                renderBatteryPacks();
                break;
            case 'cars':
                renderCars();
                break;
            case 'carBatteryPacks':
                renderCarBatteryPacks();
                break;
        }
    }

    /**
     * CELL MODELS SECTION
     */
    function setupCellModels() {
        const addBtn = document.getElementById('add-cell-btn');
        const cancelBtn = document.getElementById('cancel-cell-btn');
        const closeBtn = document.getElementById('close-cell-modal');
        const modal = document.getElementById('cell-modal');
        const form = document.getElementById('cell-form-element');

        addBtn.addEventListener('click', () => {
            showCellForm();
        });

        cancelBtn.addEventListener('click', () => {
            hideCellForm();
        });

        closeBtn.addEventListener('click', () => {
            hideCellForm();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideCellForm();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hideCellForm();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCellModel();
        });
    }

    function renderCellModels() {
        const cells = DB.cellModels.list();
        const container = document.getElementById('cell-list');
        const stats = calculateStats('cellModels');

        if (cells.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No cell models yet. Add one to get started!</p></div>';
            return;
        }

        container.innerHTML = createStatsHTML(stats) + cells.map(cell => {
            const validation = validateCellModel(cell);
            const badgeHTML = createValidationBadge(validation);
            const logoHTML = getCellManufacturerLogoHTML(cell.manufacturer);

            return `
                <div class="data-item car-item ${validation.isComplete ? '' : 'incomplete'}">
                    ${logoHTML}
                    <div class="data-item-content">
                        <h3>${cell.manufacturer} ${cell.model} ${badgeHTML}</h3>
                        <p><strong>Chemistry:</strong> ${cell.chemistry || '<span class="missing">N/A</span>'}</p>
                        <p><strong>Voltage:</strong> ${cell.nominalVoltage ? cell.nominalVoltage + 'V' : '<span class="missing">N/A</span>'} |
                           <strong>Capacity:</strong> ${cell.nominalCapacityMah ? cell.nominalCapacityMah + 'mAh' : '<span class="missing">N/A</span>'}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-edit" onclick="editCellModel(${cell.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteCellModel(${cell.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function showCellForm(cell = null) {
        editingItem = cell;
        const modal = document.getElementById('cell-modal');
        const title = document.getElementById('cell-form-title');

        if (cell) {
            title.textContent = 'Edit Cell Model';
            document.getElementById('cell-id').value = cell.id;
            document.getElementById('cell-manufacturer').value = cell.manufacturer;
            document.getElementById('cell-model').value = cell.model;
            document.getElementById('cell-chemistry').value = cell.chemistry || '';
            document.getElementById('cell-voltage').value = cell.nominalVoltage || '';
            document.getElementById('cell-capacity').value = cell.nominalCapacityMah || '';
        } else {
            title.textContent = 'Add Cell Model';
            document.getElementById('cell-form-element').reset();
            document.getElementById('cell-id').value = '';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function hideCellForm() {
        const modal = document.getElementById('cell-modal');
        modal.classList.remove('active');
        document.getElementById('cell-form-element').reset();
        document.body.style.overflow = ''; // Restore scrolling
        editingItem = null;
    }

    function saveCellModel() {
        const id = document.getElementById('cell-id').value;
        const data = {
            manufacturer: document.getElementById('cell-manufacturer').value,
            model: document.getElementById('cell-model').value,
            chemistry: document.getElementById('cell-chemistry').value,
            nominalVoltage: parseFloat(document.getElementById('cell-voltage').value) || null,
            nominalCapacityMah: parseInt(document.getElementById('cell-capacity').value) || null
        };

        try {
            if (id) {
                DB.cellModels.update(parseInt(id), data);
            } else {
                DB.cellModels.create(data);
            }
            hideCellForm();
            updateTabCounters();
            renderCellModels();
            // Update battery pack dropdown if on that tab
            if (currentTab === 'batteryPacks') {
                populateCellModelDropdown();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    window.editCellModel = function(id) {
        const cell = DB.cellModels.get(id);
        if (cell) showCellForm(cell);
    };

    window.deleteCellModel = function(id) {
        if (confirm('Are you sure you want to delete this cell model?')) {
            try {
                DB.cellModels.remove(id);
                updateTabCounters();
                renderCellModels();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };

    /**
     * BATTERY PACKS SECTION
     */
    function setupBatteryPacks() {
        const addBtn = document.getElementById('add-pack-btn');
        const cancelBtn = document.getElementById('cancel-pack-btn');
        const closeBtn = document.getElementById('close-pack-modal');
        const modal = document.getElementById('pack-modal');
        const form = document.getElementById('pack-form-element');

        addBtn.addEventListener('click', () => {
            showPackForm();
        });

        cancelBtn.addEventListener('click', () => {
            hidePackForm();
        });

        closeBtn.addEventListener('click', () => {
            hidePackForm();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hidePackForm();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hidePackForm();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveBatteryPack();
        });
    }

    function renderBatteryPacks() {
        const packs = DB.batteryPacks.list();
        const container = document.getElementById('pack-list');
        const stats = calculateStats('batteryPacks');

        if (packs.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No battery packs yet. Add one to get started!</p></div>';
            return;
        }

        container.innerHTML = createStatsHTML(stats) + packs.map(pack => {
            const cellModel = DB.cellModels.get(pack.cellModelId);
            const cellName = cellModel ? `${cellModel.manufacturer} ${cellModel.model}` : '<span class="missing">Unknown</span>';
            const validation = validateBatteryPack(pack);
            const badgeHTML = createValidationBadge(validation);

            return `
                <div class="data-item ${validation.isComplete ? '' : 'incomplete'}">
                    <div class="data-item-content">
                        <h3>${pack.name} ${badgeHTML}</h3>
                        <p><strong>Capacity:</strong> ${pack.totalCapacityKwh}kWh | <strong>Cell:</strong> ${cellName}</p>
                        <p><strong>Config:</strong> ${pack.seriesCount || '<span class="missing">?</span>'}S ${pack.parallelCount || '<span class="missing">?</span>'}P |
                           <strong>Cells:</strong> ${pack.cellCount || '<span class="missing">N/A</span>'}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-edit" onclick="editBatteryPack(${pack.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteBatteryPack(${pack.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function showPackForm(pack = null) {
        populateCellModelDropdown();
        editingItem = pack;
        const modal = document.getElementById('pack-modal');
        const title = document.getElementById('pack-form-title');

        if (pack) {
            title.textContent = 'Edit Battery Pack';
            document.getElementById('pack-id').value = pack.id;
            document.getElementById('pack-name').value = pack.name;
            document.getElementById('pack-capacity').value = pack.totalCapacityKwh || '';
            document.getElementById('pack-series').value = pack.seriesCount || '';
            document.getElementById('pack-parallel').value = pack.parallelCount || '';
            document.getElementById('pack-cells').value = pack.cellCount || '';
            document.getElementById('pack-cell-model').value = pack.cellModelId || '';
        } else {
            title.textContent = 'Add Battery Pack';
            document.getElementById('pack-form-element').reset();
            document.getElementById('pack-id').value = '';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hidePackForm() {
        const modal = document.getElementById('pack-modal');
        modal.classList.remove('active');
        document.getElementById('pack-form-element').reset();
        document.body.style.overflow = '';
        editingItem = null;
    }

    function populateCellModelDropdown() {
        const cells = DB.cellModels.list();
        const select = document.getElementById('pack-cell-model');
        const currentValue = select.value;

        select.innerHTML = '<option value="">Select cell model...</option>' +
            cells.map(cell =>
                `<option value="${cell.id}">${cell.manufacturer} ${cell.model}</option>`
            ).join('');

        if (currentValue) {
            select.value = currentValue;
        }
    }

    function saveBatteryPack() {
        const id = document.getElementById('pack-id').value;
        const data = {
            name: document.getElementById('pack-name').value,
            totalCapacityKwh: parseFloat(document.getElementById('pack-capacity').value) || null,
            seriesCount: parseInt(document.getElementById('pack-series').value) || null,
            parallelCount: parseInt(document.getElementById('pack-parallel').value) || null,
            cellCount: parseInt(document.getElementById('pack-cells').value) || null,
            cellModelId: parseInt(document.getElementById('pack-cell-model').value) || null
        };

        try {
            if (id) {
                DB.batteryPacks.update(parseInt(id), data);
            } else {
                DB.batteryPacks.create(data);
            }
            hidePackForm();
            updateTabCounters();
            renderBatteryPacks();
            // Update relations dropdown if on that tab
            if (currentTab === 'carBatteryPacks') {
                populateRelationDropdowns();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    window.editBatteryPack = function(id) {
        const pack = DB.batteryPacks.get(id);
        if (pack) showPackForm(pack);
    };

    window.deleteBatteryPack = function(id) {
        if (confirm('Are you sure you want to delete this battery pack?')) {
            try {
                DB.batteryPacks.remove(id);
                updateTabCounters();
                renderBatteryPacks();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };

    /**
     * CARS SECTION
     */
    function setupCars() {
        const addBtn = document.getElementById('add-car-btn');
        const cancelBtn = document.getElementById('cancel-car-btn');
        const closeBtn = document.getElementById('close-car-modal');
        const modal = document.getElementById('car-modal');
        const form = document.getElementById('car-form-element');

        addBtn.addEventListener('click', () => {
            showCarForm();
        });

        cancelBtn.addEventListener('click', () => {
            hideCarForm();
        });

        closeBtn.addEventListener('click', () => {
            hideCarForm();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideCarForm();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hideCarForm();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCar();
        });
    }

    function renderCars() {
        const cars = DB.cars.list();
        const container = document.getElementById('car-list');
        const stats = calculateStats('cars');

        if (cars.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No cars yet. Add one to get started!</p></div>';
            return;
        }

        container.innerHTML = createStatsHTML(stats) + cars.map(car => {
            const validation = validateCar(car);
            const badgeHTML = createValidationBadge(validation);
            const trimText = car.trim ? ` <span class="car-trim">(${car.trim})</span>` : '';
            const yearStart = car.yearStart || '<span class="missing">?</span>';
            const yearEnd = car.yearEnd || '<span class="missing">Present</span>';
            const yearText = `${yearStart} - ${yearEnd}`;
            const logoHTML = getCarLogoHTML(car.brand);

            return `
                <div class="data-item car-item ${validation.isComplete ? '' : 'incomplete'}">
                    ${logoHTML}
                    <div class="data-item-content">
                        <h3 class="car-brand">${car.brand} ${badgeHTML}</h3>
                        <p class="car-model">${car.model}${trimText}</p>
                        <p><strong>Years:</strong> ${yearText}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-edit" onclick="editCar(${car.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteCar(${car.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function showCarForm(car = null) {
        editingItem = car;
        const modal = document.getElementById('car-modal');
        const title = document.getElementById('car-form-title');

        if (car) {
            title.textContent = 'Edit Car';
            document.getElementById('car-id').value = car.id;
            document.getElementById('car-brand').value = car.brand;
            document.getElementById('car-model').value = car.model;
            document.getElementById('car-trim').value = car.trim || '';
            document.getElementById('car-year-start').value = car.yearStart || '';
            document.getElementById('car-year-end').value = car.yearEnd || '';
        } else {
            title.textContent = 'Add Car';
            document.getElementById('car-form-element').reset();
            document.getElementById('car-id').value = '';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideCarForm() {
        const modal = document.getElementById('car-modal');
        modal.classList.remove('active');
        document.getElementById('car-form-element').reset();
        document.body.style.overflow = '';
        editingItem = null;
    }

    function saveCar() {
        const id = document.getElementById('car-id').value;
        const data = {
            brand: document.getElementById('car-brand').value,
            model: document.getElementById('car-model').value,
            trim: document.getElementById('car-trim').value || null,
            yearStart: parseInt(document.getElementById('car-year-start').value) || null,
            yearEnd: parseInt(document.getElementById('car-year-end').value) || null
        };

        try {
            if (id) {
                DB.cars.update(parseInt(id), data);
            } else {
                DB.cars.create(data);
            }
            hideCarForm();
            updateTabCounters();
            renderCars();
            // Update relations dropdown if on that tab
            if (currentTab === 'carBatteryPacks') {
                populateRelationDropdowns();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    window.editCar = function(id) {
        const car = DB.cars.get(id);
        if (car) showCarForm(car);
    };

    window.deleteCar = function(id) {
        if (confirm('Are you sure you want to delete this car?')) {
            try {
                DB.cars.remove(id);
                updateTabCounters();
                renderCars();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };

    /**
     * CAR-BATTERY PACKS RELATIONS SECTION
     */
    function setupCarBatteryPacks() {
        const addBtn = document.getElementById('add-relation-btn');
        const cancelBtn = document.getElementById('cancel-relation-btn');
        const closeBtn = document.getElementById('close-relation-modal');
        const modal = document.getElementById('relation-modal');
        const form = document.getElementById('relation-form-element');

        addBtn.addEventListener('click', () => {
            showRelationForm();
        });

        cancelBtn.addEventListener('click', () => {
            hideRelationForm();
        });

        closeBtn.addEventListener('click', () => {
            hideRelationForm();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideRelationForm();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hideRelationForm();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveRelation();
        });
    }

    function renderCarBatteryPacks() {
        const relations = DB.carBatteryPacks.list();
        const container = document.getElementById('relation-list');

        if (relations.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No relations yet. Add one to get started!</p></div>';
            return;
        }

        container.innerHTML = relations.map(rel => {
            const car = DB.cars.get(rel.carId);
            const pack = DB.batteryPacks.get(rel.batteryPackId);

            const carName = car ? `${car.brand} ${car.model}${car.trim ? ' (' + car.trim + ')' : ''}` : 'Unknown Car';
            const packName = pack ? pack.name : 'Unknown Pack';

            return `
                <div class="data-item">
                    <div class="data-item-content">
                        <h3>${carName} ↔ ${packName}</h3>
                        <p><strong>Car:</strong> ${carName}</p>
                        <p><strong>Battery Pack:</strong> ${packName} ${pack ? '(' + pack.totalCapacityKwh + 'kWh)' : ''}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-edit" onclick="editRelation(${rel.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteRelation(${rel.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function showRelationForm(relation = null) {
        populateRelationDropdowns();
        editingItem = relation;
        const modal = document.getElementById('relation-modal');
        const title = document.getElementById('relation-form-title');

        if (relation) {
            title.textContent = 'Edit Relation';
            document.getElementById('relation-id').value = relation.id;
            document.getElementById('relation-car').value = relation.carId || '';
            document.getElementById('relation-pack').value = relation.batteryPackId || '';
        } else {
            title.textContent = 'Add Car-Battery Relation';
            document.getElementById('relation-form-element').reset();
            document.getElementById('relation-id').value = '';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideRelationForm() {
        const modal = document.getElementById('relation-modal');
        modal.classList.remove('active');
        document.getElementById('relation-form-element').reset();
        document.body.style.overflow = '';
        editingItem = null;
    }

    function populateRelationDropdowns() {
        // Populate cars dropdown
        const cars = DB.cars.list();
        const carSelect = document.getElementById('relation-car');
        const currentCarValue = carSelect.value;

        carSelect.innerHTML = '<option value="">Select car...</option>' +
            cars.map(car => {
                const trimText = car.trim ? ` (${car.trim})` : '';
                return `<option value="${car.id}">${car.brand} ${car.model}${trimText}</option>`;
            }).join('');

        if (currentCarValue) {
            carSelect.value = currentCarValue;
        }

        // Populate battery packs dropdown
        const packs = DB.batteryPacks.list();
        const packSelect = document.getElementById('relation-pack');
        const currentPackValue = packSelect.value;

        packSelect.innerHTML = '<option value="">Select battery pack...</option>' +
            packs.map(pack =>
                `<option value="${pack.id}">${pack.name} (${pack.totalCapacityKwh}kWh)</option>`
            ).join('');

        if (currentPackValue) {
            packSelect.value = currentPackValue;
        }
    }

    function saveRelation() {
        const id = document.getElementById('relation-id').value;
        const data = {
            carId: parseInt(document.getElementById('relation-car').value) || null,
            batteryPackId: parseInt(document.getElementById('relation-pack').value) || null
        };

        try {
            if (id) {
                DB.carBatteryPacks.update(parseInt(id), data);
            } else {
                DB.carBatteryPacks.create(data);
            }
            hideRelationForm();
            updateTabCounters();
            renderCarBatteryPacks();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    window.editRelation = function(id) {
        const relation = DB.carBatteryPacks.get(id);
        if (relation) showRelationForm(relation);
    };

    window.deleteRelation = function(id) {
        if (confirm('Are you sure you want to delete this relation?')) {
            try {
                DB.carBatteryPacks.remove(id);
                updateTabCounters();
                renderCarBatteryPacks();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };

    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
