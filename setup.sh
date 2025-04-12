#!/bin/bash

echo "🚀 Setting up Retail Finance Web App..."

# Exit on error
set -e

# --- Backend Setup ---
echo "📦 Installing backend dependencies..."
cd backend
npm install express axios cors dotenv
cd ..

# --- Frontend Setup ---
echo "⚛️ Setting up frontend with Vite + React + Tailwind..."
cd frontend

# Install frontend dependencies
npm install

# Install Tailwind + PostCSS (latest version)
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss

# Create Tailwind config
npx tailwindcss init -p

# Overwrite tailwind.config.js
cat <<EOT > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOT

# Overwrite postcss.config.js
cat <<EOT > postcss.config.js
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};
EOT

cd ..

echo "✅ Setup complete! Run your app with:"
echo "cd frontend && npm run dev"
