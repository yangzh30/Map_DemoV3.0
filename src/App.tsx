import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import TerritoryDashboard from './pages/TerritoryManager/TerritoryDashboard'
import TerritoryDashboardOld from './pages/TerritoryManager/TerritoryDashboardOld'
import HQDashboard from './pages/HQManager/HQDashboard'
import WarZoneDashboard from './pages/WarZone/WarZoneDashboard'
import TerritoryMobile from './pages/TerritoryManager/TerritoryMobile'
import HQMobile from './pages/HQManager/HQMobile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/territory" replace />} />
        <Route path="territory" element={<TerritoryDashboard />} />
        <Route path="territory-old" element={<TerritoryDashboardOld />} />
        <Route path="warzone" element={<WarZoneDashboard />} />
        <Route path="hq" element={<HQDashboard />} />
      </Route>
      <Route path="/mobile/territory" element={<TerritoryMobile />} />
      <Route path="/mobile/hq" element={<HQMobile />} />
    </Routes>
  )
}
