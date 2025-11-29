import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminLogin from './pages/admin/Login'
import AdminVerify from './pages/admin/Verify'
import AdminDashboard from './pages/admin/Dashboard'
import CreateScheme from './pages/admin/CreateScheme' // Import the new component
import ReleaseFunds from './pages/admin/ReleaseFunds' // Import the new component
import AddSkillCourses from './pages/admin/AddSkillCourses' // Import the new component
import OfficerLogin from './pages/officer/Login'
import OfficerVerify from './pages/officer/Verify'
import OfficerDashboard from './pages/officer/dashboard/Dashboard'
import DocumentVerification from './pages/officer/dashboard/DocumentVerification'
import FieldEnumerator from './pages/officer/dashboard/FieldEnumerator'
import BeneficiaryProfiling from './pages/officer/dashboard/BeneficiaryProfiling'
import PrivateRoute from './protected/PrivateRoute'
import Unauthorized from './pages/Unauthorized' // Import the new Unauthorized component

function App() {
    return (
        <Routes>
            {/* Landing Page with Role Selection */}
            <Route path="/" element={<Landing />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/verify" element={<AdminVerify />} />
            <Route element={<PrivateRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/create-scheme" element={<CreateScheme />} /> {/* New Route */}
                <Route path="/admin/release-funds" element={<ReleaseFunds />} /> {/* New Route */}
                <Route path="/admin/add-skill-courses" element={<AddSkillCourses />} /> {/* New Route */}
            </Route>

            {/* Officer Routes */}
            <Route path="/officer/login" element={<OfficerLogin />} />
            <Route path="/officer/verify" element={<OfficerVerify />} />
            <Route element={<PrivateRoute requiredRole="officer" />}>
                <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                <Route path="/officer/document-verification" element={<DocumentVerification />} />
                <Route path="/officer/field-enumerator" element={<FieldEnumerator />} />
                <Route path="/officer/beneficiary-profiling" element={<BeneficiaryProfiling />} />
            </Route>

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
    )
}

export default App
