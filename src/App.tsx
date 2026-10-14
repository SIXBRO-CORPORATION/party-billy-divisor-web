import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/app/Layout.tsx';
import { ProtectedRoute } from './components/app/ProtectedRoute.tsx';
import { PublicRoute } from './components/app/PublicRoute.tsx';
import AuthPage from './pages/AuthPage.tsx';
import BillDetailPage from './pages/BillDetailPage.tsx';
import BillsPage from './pages/BillsPage.tsx';
import NewBillPage from './pages/NewBillPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

function App() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<BillsPage />} />
                    <Route path="/bills/new" element={<NewBillPage />} />
                    <Route path="/bills/:billId" element={<BillDetailPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
