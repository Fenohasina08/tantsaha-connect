 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/WeatherPage";
import AlertsPage from "./pages/AlertsPage";
import JournalPage from "./pages/JournalPage";
import AdvicePage from "./pages/AdvicePage";
import Header from "./components/layout/Header";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN = PREMIÈRE PAGE */}
        <Route path="/" element={<Login />} />

        {/* APPLICATION */}
        <Route
          path="/app/*"
          element={
            <>
              <Header />
              <div className="min-h-screen bg-gray-50">
                <main className="p-4 md:p-6">
                  <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="weather" element={<WeatherPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route path="journal" element={<JournalPage />} />
                    <Route path="advice" element={<AdvicePage />} />
                  </Routes>
                </main>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
