import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { LogOut, User as UserIcon} from 'lucide-react';

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
import { useNavigate } from 'react-router-dom';

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

const AlunoLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm border-b">
              <div className="flex items-center justify-between px-6 py-4">
                  <div>
                      <h1 className="text-xl font-bold text-gray-800">Portal do Aluno</h1>
                      <p className="text-gray-600">Bem-vindo, {user?.nome}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                      <button
                          onClick={() => navigate(`/meu-perfil/editar`)}
                          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                          <UserIcon size={16} />
                          Meu Perfil
                      </button>
                      <button
                          onClick={logout}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                          <LogOut size={16} />
                          Sair
                      </button>
                  </div>
              </div>
          </header>
          {children}
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
        return (
            <Routes>
                <Route
                    path="/dashboard/aluno"
                    element={
                        <ProtectedRoute allowedRoles={['ALUNO']}>
                            <AlunoLayout>
                                <DashboardAluno />
                            </AlunoLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/meu-perfil/editar"
                    element={
                        <ProtectedRoute allowedRoles={['ALUNO']}>
                            <AlunoLayout>
                                <UserProfileEditForm />
                            </AlunoLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard/aluno" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        );
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
                <Route path="/disciplinas" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminLayout>
                            <Disciplinas />
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
                        <ProtectedRoute allowedRoles={['ALUNO']}>
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
