 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import AlertsPage from './pages/AlertsPage';
import JournalPage from './pages/JournalPage';
import AdvicePage from './pages/AdvicePage';
import Header from './components/layout/Header';

function App() {
  return (
    <Router>
      {/* Version simple sans Header fixe */}
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        <main className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/advice" element={<AdvicePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;