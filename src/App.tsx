import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import HouseholdDashboard from './pages/household/HouseholdDashboard';
import CollectorDashboard from './pages/collector/CollectorDashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StateDashboard from './pages/state/StateDashboard';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Dashboard Routes wrapped in Layout */}
            <Route element={<DashboardLayout />}>
              {/* Household */}
              <Route element={<ProtectedRoute allowedRoles={['household']} />}>
                <Route path="/household" element={<HouseholdDashboard />} />
              </Route>
              
              {/* Collector */}
              <Route element={<ProtectedRoute allowedRoles={['collector']} />}>
                <Route path="/collector" element={<CollectorDashboard />} />
              </Route>

              {/* Officer */}
              <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
                <Route path="/officer" element={<OfficerDashboard />} />
                <Route path="/officer/map" element={<div>Officer Zone Map</div>} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<div>Admin Settings</div>} />
              </Route>

              {/* State Dept */}
              <Route element={<ProtectedRoute allowedRoles={['dept']} />}>
                <Route path="/dept" element={<StateDashboard />} />
                <Route path="/dept/map" element={<div>State Heatmap</div>} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
