# ✅ Map Animation & Collapsible Top Polluters

## Features Implemented

### 1. Animated Map Flight to Facilities

**When clicking on:**
- Search results
- Top 5 Polluters list items
- Facility markers on map

**The map will:**
- Smoothly animate (fly) to the facility location
- Take 2 seconds for the animation
- Zoom to level 12 for optimal facility viewing
- Center the facility in the viewport

#### Implementation Details

**File:** `web/app/map/page.tsx`

Added map reference:
```typescript
const mapRef = useRef<mapboxgl.Map | null>(null);
```

Connected map instance:
```typescript
<BaseMap
  onMapLoad={(map) => (mapRef.current = map)}
  ...
>
```

Updated facility selection handler:
```typescript
const handleFacilitySelect = async (facility) => {
  // Fly to facility location with animation
  if (mapRef.current) {
    mapRef.current.flyTo({
      center: [facility.longitude, facility.latitude],
      zoom: 12,
      duration: 2000, // 2 second animation
      essential: true,
    });
  }
  
  // ... rest of the logic
};
```

**Animation Parameters:**
- `center`: [longitude, latitude] of the facility
- `zoom`: 12 (city-level view, perfect for facilities)
- `duration`: 2000ms (2 seconds) - smooth and dramatic
- `essential`: true (animation will always complete)

### 2. Collapsible Top 5 Polluters Card

**Behavior:**
- Card can be collapsed to save map space
- Collapse/expand button in header (chevron icon)
- When collapsed: Only shows title bar with icon
- When expanded: Shows full list of 5 facilities
- State persists during session (doesn't reset on data refresh)

#### Implementation Details

**File:** `web/components/map/TopPollutersCard.tsx`

Added collapse state:
```typescript
const [isCollapsed, setIsCollapsed] = useState(false);
```

Updated header with toggle button:
```typescript
<CardHeader className="pb-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <TrendingUp className="h-4 w-4 text-destructive" />
      <CardTitle className="text-base">Top 5 Polluters</CardTitle>
    </div>
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {isCollapsed ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronUp className="h-4 w-4" />
      )}
    </Button>
  </div>
  {!isCollapsed && (
    <CardDescription className="text-xs">
      Highest CO2e emissions in Canada (2023)
    </CardDescription>
  )}
</CardHeader>
{!isCollapsed && (
  <CardContent className="space-y-1">
    {/* Facilities list */}
  </CardContent>
)}
```

**UI States:**

**Expanded (default):**
```
┌─────────────────────────────────────┐
│ 🔺 Top 5 Polluters           ▲     │
│ Highest CO2e emissions...           │
├─────────────────────────────────────┤
│ ① Facility 1                   📍   │
│ ② Facility 2                   📍   │
│ ③ Facility 3                   📍   │
│ ④ Facility 4                   📍   │
│ ⑤ Facility 5                   📍   │
└─────────────────────────────────────┘
```

**Collapsed:**
```
┌─────────────────────────────────────┐
│ 🔺 Top 5 Polluters           ▼     │
└─────────────────────────────────────┘
```

## User Experience

### Facility Selection Flow

1. **User clicks** on search result or Top 5 Polluters item
2. **Map animates** smoothly to facility location (2 seconds)
3. **Facility quickview drawer** opens showing details
4. **User can explore** facility while map is centered on it

### Map Space Management

1. **Default**: Top 5 Polluters card is expanded
2. **User can collapse** to see more of the map
3. **Quick toggle** with chevron button
4. **Card stays collapsed** until user expands it again
5. **No interference** with map exploration when collapsed

## Animation Customization

You can adjust the animation in `web/app/map/page.tsx`:

```typescript
mapRef.current.flyTo({
  center: [longitude, latitude],
  zoom: 12,           // Change zoom level (higher = closer)
  duration: 2000,     // Change animation speed (ms)
  essential: true,    // Force animation to complete
  
  // Optional additional parameters:
  // curve: 1.42,     // Animation curve (default 1.42)
  // speed: 1.2,      // Speed multiplier
  // easing: (t) => t // Custom easing function
});
```

### Recommended Zoom Levels
- `zoom: 8` - Regional view (multiple facilities)
- `zoom: 10` - Area view (city + surroundings)
- `zoom: 12` - **City view (current, optimal for facilities)** ✅
- `zoom: 14` - Neighborhood view (very close)
- `zoom: 16` - Street view (too close for facilities)

### Recommended Durations
- `duration: 1000` - Fast (1 second) - quick but may feel abrupt
- `duration: 2000` - **Medium (2 seconds) - smooth and dramatic** ✅
- `duration: 3000` - Slow (3 seconds) - very smooth but may feel sluggish
- `duration: 5000` - Very slow (5 seconds) - too long for UX

## Files Modified

- ✅ `web/app/map/page.tsx`
  - Added `mapRef` to store map instance
  - Connected map via `onMapLoad` callback
  - Added `flyTo()` animation in `handleFacilitySelect()`

- ✅ `web/components/map/TopPollutersCard.tsx`
  - Added `useState` for collapse state
  - Imported `ChevronDown` and `ChevronUp` icons
  - Added toggle button in header
  - Conditionally render description and content

## Testing

### Test Map Animation
1. Go to `/map` page
2. Click on a search result
3. Watch map smoothly fly to facility
4. Drawer should open showing facility details

### Test Top Polluters Animation
1. Click on any of the Top 5 Polluters items
2. Watch map animate to that facility
3. Verify drawer opens with correct facility

### Test Collapse/Expand
1. Click chevron-up button on Top 5 Polluters card
2. Card should collapse to just the title bar
3. Click chevron-down button
4. Card should expand showing all 5 facilities
5. Verify facilities are still clickable after expand

## Benefits

### For Users
1. **Visual Feedback** - Smooth animation shows where facility is located
2. **Context Awareness** - User understands spatial relationship between facilities
3. **Engaging UX** - Dramatic camera movement is more engaging than instant jumps
4. **Map Control** - Can collapse list to see more of the map
5. **Flexibility** - Easy access to top polluters without permanent screen real estate

### For Development
1. **Reusable Pattern** - Same animation logic works for search, top polluters, and map markers
2. **Configurable** - Easy to adjust zoom, duration, and animation curve
3. **Non-Breaking** - If map ref is null, feature degrades gracefully
4. **Performant** - Uses native Mapbox GL animation (GPU-accelerated)

## Future Enhancements (Optional)

### 1. Remember Collapse State
```typescript
// Persist to localStorage
const [isCollapsed, setIsCollapsed] = useState(() => {
  const saved = localStorage.getItem('topPollutersCollapsed');
  return saved === 'true';
});

useEffect(() => {
  localStorage.setItem('topPollutersCollapsed', String(isCollapsed));
}, [isCollapsed]);
```

### 2. Add Zoom Level Animation
```typescript
// Start from current zoom, fly to facility
const currentZoom = mapRef.current.getZoom();
mapRef.current.flyTo({
  center: [longitude, latitude],
  zoom: currentZoom < 10 ? 12 : currentZoom + 2, // Adaptive zoom
  duration: 2000,
});
```

### 3. Add Pitch/Bearing Animation
```typescript
// Tilt map for dramatic 3D effect
mapRef.current.flyTo({
  center: [longitude, latitude],
  zoom: 14,
  pitch: 60,  // Tilt angle (0-60)
  bearing: 45, // Rotation angle (0-360)
  duration: 2500,
});
```

### 4. Show Animation Trail
```typescript
// Draw line from current view to destination
// Add temporary marker at destination
// Pulse animation on arrival
```

## Conclusion

The map now provides:
- ✅ **Smooth animated transitions** to facilities (2 second flyTo)
- ✅ **Collapsible Top 5 Polluters** card (save map space)
- ✅ **Better user experience** with visual feedback
- ✅ **Flexible interface** that adapts to user needs

Users can now enjoy a more cinematic and engaging experience when exploring facilities! 🗺️✨

