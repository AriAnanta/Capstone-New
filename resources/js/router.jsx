import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import CasesPage from '@/pages/CasesPage';
import CaseCreatePage from '@/pages/CaseCreatePage';
import CaseEditPage from '@/pages/CaseEditPage';
import DocumentsPage from '@/pages/DocumentsPage';
import DocumentDetailPage from '@/pages/DocumentDetailPage';
import DocumentUploadPage from '@/pages/DocumentUploadPage';
import DocumentEditPage from '@/pages/DocumentEditPage';
import PublicPortalPage from '@/pages/PublicPortalPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SettingsPage from '@/pages/SettingsPage';
import LegalAdvisorPage from '@/pages/LegalAdvisorPage';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ allowed, redirectTo = '/public/putusan' }) => {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.role);
    const isAuthenticated = Boolean(token);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowed && !allowed.includes(role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/public/putusan" element={<PublicPortalPage />} />

            <Route element={<ProtectedRoute allowed={['panitera', 'hakim']} />}>
                <Route element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="cases" element={<CasesPage />} />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="documents/:documentId" element={<DocumentDetailPage />} />
                    <Route path="settings" element={<SettingsPage />} />

                    {/* Hakim only routes */}
                    <Route element={<ProtectedRoute allowed={['hakim']} />}>
                        <Route path="legal-advisor" element={<LegalAdvisorPage />} />
                    </Route>

                    <Route element={<ProtectedRoute allowed={['panitera']} />}>
                        <Route path="cases/new" element={<CaseCreatePage />} />
                        <Route path="cases/:caseId/edit" element={<CaseEditPage />} />
                        <Route path="documents/upload" element={<DocumentUploadPage />} />
                        <Route path="documents/:documentId/edit" element={<DocumentEditPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
);
