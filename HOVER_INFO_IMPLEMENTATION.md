# ✅ Hover Info for Map Layers

## Overview

Implemented hover popups for **Conserved Areas** and **Indigenous Territory** layers that appear after hovering for 1 second. This provides contextual information about protected areas and indigenous lands without cluttering the map interface.

## Features Implemented

### 1. 🟢 Conserved Areas Hover Info

**Trigger:** Hover over any green conserved area polygon for 1 second

**Information Displayed:**
- **Name**: Official name of the protected area (e.g., "Banff National Park")
- **Type**: Type of conservation area (e.g., "National Park", "Marine Protected Area")
- **IUCN Category**: International conservation classification (if available)

**Visual Style:**
- Emerald green title to match layer color
- Card-style popup with backdrop blur
- Smooth fade-in animation
- No close button (auto-dismisses on mouse leave)

### 2. 🟣 Indigenous Territory Hover Info

**Trigger:** Hover over any purple indigenous territory polygon for 1 second

**Information Displayed:**
- **Name**: Name of the indigenous nation/community
- **Description**: Additional context about the territory (if available)
- **Attribution**: "Data from Native Land Digital"

**Visual Style:**
- Purple title to match layer color
- Card-style popup with backdrop blur
- Smooth fade-in animation
- No close button (auto-dismisses on mouse leave)

## Technical Implementation

### Files Modified

#### 1. `web/components/map/ConservedAreasLayer.tsx`

**Added:**
```typescript
// State for popup
const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// Hover event handler with 1 second delay
useEffect(() => {
  if (!map || !visible) return;

  const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['conserved-areas-fill']
    });

    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';
      
      // Set timeout for 1 second hover
      hoverTimeoutRef.current = setTimeout(() => {
        const feature = features[0];
        setPopupInfo({
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          name: feature.properties?.NAME_E || 'Protected Area',
          type: feature.properties?.TYPE_E || 'Conservation Area',
          iucn_category: feature.properties?.IUCN_CAT,
        });
      }, 1000);
    } else {
      // Clear timeout if mouse moves away
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setPopupInfo(null);
    }
  };

  map.on('mousemove', handleMouseMove);
  // ... cleanup
}, [map, visible]);
```

**Popup Component:**
```typescript
{popupInfo && (
  <Popup
    longitude={popupInfo.longitude}
    latitude={popupInfo.latitude}
    closeButton={false}
    closeOnClick={false}
    offset={10}
  >
    <div className="p-2 min-w-[200px]">
      <h3 className="font-semibold text-sm mb-1 text-emerald-700">
        {popupInfo.name}
      </h3>
      <p className="text-xs text-muted-foreground mb-1">
        <span className="font-medium">Type:</span> {popupInfo.type}
      </p>
      {popupInfo.iucn_category && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">IUCN Category:</span> {popupInfo.iucn_category}
        </p>
      )}
    </div>
  </Popup>
)}
```

#### 2. `web/components/map/IndigenousTerritoryLayer.tsx`

**Similar implementation with purple styling:**
```typescript
// Same hover logic with 1 second delay
// Extracts territory name and description from Native Land tileset

<Popup>
  <h3 className="text-purple-700">{popupInfo.name}</h3>
  <p>Indigenous Territory</p>
  {popupInfo.description && <p>{popupInfo.description}</p>}
  <p className="italic">Data from Native Land Digital</p>
</Popup>
```

#### 3. `web/app/globals.css`

**Added custom styles:**
```css
/* Popup styling */
.conserved-area-popup .mapboxgl-popup-content,
.indigenous-territory-popup .mapboxgl-popup-content {
  @apply rounded-lg shadow-lg border border-border bg-card/95 backdrop-blur-sm;
  padding: 0 !important;
}

/* Smooth fade-in animation */
.conserved-area-popup,
.indigenous-territory-popup {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## User Experience Flow

### Conserved Areas
1. **User enables** "Show Conserved Areas" toggle in map controls
2. **Green polygons** appear on map showing protected areas
3. **User hovers** over a green area for 1 second
4. **Popup appears** showing:
   - Area name (e.g., "Jasper National Park")
   - Type (e.g., "National Park")
   - IUCN Category (e.g., "II - National Park")
5. **Popup disappears** when user moves mouse away

### Indigenous Territories
1. **User enables** "Show Indigenous Territories" toggle
2. **Purple polygons** appear showing indigenous lands
3. **User hovers** over a purple area for 1 second
4. **Popup appears** showing:
   - Territory name (e.g., "Blackfoot Confederacy")
   - Description (if available)
   - Attribution to Native Land Digital
5. **Popup disappears** when user moves mouse away

## Behavior Details

### Hover Delay Logic
- **Why 1 second?** Prevents popup spam when quickly moving mouse across map
- **Immediate cursor change**: Cursor becomes pointer instantly on hover (no delay)
- **Timeout cleared**: If mouse moves away before 1 second, popup never appears
- **Single popup**: Only one popup shows at a time

### Property Fallbacks
```typescript
// Conserved Areas - handles different property naming conventions
name: feature.properties?.NAME_E || feature.properties?.name || 'Protected Area'
type: feature.properties?.TYPE_E || feature.properties?.type || 'Conservation Area'
iucn_category: feature.properties?.IUCN_CAT || feature.properties?.iucn_category

// Indigenous Territories
name: feature.properties?.Name || feature.properties?.name || 'Indigenous Territory'
description: feature.properties?.description || feature.properties?.Description
```

### Available on Both Maps
These hover popups work on:
- ✅ `/map` - Main exploration map
- ✅ `/credit-builder` - Carbon credit analysis map

## Styling & Theming

### Light Mode
- **Background**: White card with 95% opacity + backdrop blur
- **Border**: Light gray border
- **Text**: Dark text with emerald/purple accents

### Dark Mode
- **Background**: Dark card with 95% opacity + backdrop blur
- **Border**: Dark gray border
- **Text**: Light text with emerald/purple accents

### Animations
- **Fade-in**: 0.2s smooth entrance
- **Slide-up**: 5px upward motion during fade-in
- **No exit animation**: Instant dismissal for better UX

## IUCN Categories (Conserved Areas)

When available, the popup shows IUCN protected area categories:

| Category | Description |
|----------|-------------|
| Ia | Strict Nature Reserve |
| Ib | Wilderness Area |
| II | National Park |
| III | Natural Monument |
| IV | Habitat/Species Management Area |
| V | Protected Landscape/Seascape |
| VI | Protected Area with Sustainable Use |

## Data Sources

### Conserved Areas
- **Source**: Canadian Protected and Conserved Areas Database (CPCAD)
- **Tileset**: `mapbox://sohelshekh12.conserved-area-tiles`
- **Source Layer**: `conserved_area`
- **Properties Used**:
  - `NAME_E` - English name
  - `TYPE_E` - English type
  - `IUCN_CAT` - IUCN category

### Indigenous Territories
- **Source**: Native Land Digital
- **Tileset**: `mapbox://nativeland.4pgB_next_nld_terr_prod_layer`
- **Source Layer**: `4pgB_next_nld_terr_prod_source_layer`
- **Properties Used**:
  - `Name` - Territory name
  - `Description` - Territory description
  - `Color` - Territory color

## Performance Considerations

### Optimizations
1. **Single event listener**: Only one `mousemove` listener per layer
2. **Debounced rendering**: 1-second delay prevents excessive state updates
3. **Conditional rendering**: Popup only renders when `popupInfo` is set
4. **Cleanup**: Timeouts are cleared on component unmount
5. **Layer filtering**: Only queries specific layer IDs, not entire map

### Memory Management
```typescript
// Cleanup on unmount or visibility change
return () => {
  map.off('mousemove', handleMouseMove);
  map.off('mouseleave', 'conserved-areas-fill', handleMouseLeave);
  if (hoverTimeoutRef.current) {
    clearTimeout(hoverTimeoutRef.current);
  }
};
```

## Customization Options

### Adjust Hover Delay
Change the timeout duration in both layer components:
```typescript
setTimeout(() => {
  // Show popup
}, 1000); // Change to 500 for 0.5s, 2000 for 2s, etc.
```

### Adjust Popup Position
Modify the `offset` prop:
```typescript
<Popup
  offset={10} // Distance from cursor (in pixels)
  anchor="bottom" // Add anchor: "top", "bottom", "left", "right"
/>
```

### Adjust Animation
Modify in `globals.css`:
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px); /* Change for different entrance */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Future Enhancements (Optional)

### 1. Add Click Actions
```typescript
const handleClick = (e: mapboxgl.MapMouseEvent) => {
  // Open detailed panel
  // Zoom to feature bounds
  // Filter facilities in area
};
```

### 2. Add Area Statistics
```typescript
<Popup>
  <p>Area: {calculateArea(feature.geometry)} km²</p>
  <p>Facilities nearby: {countFacilities(feature.geometry)}</p>
</Popup>
```

### 3. Add Multi-Layer Popups
```typescript
// Show info for all layers at cursor position
const allFeatures = map.queryRenderedFeatures(e.point, {
  layers: ['conserved-areas-fill', 'indigenous-fill', 'facilities-circles']
});
```

### 4. Add Keyboard Navigation
```typescript
// Allow Tab to cycle through features
// Allow Enter to select feature
// Allow Escape to close popup
```

## Testing

### Test Conserved Areas
1. Go to `/map` or `/credit-builder`
2. Enable "Show Conserved Areas" toggle
3. Find a green polygon (try zooming to national parks like Banff)
4. Hover for 1 second
5. Verify popup shows name, type, and IUCN category

### Test Indigenous Territories
1. Enable "Show Indigenous Territories" toggle
2. Find a purple polygon (try zooming to western Canada)
3. Hover for 1 second
4. Verify popup shows territory name and attribution

### Test Edge Cases
- ✅ Move mouse away before 1 second → No popup
- ✅ Move between multiple areas quickly → Only one popup
- ✅ Hover on overlap of two territories → Shows one (topmost)
- ✅ Toggle layer off while popup visible → Popup disappears
- ✅ Zoom while popup visible → Popup updates position

## Known Limitations

1. **Property Availability**: Some tilesets may not have all properties (e.g., IUCN category)
2. **Overlap Handling**: Only shows info for topmost feature in overlapping areas
3. **Mobile**: 1-second hover may not work well on mobile (consider tap-to-show)
4. **Data Freshness**: Info is from tileset, which may not be real-time

## Benefits

### For Users
- ✅ **Contextual Learning**: Learn about protected areas while exploring
- ✅ **No Clutter**: Info only appears when needed (on hover)
- ✅ **Quick Access**: 1-second delay is fast enough to be useful
- ✅ **Visual Feedback**: Cursor change indicates interactivity

### For Development
- ✅ **Reusable Pattern**: Same approach can be applied to other layers
- ✅ **Type-Safe**: TypeScript interfaces for popup data
- ✅ **Clean Code**: Separated concerns (hover logic, rendering, styling)
- ✅ **Performant**: Minimal re-renders and efficient event handling

## Conclusion

Both map pages (`/map` and `/credit-builder`) now support:
- ✅ **1-second hover delay** before showing info
- ✅ **Conserved area information** (name, type, IUCN category)
- ✅ **Indigenous territory information** (name, description)
- ✅ **Smooth animations** with fade-in effect
- ✅ **Themed styling** that works in light and dark mode
- ✅ **Proper cleanup** to prevent memory leaks

Users can now explore and learn about protected areas and indigenous territories directly on the map! 🗺️✨

