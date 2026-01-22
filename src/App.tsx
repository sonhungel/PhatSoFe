import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Management from './pages/Management/Management';
import Statistics from './pages/Statistics/Statistics';
import ProtectedRoute from './components/ProtectedRoute';
import { createManagementMappings } from './map';
import "./index.css"

// Initialize type mappings
createManagementMappings();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <Management />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
