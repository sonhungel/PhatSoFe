import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Management from './pages/Management/Management';
import ProtectedRoute from './components/ProtectedRoute';
import { createManagementMappings } from './map';
import './App.css';

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
      </Routes>
    </Router>
  );
}

export default App;
