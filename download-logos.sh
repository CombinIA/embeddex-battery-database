#!/bin/bash

# Script to download missing brand logos for the EV Battery Database
# This downloads logos from Wikimedia Commons and other reliable sources

LOGOS_DIR="assets/logos"
CARS_DIR="$LOGOS_DIR/cars"
CELLS_DIR="$LOGOS_DIR/cells"

# Create directories if they don't exist
mkdir -p "$CARS_DIR"
mkdir -p "$CELLS_DIR"

echo "📥 Downloading missing brand logos..."
echo ""

# Cell Manufacturer Logos
echo "🔋 Cell Manufacturers:"

# LG (LG Energy Solution)
if [ ! -f "$CELLS_DIR/lg.png" ]; then
    echo "  - Downloading LG logo..."
    curl -L -o "$CELLS_DIR/lg.png" \
        -A "Mozilla/5.0" \
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/512px-LG_logo_%282015%29.svg.png" 2>/dev/null
    if [ -f "$CELLS_DIR/lg.png" ] && [ -s "$CELLS_DIR/lg.png" ]; then
        echo "    ✓ LG logo downloaded"
    else
        echo "    ⚠️  Failed to download LG logo"
        rm -f "$CELLS_DIR/lg.png"
    fi
fi

# Panasonic
if [ ! -f "$CELLS_DIR/panasonic.png" ]; then
    echo "  - Downloading Panasonic logo..."
    curl -L -o "$CELLS_DIR/panasonic.png" \
        -A "Mozilla/5.0" \
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Panasonic_logo_%28Blue%29.svg/512px-Panasonic_logo_%28Blue%29.svg.png" 2>/dev/null
    if [ -f "$CELLS_DIR/panasonic.png" ] && [ -s "$CELLS_DIR/panasonic.png" ]; then
        echo "    ✓ Panasonic logo downloaded"
    else
        echo "    ⚠️  Failed to download Panasonic logo"
        rm -f "$CELLS_DIR/panasonic.png"
    fi
fi

# GS Yuasa
if [ ! -f "$CELLS_DIR/gs-yuasa.png" ]; then
    echo "  - Downloading GS Yuasa logo..."
    curl -L -o "$CELLS_DIR/gs-yuasa.png" \
        -A "Mozilla/5.0" \
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/GS_Yuasa_logo.svg/512px-GS_Yuasa_logo.svg.png" 2>/dev/null
    if [ -f "$CELLS_DIR/gs-yuasa.png" ] && [ -s "$CELLS_DIR/gs-yuasa.png" ]; then
        echo "    ✓ GS Yuasa logo downloaded"
    else
        echo "    ⚠️  Failed to download GS Yuasa logo"
        rm -f "$CELLS_DIR/gs-yuasa.png"
    fi
fi

echo ""
echo "✅ Logo download complete!"
echo ""
echo "Downloaded logos are stored in:"
echo "  - Car brands: $CARS_DIR"
echo "  - Cell manufacturers: $CELLS_DIR"
echo ""
echo "Current logo inventory:"
echo "  - Car logos: $(ls -1 "$CARS_DIR" 2>/dev/null | grep -v .DS_Store | wc -l | xargs)"
echo "  - Cell logos: $(ls -1 "$CELLS_DIR" 2>/dev/null | grep -v .DS_Store | wc -l | xargs)"
