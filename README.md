# E-Prayog 🧪💻

E-Prayog is an interactive, AI-powered virtual science laboratory designed specifically for Karnataka PUC (Pre-University Course) students. It features immersive, 2D simulation-based experiments across Physics, Chemistry, Biology, Mathematics, and Computer Science.

## Features ✨
- **Interactive 2D Simulations**: Fully responsive canvas and SVG-based experiments.
- **AI Lab Tutor**: Integrated context-aware Gemini AI to guide students through experiments.
- **Karnataka PUC Curriculum**: Strictly aligned with 1st and 2nd PUC syllabi.
- **Role-based Dashboards**: Unified robust views for Students, Teachers, and Administrators.
- **Comprehensive Tools**: Built-in periodic table, calculator, formula sheet, logic gate simulator, and bio diagrams.
- **Supabase Backend**: Secure authentication, progress tracking, and class management.

## Tech Stack 🛠️
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Backend & Auth**: Supabase
- **AI Integration**: Google Gemini API

## Getting Started 🚀

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase and Gemini keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## License 📄
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
