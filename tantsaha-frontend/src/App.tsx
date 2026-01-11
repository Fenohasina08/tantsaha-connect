 import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import 'leaflet/dist/leaflet.css';
// 1. Imports des pages
import Login from "./pages/Login";
import Header from "./components/layout/Header";

const HomePage = lazy(() => import("./pages/HomePage"));
const WeatherPage = lazy(() => import("./pages/WeatherPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));
const AdvicePage = lazy(() => import("./pages/AdvicePage"));

// 2. Le Loader (L'oiseau)
const BirdLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <div className="text-4xl animate-bounce">🐦</div>
    <p className="mt-4 italic font-medium text-green-600">Mandeha ny vorona...</p>
  </div>
);

// 3. Le "Moteur" des animations
// On le sépare pour que useLocation puisse fonctionner
const AnimatedContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {/* Cette partie gère l'animation fluide entre les pages */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<BirdLoader />}>
              <Routes location={location}>
                <Route path="" element={<HomePage />} />
                <Route path="weather" element={<WeatherPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="advice" element={<AdvicePage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// 4. Le composant Principal
function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion (sans Header) */}
        <Route path="/" element={<Login />} />
        
        {/* Tout le reste de l'app (avec Header et Animations) */}
        <Route path="/app/*" element={<AnimatedContent />} />
      </Routes>
    </Router>
  );
}

export default App;