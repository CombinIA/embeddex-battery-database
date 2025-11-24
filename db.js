/**
 * db.js - LocalStorage Database Module
 *
 * This module provides a simple relational database using localStorage.
 * It simulates PostgreSQL/Supabase structure for future migration.
 *
 * Architecture:
 * - Each table is stored as a separate localStorage key
 * - IDs are auto-incremented
 * - Foreign key relationships are validated
 * - CRUD operations: list(), get(id), create(data), update(id, data), remove(id)
 */

const DB = (function() {
    'use strict';

    // Table names
    const TABLES = {
        cellModels: 'cellModels',
        batteryPacks: 'batteryPacks',
        cars: 'cars',
        carBatteryPacks: 'carBatteryPacks'
    };

    // Initialize database with initial data from Excel file
    function initDB() {
        // Check if database already exists
        if (!localStorage.getItem(TABLES.cellModels)) {
            // Load initial data
            loadInitialData();
        }
    }

    /**
     * Load initial data from the Excel file (DB_ParaFer.xlsx)
     * This data has been pre-processed from the Excel sheets
     */
    function loadInitialData() {
        console.log('Loading initial data into database...');

        // Initial cell models data
        const cellModelsData = [
            { manufacturer: "Shenzhen Starax Energy Technology", model: "S28(B28)", chemistry: "Li-ION", nominalVoltage: 3.63, nominalCapacityMah: 55000 },
            { manufacturer: "LG", model: "E63", chemistry: "Li-iON", nominalVoltage: 3.6, nominalCapacityMah: 64800 },
            { manufacturer: "Panasonic", model: "NCR18650B", chemistry: "Li-ION", nominalVoltage: 3.6, nominalCapacityMah: 3350 },
            { manufacturer: "LG", model: "INR21700-M50", chemistry: "Li-ION", nominalVoltage: 3.63, nominalCapacityMah: null },
            { manufacturer: "Panasonic", model: "NCR21700", chemistry: "Li-ION", nominalVoltage: 3.6, nominalCapacityMah: 5000 },
            { manufacturer: "Panasonic", model: "Prismatic PHEV2 - 22Ah", chemistry: "Li-ION", nominalVoltage: 3.6, nominalCapacityMah: 22000 },
            { manufacturer: "Panasonic", model: "Prismatic PHEV2 - 25Ah", chemistry: "Li-ION", nominalVoltage: 3.6, nominalCapacityMah: 25000 },
            { manufacturer: "Panasonic", model: "Prismatic PHEV2 - 51Ah", chemistry: "Li-ION", nominalVoltage: 3.7, nominalCapacityMah: 51000 },
            { manufacturer: "Ennocar", model: "EC-H-Series-INS-G2-100.8", chemistry: "Ni-MH", nominalVoltage: 14.4, nominalCapacityMah: 6500 },
            { manufacturer: "Ennocar", model: "EC-T-SERIES-SP-AQUA-7.2V", chemistry: "Ni-MH", nominalVoltage: 7.2, nominalCapacityMah: 6500 },
            { manufacturer: "AESC", model: "32,5Ah Pouch", chemistry: "Li-ION", nominalVoltage: 3.8, nominalCapacityMah: 65000 },
            { manufacturer: "AESC", model: "43Ah Pouch", chemistry: "Li-ION", nominalVoltage: 3.7, nominalCapacityMah: 86000 },
            { manufacturer: "GS Yuasa", model: "LEV40", chemistry: "Li-ION", nominalVoltage: 3.75, nominalCapacityMah: 40000 },
            { manufacturer: "GS Yuasa", model: "LEV40N", chemistry: "Li-ION", nominalVoltage: 3.75, nominalCapacityMah: 40000 },
            { manufacturer: "GS Yuasa", model: "LEV50", chemistry: "Li-ION", nominalVoltage: 3.75, nominalCapacityMah: 50000 },
            { manufacturer: "GS Yuasa", model: "LEV50N", chemistry: "Li-ION", nominalVoltage: 3.75, nominalCapacityMah: 40000 },
            { manufacturer: "Samsung SDI", model: "Prismatic 60Ah", chemistry: "Li-ION", nominalVoltage: 3.68, nominalCapacityMah: 60000 },
            { manufacturer: "Samsung SDI", model: "Prismatic 94Ah", chemistry: "Li-ION", nominalVoltage: 3.68, nominalCapacityMah: 94000 },
            { manufacturer: "Samsung SDI", model: "Prismatic 120Ah", chemistry: "Li-ION", nominalVoltage: 3.68, nominalCapacityMah: 120000 },
            { manufacturer: "Toyota", model: "NP2.0", chemistry: "Ni-MH", nominalVoltage: 7.2, nominalCapacityMah: 6500 },
            { manufacturer: "Panasonic", model: "NCR2170A", chemistry: "Li-ION", nominalVoltage: 3.6, nominalCapacityMah: 4800 },
            { manufacturer: "Panasonic", model: "NCR18650GA", chemistry: "Li-ION", nominalVoltage: 3.6, nominalCapacityMah: 3500 }
        ];

        // Create cell models
        cellModelsData.forEach(cell => {
            cellModels.create(cell);
        });

        // Initial cars data (sample from Excel)
        const carsData = [
            { brand: "BMW", model: "i3", trim: null, yearStart: 2013, yearEnd: 2016 },
            { brand: "BMW", model: "i3", trim: null, yearStart: 2016, yearEnd: 2018 },
            { brand: "BMW", model: "i3s", trim: null, yearStart: 2017, yearEnd: 2018 },
            { brand: "Citroën", model: "C-zero", trim: null, yearStart: 2010, yearEnd: 2013 },
            { brand: "Citroën", model: "C-zero", trim: null, yearStart: 2013, yearEnd: 2016 },
            { brand: "Citroën", model: "C-zero", trim: null, yearStart: 2016, yearEnd: 2020 },
            { brand: "Hyundai", model: "Kona", trim: "64kWh", yearStart: 2017, yearEnd: 2023 },
            { brand: "Hyundai", model: "Kona", trim: "39.2kWh", yearStart: 2017, yearEnd: 2023 },
            { brand: "Mitsubishi", model: "i-MiEV", trim: null, yearStart: 2010, yearEnd: 2013 },
            { brand: "Mitsubishi", model: "i-MiEV", trim: null, yearStart: 2013, yearEnd: 2016 },
            { brand: "Mitsubishi", model: "i-MiEV", trim: null, yearStart: 2016, yearEnd: 2020 },
            { brand: "Mitsubishi", model: "Outlander PHEV", trim: null, yearStart: 2013, yearEnd: 2018 },
            { brand: "Mitsubishi", model: "Outlander PHEV", trim: null, yearStart: 2018, yearEnd: 2021 },
            { brand: "Mitsubishi", model: "Outlander PHEV", trim: null, yearStart: 2021, yearEnd: 2024 },
            { brand: "Nissan", model: "Leaf", trim: "24kWh", yearStart: 2010, yearEnd: 2016 },
            { brand: "Nissan", model: "Leaf", trim: "30kWh", yearStart: 2016, yearEnd: 2017 },
            { brand: "Peugeot", model: "iOn", trim: null, yearStart: 2010, yearEnd: 2013 },
            { brand: "Peugeot", model: "iOn", trim: null, yearStart: 2013, yearEnd: 2016 },
            { brand: "Peugeot", model: "iOn", trim: null, yearStart: 2016, yearEnd: 2020 },
            { brand: "Tesla", model: "Model 3", trim: "Long Range Performance", yearStart: 2019, yearEnd: 2020 },
            { brand: "Tesla", model: "Model 3", trim: "Standard Range Plus", yearStart: 2019, yearEnd: 2020 },
            { brand: "Tesla", model: "Model S", trim: "P85", yearStart: 2012, yearEnd: 2014 },
            { brand: "Tesla", model: "Model S", trim: "P100D", yearStart: 2016, yearEnd: 2019 },
            { brand: "Tesla", model: "Model X", trim: "P100D", yearStart: 2017, yearEnd: 2019 },
            { brand: "Toyota", model: "Prius", trim: null, yearStart: 2000, yearEnd: 2003 },
            { brand: "Toyota", model: "Prius", trim: null, yearStart: 2003, yearEnd: 2009 },
            { brand: "Toyota", model: "Prius PHEV", trim: null, yearStart: 2012, yearEnd: 2016 },
            { brand: "Toyota", model: "Prius PHEV", trim: null, yearStart: 2016, yearEnd: 2022 }
        ];

        // Create cars
        carsData.forEach(car => {
            cars.create(car);
        });

        // Initial battery packs data (sample from Excel)
        const batteryPacksData = [
            { name: "BMW i3 21.6kWh (Samsung 60Ah)", totalCapacityKwh: 21.6, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 17 },
            { name: "BMW i3 33.2kWh (Samsung 94Ah)", totalCapacityKwh: 33.2, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 18 },
            { name: "Citroën C-zero 16kWh (LEV50)", totalCapacityKwh: 16.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 15 },
            { name: "Citroën C-zero 16kWh (LEV50N)", totalCapacityKwh: 16.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 16 },
            { name: "Hyundai Kona 64kWh", totalCapacityKwh: 64.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 1 },
            { name: "Hyundai Kona 39.2kWh", totalCapacityKwh: 39.2, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 1 },
            { name: "Mitsubishi i-MiEV 16kWh (LEV50)", totalCapacityKwh: 16.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 15 },
            { name: "Mitsubishi i-MiEV 16kWh (LEV50N)", totalCapacityKwh: 16.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 16 },
            { name: "Mitsubishi Outlander 12kWh", totalCapacityKwh: 12.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 13 },
            { name: "Mitsubishi Outlander 13.8kWh", totalCapacityKwh: 13.8, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 14 },
            { name: "Mitsubishi Outlander 20kWh", totalCapacityKwh: 20.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 14 },
            { name: "Nissan Leaf 24kWh", totalCapacityKwh: 24.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 11 },
            { name: "Nissan Leaf 30kWh", totalCapacityKwh: 30.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 12 },
            { name: "Tesla Model 3 LR 78.8kWh", totalCapacityKwh: 78.8, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 21 },
            { name: "Tesla Model 3 SR 53.1kWh", totalCapacityKwh: 53.1, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 21 },
            { name: "Tesla Model S 85kWh", totalCapacityKwh: 85.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 3 },
            { name: "Tesla Model S 100kWh", totalCapacityKwh: 100.0, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 22 },
            { name: "Toyota Prius 1.78kWh", totalCapacityKwh: 1.78, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 20 },
            { name: "Toyota Prius 1.3kWh", totalCapacityKwh: 1.3, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 20 },
            { name: "Toyota Prius PHEV 5.2kWh", totalCapacityKwh: 5.2, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 6 },
            { name: "Toyota Prius PHEV 8.8kWh", totalCapacityKwh: 8.8, seriesCount: null, parallelCount: null, cellCount: null, cellModelId: 6 }
        ];

        // Create battery packs
        batteryPacksData.forEach(pack => {
            batteryPacks.create(pack);
        });

        // Create car-battery pack relationships
        const relations = [
            { carId: 1, batteryPackId: 1 },  // BMW i3 2013-2016 -> 21.6kWh
            { carId: 2, batteryPackId: 2 },  // BMW i3 2016-2018 -> 33.2kWh
            { carId: 3, batteryPackId: 2 },  // BMW i3s -> 33.2kWh
            { carId: 4, batteryPackId: 3 },  // Citroën C-zero 2010-2013 -> LEV50
            { carId: 5, batteryPackId: 4 },  // Citroën C-zero 2013-2016 -> LEV50N
            { carId: 6, batteryPackId: 4 },  // Citroën C-zero 2016-2020 -> LEV50N
            { carId: 7, batteryPackId: 5 },  // Hyundai Kona 64kWh
            { carId: 8, batteryPackId: 6 },  // Hyundai Kona 39.2kWh
            { carId: 9, batteryPackId: 7 },  // Mitsubishi i-MiEV 2010-2013
            { carId: 10, batteryPackId: 8 }, // Mitsubishi i-MiEV 2013-2016
            { carId: 11, batteryPackId: 8 }, // Mitsubishi i-MiEV 2016-2020
            { carId: 12, batteryPackId: 9 }, // Outlander 2013-2018
            { carId: 13, batteryPackId: 10 }, // Outlander 2018-2021
            { carId: 14, batteryPackId: 11 }, // Outlander 2021-2024
            { carId: 15, batteryPackId: 12 }, // Nissan Leaf 24kWh
            { carId: 16, batteryPackId: 13 }, // Nissan Leaf 30kWh
            { carId: 17, batteryPackId: 3 },  // Peugeot iOn 2010-2013
            { carId: 18, batteryPackId: 4 },  // Peugeot iOn 2013-2016
            { carId: 19, batteryPackId: 4 },  // Peugeot iOn 2016-2020
            { carId: 20, batteryPackId: 14 }, // Tesla Model 3 LR Performance
            { carId: 21, batteryPackId: 15 }, // Tesla Model 3 SR Plus
            { carId: 22, batteryPackId: 16 }, // Tesla Model S P85
            { carId: 23, batteryPackId: 17 }, // Tesla Model S P100D
            { carId: 24, batteryPackId: 17 }, // Tesla Model X P100D
            { carId: 25, batteryPackId: 18 }, // Toyota Prius 2000-2003
            { carId: 26, batteryPackId: 19 }, // Toyota Prius 2003-2009
            { carId: 27, batteryPackId: 20 }, // Toyota Prius PHEV 2012-2016
            { carId: 28, batteryPackId: 21 }  // Toyota Prius PHEV 2016-2022
        ];

        relations.forEach(rel => {
            carBatteryPacks.create(rel);
        });

        console.log('Initial data loaded successfully!');
    }

    // Helper: Get next auto-increment ID for a table
    function getNextId(tableName) {
        const items = getTable(tableName);
        if (items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    }

    // Helper: Get all records from a table
    function getTable(tableName) {
        const data = localStorage.getItem(tableName);
        return data ? JSON.parse(data) : [];
    }

    // Helper: Save table to localStorage
    function saveTable(tableName, data) {
        localStorage.setItem(tableName, JSON.stringify(data));
    }

    // Helper: Validate foreign key
    function validateFK(fkValue, referencedTable) {
        if (fkValue === null || fkValue === undefined) return true;
        const table = getTable(referencedTable);
        return table.some(item => item.id === fkValue);
    }

    /**
     * CRUD Operations for cellModels table
     */
    const cellModels = {
        list() {
            return getTable(TABLES.cellModels);
        },

        get(id) {
            const items = this.list();
            return items.find(item => item.id === id);
        },

        create(data) {
            const items = this.list();
            const newItem = {
                id: getNextId(TABLES.cellModels),
                manufacturer: data.manufacturer || '',
                model: data.model || '',
                chemistry: data.chemistry || '',
                nominalVoltage: data.nominalVoltage || null,
                nominalCapacityMah: data.nominalCapacityMah || null
            };
            items.push(newItem);
            saveTable(TABLES.cellModels, items);
            return newItem;
        },

        update(id, data) {
            const items = this.list();
            const index = items.findIndex(item => item.id === id);
            if (index === -1) throw new Error('Cell model not found');

            items[index] = {
                ...items[index],
                manufacturer: data.manufacturer !== undefined ? data.manufacturer : items[index].manufacturer,
                model: data.model !== undefined ? data.model : items[index].model,
                chemistry: data.chemistry !== undefined ? data.chemistry : items[index].chemistry,
                nominalVoltage: data.nominalVoltage !== undefined ? data.nominalVoltage : items[index].nominalVoltage,
                nominalCapacityMah: data.nominalCapacityMah !== undefined ? data.nominalCapacityMah : items[index].nominalCapacityMah
            };
            saveTable(TABLES.cellModels, items);
            return items[index];
        },

        remove(id) {
            // Check if cell model is referenced by any battery pack
            const packs = batteryPacks.list();
            if (packs.some(pack => pack.cellModelId === id)) {
                throw new Error('Cannot delete cell model: it is referenced by battery packs');
            }

            const items = this.list();
            const filtered = items.filter(item => item.id !== id);
            if (filtered.length === items.length) throw new Error('Cell model not found');
            saveTable(TABLES.cellModels, filtered);
            return true;
        }
    };

    /**
     * CRUD Operations for batteryPacks table
     */
    const batteryPacks = {
        list() {
            return getTable(TABLES.batteryPacks);
        },

        get(id) {
            const items = this.list();
            return items.find(item => item.id === id);
        },

        create(data) {
            // Validate FK: cellModelId
            if (!validateFK(data.cellModelId, TABLES.cellModels)) {
                throw new Error('Invalid cellModelId: cell model does not exist');
            }

            const items = this.list();
            const newItem = {
                id: getNextId(TABLES.batteryPacks),
                name: data.name || '',
                totalCapacityKwh: data.totalCapacityKwh || null,
                seriesCount: data.seriesCount || null,
                parallelCount: data.parallelCount || null,
                cellCount: data.cellCount || null,
                cellModelId: data.cellModelId || null
            };
            items.push(newItem);
            saveTable(TABLES.batteryPacks, items);
            return newItem;
        },

        update(id, data) {
            // Validate FK if cellModelId is being updated
            if (data.cellModelId !== undefined && !validateFK(data.cellModelId, TABLES.cellModels)) {
                throw new Error('Invalid cellModelId: cell model does not exist');
            }

            const items = this.list();
            const index = items.findIndex(item => item.id === id);
            if (index === -1) throw new Error('Battery pack not found');

            items[index] = {
                ...items[index],
                name: data.name !== undefined ? data.name : items[index].name,
                totalCapacityKwh: data.totalCapacityKwh !== undefined ? data.totalCapacityKwh : items[index].totalCapacityKwh,
                seriesCount: data.seriesCount !== undefined ? data.seriesCount : items[index].seriesCount,
                parallelCount: data.parallelCount !== undefined ? data.parallelCount : items[index].parallelCount,
                cellCount: data.cellCount !== undefined ? data.cellCount : items[index].cellCount,
                cellModelId: data.cellModelId !== undefined ? data.cellModelId : items[index].cellModelId
            };
            saveTable(TABLES.batteryPacks, items);
            return items[index];
        },

        remove(id) {
            // Check if battery pack is referenced by any car-battery relation
            const relations = carBatteryPacks.list();
            if (relations.some(rel => rel.batteryPackId === id)) {
                throw new Error('Cannot delete battery pack: it is referenced by car-battery relations');
            }

            const items = this.list();
            const filtered = items.filter(item => item.id !== id);
            if (filtered.length === items.length) throw new Error('Battery pack not found');
            saveTable(TABLES.batteryPacks, filtered);
            return true;
        }
    };

    /**
     * CRUD Operations for cars table
     */
    const cars = {
        list() {
            return getTable(TABLES.cars);
        },

        get(id) {
            const items = this.list();
            return items.find(item => item.id === id);
        },

        create(data) {
            const items = this.list();
            const newItem = {
                id: getNextId(TABLES.cars),
                brand: data.brand || '',
                model: data.model || '',
                trim: data.trim || null,
                yearStart: data.yearStart || null,
                yearEnd: data.yearEnd || null
            };
            items.push(newItem);
            saveTable(TABLES.cars, items);
            return newItem;
        },

        update(id, data) {
            const items = this.list();
            const index = items.findIndex(item => item.id === id);
            if (index === -1) throw new Error('Car not found');

            items[index] = {
                ...items[index],
                brand: data.brand !== undefined ? data.brand : items[index].brand,
                model: data.model !== undefined ? data.model : items[index].model,
                trim: data.trim !== undefined ? data.trim : items[index].trim,
                yearStart: data.yearStart !== undefined ? data.yearStart : items[index].yearStart,
                yearEnd: data.yearEnd !== undefined ? data.yearEnd : items[index].yearEnd
            };
            saveTable(TABLES.cars, items);
            return items[index];
        },

        remove(id) {
            // Check if car is referenced by any car-battery relation
            const relations = carBatteryPacks.list();
            if (relations.some(rel => rel.carId === id)) {
                throw new Error('Cannot delete car: it is referenced by car-battery relations');
            }

            const items = this.list();
            const filtered = items.filter(item => item.id !== id);
            if (filtered.length === items.length) throw new Error('Car not found');
            saveTable(TABLES.cars, filtered);
            return true;
        }
    };

    /**
     * CRUD Operations for carBatteryPacks (many-to-many relationship)
     */
    const carBatteryPacks = {
        list() {
            return getTable(TABLES.carBatteryPacks);
        },

        get(id) {
            const items = this.list();
            return items.find(item => item.id === id);
        },

        create(data) {
            // Validate FKs
            if (!validateFK(data.carId, TABLES.cars)) {
                throw new Error('Invalid carId: car does not exist');
            }
            if (!validateFK(data.batteryPackId, TABLES.batteryPacks)) {
                throw new Error('Invalid batteryPackId: battery pack does not exist');
            }

            const items = this.list();
            const newItem = {
                id: getNextId(TABLES.carBatteryPacks),
                carId: data.carId,
                batteryPackId: data.batteryPackId
            };
            items.push(newItem);
            saveTable(TABLES.carBatteryPacks, items);
            return newItem;
        },

        update(id, data) {
            // Validate FKs if they're being updated
            if (data.carId !== undefined && !validateFK(data.carId, TABLES.cars)) {
                throw new Error('Invalid carId: car does not exist');
            }
            if (data.batteryPackId !== undefined && !validateFK(data.batteryPackId, TABLES.batteryPacks)) {
                throw new Error('Invalid batteryPackId: battery pack does not exist');
            }

            const items = this.list();
            const index = items.findIndex(item => item.id === id);
            if (index === -1) throw new Error('Relation not found');

            items[index] = {
                ...items[index],
                carId: data.carId !== undefined ? data.carId : items[index].carId,
                batteryPackId: data.batteryPackId !== undefined ? data.batteryPackId : items[index].batteryPackId
            };
            saveTable(TABLES.carBatteryPacks, items);
            return items[index];
        },

        remove(id) {
            const items = this.list();
            const filtered = items.filter(item => item.id !== id);
            if (filtered.length === items.length) throw new Error('Relation not found');
            saveTable(TABLES.carBatteryPacks, filtered);
            return true;
        },

        // Helper method to get all battery packs for a car
        getByCarId(carId) {
            return this.list().filter(item => item.carId === carId);
        },

        // Helper method to get all cars for a battery pack
        getByBatteryPackId(batteryPackId) {
            return this.list().filter(item => item.batteryPackId === batteryPackId);
        }
    };

    // Initialize database on load
    initDB();

    // Public API
    return {
        cellModels,
        batteryPacks,
        cars,
        carBatteryPacks,
        // Utility methods
        reset() {
            Object.values(TABLES).forEach(table => {
                localStorage.removeItem(table);
            });
            initDB();
        },
        export() {
            return {
                cellModels: cellModels.list(),
                batteryPacks: batteryPacks.list(),
                cars: cars.list(),
                carBatteryPacks: carBatteryPacks.list()
            };
        }
    };
})();

// Log initial state
console.log('Database initialized:', DB.export());
