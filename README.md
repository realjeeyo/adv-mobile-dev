# 🎵 Spotify-Inspired Mobile App (Expo + React Native)

A **Spotify-style mobile application** built with **Expo, React Native, and Expo Router**.  
This project is part of **Advanced Mobile Development** coursework and demonstrates modern UI/UX practices, authentication flows, and navigation setup.

---

## 🚀 Features

- 🎨 **Spotify-inspired UI** (dark theme, gradient buttons, styled inputs)
- 🔐 **Authentication Screens**
    - Sign Up
    - Sign In
    - Forgot Password
- 🧭 **Navigation** with **Expo Router**
- 📱 **Responsive Layouts** that adapt to different screen sizes
- 🎭 **Custom Styles** with gradient buttons, shadows, and embossed inputs

---

## 📂 Project Structure
```bash
adv-mobile-dev/
│-- app/ # Screens (Expo Router structure)
│ ├── index.js # Login Screen (for now)
│ ├── signup.js # Sign Up screen
│ └── ...
│-- activities/ # Where Week 1 Activity 1 and Activity 2 are stored, in PDF format.
│-- assets/ # Images, icons, fonts
│-- components/ # Reusable UI components
│-- package.json # Dependencies & scripts
│-- README.md # Project documentation
```
NOTE: It is important to note that Activity 1 and Activity 2 files are stored in the /activities directory

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/realjeeyo/adv-mobile-dev.git
   cd adv-mobile-dev

2. **Install dependencies**
   ```bash
   npm install
   ```
   
3. **Run the development server**
   ```bash
   npx expo start
   ```
   
4. **Test on device**
- Download Expo Go from the App Store / Play Store
- Scan the QR code from your terminal or browser

## Screenshots

Week 2 Activity 1 (Authentication)
<p> We implemented a basic authentication flow with signup and login functionality. This allowed users to access the app. </p>
<p align="center">
  <img src="screenshots/Signup Page 09:02:25.png" alt="Sign Up Screen" width="250"/>
  <img src="screenshots/Login Page 09:02:25.png" alt="Login Screen" width="250"/>
</p>


Week 2 Activity 2
<p> We developed the core navigation structure of the app with a Home, Profile, and Playlists screen. This established the foundation for user interaction and smooth movement between different sections. </p>
<p align="center">
  <img src="screenshots/Home Page 09:04:25.png" alt="Home Screen" width="250"/>
  <img src="screenshots/Profile Page 09:04:25.png" alt="Profile Screen" width="250"/>
  <img src="screenshots/Playlists Page 09:04:25.png" alt="Playlists Screen" width="250"/>
</p>

Week 4 Activity 1 (Playlist Builder)
<p> We created a playlist builder feature where users can add, view, and manage playlists. This activity introduced state management for handling playlists and updating them dynamically. </p>
<p align="center">
  <img src="screenshots/Playlists Screen 09:16:25.png" alt="Playlists Screen" width="250"/>
  <img src="screenshots/Playlist Opened 09:16:25.png" alt="Playlist Opened Screen" width="250"/>
</p>

Week 4 Activity 2 (Profile Form Validation)
<p> We added an editable profile form with validation for username, email, and favorite genre. Invalid inputs now trigger visual feedback, ensuring data integrity and better user experience. </p>
<p align="center">
    <img src="screenshots/Profile Screen 09:18:25.png" alt="Profile Screen" width="250"/>>
</p>

Week 5 Activity 1 (Theme Switcher)
<p> We implemented a comprehensive theme switcher system with Redux state management, animated transitions, and custom theme options. Users can now switch between light mode, dark mode, and custom themes with smooth animations. The theme preference is automatically persisted and restored on app launch. </p>
<p align="center">
  <img src="screenshots/Theme Screen.png" alt="Theme Settings Screen" width="250"/>
  <img src="screenshots/light1.png" alt="Light Theme Home" width="250"/>
  <img src="screenshots/dark1.png" alt="Dark Theme Home" width="250"/>
</p>
<p align="center">
  <img src="screenshots/light2.png" alt="Light Theme Playlists" width="250"/>
  <img src="screenshots/dark2.png" alt="Dark Theme Playlists" width="250"/>
  <img src="screenshots/custom1.png" alt="Custom Theme Example" width="250"/>
</p>
<p align="center">
  <img src="screenshots/light3.png" alt="Light Theme Profile" width="250"/>
  <img src="screenshots/dark3.png" alt="Dark Theme Profile" width="250"/>
  <img src="screenshots/custom2.png" alt="Custom Theme Profile" width="250"/>
</p>
<p align="center">
  <img src="screenshots/light4.png" alt="Light Theme Playlist Detail" width="250"/>
  <img src="screenshots/dark5.png" alt="Dark Theme Playlist Detail" width="250"/>
  <img src="screenshots/custom3.png" alt="Custom Theme Playlist Detail" width="250"/>
</p>
<p align="center">
  <img src="screenshots/custom4.png" alt="Custom Theme Color Picker" width="250"/>
</p>


## 🔧 Tech Stack
- Expo
- React Native
- Expo Router
- React Native Linear Gradient
- Redux Toolkit (State Management)
- React Native Reanimated (Animations)
- AsyncStorage (Persistence)

## 📜 License
This project is developed for educational purposes.
You are free to use, modify, and share with attribution.