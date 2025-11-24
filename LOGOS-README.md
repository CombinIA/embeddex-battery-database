# Brand Logos Inventory

This document lists all the brand logos available in the EV Battery Database project.

## 📁 Directory Structure

```
assets/logos/
├── cars/       # Car manufacturer logos
└── cells/      # Battery cell manufacturer logos
```

## 🚗 Car Brand Logos (19 brands)

All car brand logos are stored as PNG files in `assets/logos/cars/`:

1. **Audi** - audi.png
2. **BMW** - bmw.png
3. **Chevrolet** - chevrolet.png
4. **Citroën** - citroen.png
5. **Ford** - ford.png
6. **Honda** - honda.png
7. **Hyundai** - hyundai.png
8. **Kia** - kia.png
9. **Mazda** - mazda.png
10. **Mercedes-Benz** - mercedes-benz.png
11. **Mitsubishi** - mitsubishi.png
12. **Nissan** - nissan.png
13. **Peugeot** - peugeot.png
14. **Porsche** - porsche.png
15. **Renault** - renault.png
16. **Tesla** - tesla.png
17. **Toyota** - toyota.png
18. **Volkswagen** - volkswagen.png
19. **Volvo** - volvo.png

## 🔋 Battery Cell Manufacturer Logos (5 brands)

All cell manufacturer logos are stored as PNG files in `assets/logos/cells/`:

1. **GS Yuasa** - gs-yuasa.png
2. **LG** - lg.png
3. **Panasonic** - panasonic.png
4. **Samsung SDI** - samsung.png
5. **Toyota** - toyota.png

## 📥 Download Script

The `download-logos.sh` script can be used to re-download missing logos:

```bash
./download-logos.sh
```

This script:
- Checks for missing logos
- Downloads them from Wikimedia Commons
- Provides a summary of downloaded logos
- Shows current logo inventory

## 🎨 Usage in Code

Logos are referenced in [app.js](app.js):

### Car Logos
```javascript
const carBrandLogos = {
    'BMW': 'assets/logos/cars/bmw.png',
    'Tesla': 'assets/logos/cars/tesla.png',
    // ... etc
};
```

### Cell Manufacturer Logos
```javascript
const cellManufacturerLogos = {
    'LG': 'assets/logos/cells/lg.png',
    'Panasonic': 'assets/logos/cells/panasonic.png',
    // ... etc
};
```

## 📝 Notes

- All logos are PNG format for web compatibility
- Logos are downloaded from Wikimedia Commons (public domain/Creative Commons licensed)
- The app includes fallback placeholders for brands without logos
- Logo images are optimized for web display (512px width)

## ✅ Status

All required logos are now downloaded and available locally. No external dependencies required for displaying brand logos.
