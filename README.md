<<<<<<< HEAD
# DrapeAI
👗 Drape AI — A high-fidelity AI Virtual Try-On mobile application powered by Gemini 2.0 Flash and Capacitor. Experience the future of personal styling with real-time garment analysis and neural-driven fashion suggestion
=======
# DRAPE: Virtual Try-On Web App

A client-side web application built with React, Vite, and Tailwind CSS. It uses the Gemini API to analyze garments, validate user photos, and simulate a photorealistic virtual try-on experience. 

## Features
- **Garment Analysis:** Upload up to 3 clothing items. Identifies the type of garment, fit, pattern, and color harmony.
- **Photo Validation:** Evaluates your uploaded full-body photo to ensure it meets requirements.
- **Virtual Generation:** Generates a fashion editorial photorealistic try-on result using Google's Gemini models.
- **Style Notes:** Extracts a personalized styling caption for the entire outfit generated.

## Setup & Run Locally

This app has been pre-configured so that you can run it self-contained on your local machine instantly.

### 1. Install Dependencies
Make sure you have Node installed (Node 18+ is recommended). Run the following command in the root folder to install all required packages:
```bash
npm install
```

### 2. Configure Gemini API Key
Create a `.env` file in the root of the directory. Copy the contents of `.env.example` into `.env` and assign your Gemini API Key.
```bash
GEMINI_API_KEY="your_api_key_here"
# or if using a specific key index:
GEMINI_API_KEY1="your_api_key_here"
```
*(You can get a Gemini API Key from Google AI Studio: https://aistudio.google.com/app/apikey)*

### 3. Start Development Server
Run the Vite development server to launch the app locally:
```bash
npm run dev
```

### 4. Access the App
Open a modern browser and navigate to `http://localhost:3000` (or the port specified by Vite in your terminal).

## How it works (Technical details)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v4) + framer-motion (motion/react) for animation primitives.
- **Routing:** react-router-dom
- **AI Backend:** Automatically configured to securely query Google's Gemini API directly from the client. `GEMINI_API_KEY` is loaded through Vite using `import.meta.env` mapping to `process.env.GEMINI_API_KEY`.
>>>>>>> 14e181e (Initial commit: Drape AI Premium Virtual Try-On)
