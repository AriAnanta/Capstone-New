import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import CasesPage from '@/pages/CasesPage';
import CaseCreatePage from '@/pages/CaseCreatePage';
import DocumentsPage from '@/pages/DocumentsPage';
import DocumentDetailPage from '@/pages/DocumentDetailPage';
import DocumentUploadPage from '@/pages/DocumentUploadPage';
import PublicPortalPage from '@/pages/PublicPortalPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SettingsPage from '@/pages/SettingsPage';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ allowed }) => {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.role);
    const isAuthenticated = Boolean(token);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowed && !allowed.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/public/putusan" element={<PublicPortalPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="cases" element={<CasesPage />} />
                    <Route path="cases/new" element={<CaseCreatePage />} />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="documents/upload" element={<DocumentUploadPage />} />
                    <Route path="documents/:documentId" element={<DocumentDetailPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
);
