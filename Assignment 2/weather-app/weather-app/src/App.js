import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/page/Home';
import WeatherDetail from '../src/page/WeatherDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:city" element={<WeatherDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;