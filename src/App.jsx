import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage.jsx';
import { TypingTest } from './components/TypingTest.jsx';
import { Report } from './components/Report.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={<TypingTest />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}