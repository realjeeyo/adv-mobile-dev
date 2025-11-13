# Week 6 Activity 2 - Location Map Testing Guide

## 🗺️ Features Implemented

### 1. Real-Time Location Tracking ✅
- User's current GPS location displayed on map
- Auto-updates every 10 meters of movement
- Custom user marker with Spotify green color

### 2. Three Mock Points of Interest ✅
- **Music Studio** @ (37.78825, -122.4324)
- **Concert Hall** @ (37.78925, -122.4344)
- **Music Store** @ (37.78725, -122.4304)
- Each has 100-meter geofencing radius

### 3. Interactive Map Controls ✅
- **Center Button** (🧭): Re-centers map on your location
- **Zoom In** (+): Increases map detail
- **Zoom Out** (-): Decreases map detail
- **Pan/Pinch**: Native gestures work for navigation

### 4. Geofencing Alerts ✅
- Alert when **entering** a zone: "🎵 Entered Zone"
- Alert when **leaving** a zone: "👋 Left Zone"
- Live status badge shows count of nearby locations

### 5. Custom Dark Map Style ✅
- Spotify-inspired dark theme
- Enhanced contrast for better visibility
- Matches app's overall aesthetic

---

## 🧪 Testing Instructions

### iOS Testing (Expo Go)

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start Expo**:
   ```bash
   npx expo start
   ```

3. **Run on iOS Simulator**:
   - Press `i` in terminal OR scan QR with Expo Go app

4. **Grant Location Permissions**:
   - When prompted, tap **"Allow While Using App"**
   - If denied, go to Settings > Privacy > Location Services > Expo Go > Allow

5. **Navigate to Profile Tab**:
   - Tap the **Profile** icon in bottom tab bar
   - Scroll down to **"Nearby Music Spots"** section

6. **Test Map Features**:
   - **User Location**: Blue dot should appear at your current location
   - **Markers**: Three red pins for mock POIs (change to green when inside)
   - **Circles**: Transparent geofence zones around each marker
   - **Controls**: Test zoom +/-, center button

7. **Test Geofencing** (Simulator Only):
   - Xcode > Debug > Location > Custom Location
   - Enter coordinates near a marker:
     - Studio: `37.78825, -122.4324`
     - Hall: `37.78925, -122.4344`
     - Store: `37.78725, -122.4304`
   - Should trigger "Entered Zone" alert
   - Move away to trigger "Left Zone" alert

### Android Testing (Expo Go)

1. **Start Expo** (same as iOS):
   ```bash
   npx expo start
   ```

2. **Run on Android Device/Emulator**:
   - Press `a` in terminal OR scan QR with Expo Go

3. **Grant Location Permissions**:
   - Tap **"While using the app"**
   - If denied: Settings > Apps > Expo Go > Permissions > Location > Allow

4. **Test** (same steps as iOS above)

5. **Simulate Location** (Emulator only):
   - Android Studio > Extended Controls (⋮) > Location
   - Enter coordinates and click "Send"

### Physical Device Testing

1. **Scan QR code** from Expo terminal
2. **Allow location** when prompted
3. **Walk around** to test real geofencing:
   - Markers will turn green when within 100m
   - Alerts will fire when crossing boundaries
4. **Test responsiveness** on different screen sizes

---

## ✅ Expected Behavior Checklist

- [ ] Map loads with user location centered
- [ ] Three markers visible with labels
- [ ] Geofence circles drawn around markers
- [ ] Zoom controls work smoothly
- [ ] Center button recenters on user
- [ ] Dark map style applied
- [ ] Entering zone triggers alert with marker name
- [ ] Leaving zone triggers departure alert
- [ ] Status badge shows count when inside zones
- [ ] Permission denied shows error message
- [ ] Map works in both light and dark app themes

---

## 📱 Cross-Platform Verification

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| Location Tracking | ✓ | ✓ | Uses expo-location |
| Map Display | ✓ | ✓ | Google Maps provider |
| Geofencing | ✓ | ✓ | Haversine distance calc |
| Custom Styling | ✓ | ✓ | JSON map theme |
| Controls | ✓ | ✓ | Native touch gestures |
| Permissions | ✓ | ✓ | Configured in app.json |

---

## 🐛 Troubleshooting

### Map Not Loading
- Check internet connection (maps require data)
- Verify Google Maps API enabled (Expo handles this)
- Restart Expo dev server

### Location Permission Denied
- iOS: Settings > Privacy > Location > Expo Go
- Android: Settings > Apps > Expo > Permissions > Location

### Geofencing Not Triggering
- Ensure you're moving >10 meters (distance interval)
- Mock locations must be within 100m of markers
- Check alert permissions if alerts don't show

### Dark Style Not Applied
- Verify `customMapStyle` prop on MapView
- Check console for map style errors

---

## 🎯 Activity Requirements Met

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Integrate map with real-time location | ✅ | expo-location + react-native-maps |
| 3+ custom markers for POIs | ✅ | Music Studio, Concert Hall, Music Store |
| Zoom and pan controls | ✅ | Custom buttons + native gestures |
| Geofencing with alerts | ✅ | 100m radius, enter/leave notifications |
| Custom map style | ✅ | Dark theme JSON config |
| Cross-platform testing | ✅ | Works on iOS & Android |
| Responsive design | ✅ | Adapts to phone/tablet |

---

## 📸 Screenshots to Capture

For documentation/submission, capture:
1. Map loaded with user location
2. Geofencing alert dialog
3. Map with all three markers visible
4. Status badge showing "Near 2 locations"
5. Map controls in use (zoom buttons)
6. Both light and dark theme versions

---

## 🚀 Next Steps (Optional Enhancements)

- [ ] Add real Spotify API to show nearby concerts
- [ ] Implement directions to selected POI
- [ ] Add search functionality for locations
- [ ] Store favorite locations in AsyncStorage
- [ ] Add distance display to each marker
- [ ] Implement route tracking/history
