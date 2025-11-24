# ⚡ EV Battery Database Manager

A complete browser-only mini-application for managing electric vehicle battery data using localStorage. This application simulates the structure of a PostgreSQL/Supabase database and serves as a learning tool and future migration base.

## 📋 Overview

This application manages a simple relational database with the following structure:

### Database Schema

1. **cellModels** - Battery cell specifications
   - `id` (auto-increment)
   - `manufacturer` (e.g., "Panasonic", "LG")
   - `model` (e.g., "NCR18650B")
   - `chemistry` (e.g., "Li-ION", "Ni-MH")
   - `nominalVoltage` (in Volts)
   - `nominalCapacityMah` (in mAh)

2. **batteryPacks** - Complete battery pack configurations
   - `id` (auto-increment)
   - `name` (descriptive name)
   - `totalCapacityKwh` (total energy capacity)
   - `seriesCount` (cells in series)
   - `parallelCount` (cells in parallel)
   - `cellCount` (total number of cells)
   - `cellModelId` (FK → cellModels.id)

3. **cars** - Electric vehicles
   - `id` (auto-increment)
   - `brand` (e.g., "Tesla", "BMW")
   - `model` (e.g., "Model 3", "i3")
   - `trim` (variant/trim level)
   - `yearStart` (production start year)
   - `yearEnd` (production end year)

4. **carBatteryPacks** - Many-to-many relationship
   - `id` (auto-increment)
   - `carId` (FK → cars.id)
   - `batteryPackId` (FK → batteryPacks.id)

## 🚀 Getting Started

### Installation

No installation required! Simply open [index.html](index.html) in any modern web browser.

```bash
# Just open the file in your browser
open index.html
# or double-click index.html in your file explorer
```

### Initial Data

The application comes pre-loaded with real data from your Excel file (DB_ParaFer.xlsx):
- 22 cell models (Panasonic, LG, Samsung, GS Yuasa, etc.)
- 21 battery pack configurations
- 28 electric vehicles (Tesla, BMW, Toyota, Nissan, etc.)
- 28 car-battery pack relationships

## 📁 File Structure

```
battery-master/
├── index.html          # Main HTML structure
├── style.css           # Minimal, clean styling
├── db.js               # LocalStorage database module
├── app.js              # UI logic and event handling
├── DB_ParaFer.xlsx     # Source data (Excel)
└── README.md           # This file
```

## 🏗️ Architecture

### db.js - Database Module

The database layer provides:

- **CRUD Operations**: `list()`, `get(id)`, `create(data)`, `update(id, data)`, `remove(id)`
- **Auto-increment IDs**: Automatic ID generation for all tables
- **Foreign Key Validation**: Ensures referential integrity
- **Cascade Prevention**: Prevents deletion of records with dependencies
- **LocalStorage Persistence**: All data stored in browser localStorage

Example usage:
```javascript
// Create a new cell model
DB.cellModels.create({
    manufacturer: "Panasonic",
    model: "NCR18650B",
    chemistry: "Li-ION",
    nominalVoltage: 3.6,
    nominalCapacityMah: 3350
});

// List all battery packs
const packs = DB.batteryPacks.list();

// Get a specific car
const car = DB.cars.get(5);

// Update a record
DB.cars.update(5, { yearEnd: 2024 });

// Delete a record (with FK validation)
DB.cellModels.remove(1); // Will fail if referenced by battery packs
```

### app.js - UI Logic

Handles all user interactions:
- Tab navigation between sections
- Dynamic rendering of data lists
- Form handling (create/edit modes)
- Delete confirmations
- Dropdown population for foreign key selects
- Smooth scrolling and UX polish

### style.css - Styling

Minimalistic, modern design:
- Clean card-based layout
- Responsive design (mobile-friendly)
- Color-coded actions (blue=primary, yellow=edit, red=delete)
- Smooth transitions and hover effects
- Readable typography

## 🎯 Features

### 1. Cell Models Management
- Add/Edit/Delete cell specifications
- View manufacturer, model, chemistry, voltage, capacity
- FK validation prevents deletion if used by battery packs

### 2. Battery Packs Management
- Create battery pack configurations
- Link to specific cell models via dropdown
- Optional fields for series/parallel/cell count
- View total capacity in kWh

### 3. Cars Management
- Add electric vehicles with brand, model, trim
- Specify production year ranges
- Simple, clean interface

### 4. Car-Battery Relations
- Many-to-many relationship management
- Link cars to their battery packs
- View complete associations
- Dropdown selects for easy FK entry

## 🔧 Utility Functions

```javascript
// Export all data to JSON
const data = DB.export();
console.log(data);

// Reset database (clears and reloads initial data)
DB.reset();
```

## 📊 Data Flow

```
User Action (UI)
    ↓
Event Handler (app.js)
    ↓
CRUD Operation (db.js)
    ↓
Validation (FK checks)
    ↓
LocalStorage Update
    ↓
Re-render UI (app.js)
```

## 🎓 Learning Goals

This application helps you:

1. **Understand Relational Models**
   - Primary keys (auto-increment IDs)
   - Foreign keys (references between tables)
   - Many-to-many relationships (junction table)
   - Referential integrity

2. **Learn CRUD Operations**
   - Create: Add new records
   - Read: List and get records
   - Update: Modify existing records
   - Delete: Remove records with validation

3. **Explore Client-Side Storage**
   - localStorage API
   - JSON serialization
   - Data persistence

4. **Prepare for Migration**
   - Schema matches PostgreSQL structure
   - Ready for Supabase migration
   - Easy to add SQL constraints later

## 🚀 Future Migration to Supabase

This local structure directly maps to PostgreSQL/Supabase:

```sql
-- Cell Models table
CREATE TABLE cell_models (
    id SERIAL PRIMARY KEY,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    chemistry TEXT,
    nominal_voltage DECIMAL(4,2),
    nominal_capacity_mah INTEGER
);

-- Battery Packs table
CREATE TABLE battery_packs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    total_capacity_kwh DECIMAL(6,2),
    series_count INTEGER,
    parallel_count INTEGER,
    cell_count INTEGER,
    cell_model_id INTEGER REFERENCES cell_models(id)
);

-- Cars table
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT,
    year_start INTEGER,
    year_end INTEGER
);

-- Car-Battery Packs junction table
CREATE TABLE car_battery_packs (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    battery_pack_id INTEGER REFERENCES battery_packs(id) ON DELETE CASCADE
);
```

## 🔍 Browser DevTools

Open browser console to interact with the database directly:

```javascript
// View all data
DB.export()

// Query specific tables
DB.cellModels.list()
DB.batteryPacks.get(1)

// Check relationships
DB.carBatteryPacks.getByCarId(5)

// Reset database
DB.reset()
```

## 🐛 Error Handling

The application includes comprehensive error handling:

- **FK Validation**: Cannot delete records with dependencies
- **Missing References**: Cannot create records with invalid FKs
- **User Feedback**: Alert messages for all errors
- **Graceful Degradation**: Empty states for zero records

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💾 Data Persistence

Data is stored in `localStorage`:
- Persists across browser sessions
- Survives page refreshes
- Cleared only when:
  - localStorage is manually cleared
  - Browser cache is cleared
  - `DB.reset()` is called

## 🎨 Customization

Easy to extend:

1. **Add New Fields**: Update schema in `db.js` create/update methods
2. **Add New Tables**: Follow the pattern in `db.js`
3. **Styling**: Modify `style.css` (uses CSS variables for easy theming)
4. **UI Features**: Add new sections in `index.html` and handlers in `app.js`

## 📚 Next Steps

1. **Expand the Schema**: Add more fields (price, manufacturer details, etc.)
2. **Add Search/Filter**: Implement search functionality
3. **Export/Import**: Add JSON export/import features
4. **Charts/Graphs**: Visualize battery capacity distributions
5. **Migrate to Supabase**: Move to cloud PostgreSQL database

## 🤝 Contributing

This is a learning project. Feel free to:
- Add more data from the Excel file
- Implement additional features
- Improve the UI/UX
- Add data validation
- Create data visualizations

## 📄 License

Free to use for learning and personal projects.

---

**Made with ⚡ for electric vehicle battery research**
