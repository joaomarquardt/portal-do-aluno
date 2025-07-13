import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardAluno from "./pages/DashboardAluno";
import Professores from "./pages/Professores";
import Turmas from "./pages/Turmas";
import Periodos from "./pages/Periodos";
import Cursos from "./pages/Cursos";
import NotFound from "./pages/NotFound";
import UserProfileEditForm from "./pages/PerfilUsuarioForm";
import Disciplinas from "./pages/Disciplina";

const queryClient = new QueryClient();

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
                <header className="h-12 flex items-center border-b bg-white px-4 justify-between">
                    <h1 className="text-lg font-semibold text-gray-800">
                        Sistema de Gestão Acadêmica
                    </h1>
                </header>
                <main className="flex-1 bg-gray-100 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};


const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }
    if (user.role === "PROFESSOR") {
        return <DashboardProfessor />;
    }

    if (user.role === 'ALUNO') {
        return <DashboardAluno />;
    }
    if (user.role === 'ADMIN') {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard/admin" replace />} />
                <Route
                    path="/dashboard/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminLayout>
                                <DashboardAdmin />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="/professores" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout>
                            <Professores />
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/turmas" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout>
                            <Turmas />
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/periodos" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout>
                            <Periodos />
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/cursos" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout>
                            <Cursos />
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                  <Route path="/disciplinas" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout>
                            <Disciplinas />
                        </AdminLayout>
                    </ProtectedRoute>
                } />
                <Route
                    path="/meu-perfil/editar"
                    element={
                        <ProtectedRoute allowedRoles={['ALUNO', 'PROFESSOR', 'ADMIN']}>
                            <UserProfileEditForm />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        );
    }

    return <Navigate to="/login" replace />;
};


const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
