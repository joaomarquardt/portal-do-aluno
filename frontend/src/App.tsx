

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Professores from "./pages/Professores";
import Turmas from "./pages/Turmas";
import Periodos from "./pages/Periodos";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardAluno from "./pages/DashboardAluno";
import NotFound from "./pages/NotFound";
import Cursos from "./pages/Cursos";

const queryClient = new QueryClient();

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

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b bg-white px-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Sistema de Gestão Acadêmica
          </h1>
        </header>
        <main className="flex-1 bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/professores" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Professores />
              </ProtectedRoute>
            } />
            <Route path="/turmas" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Turmas />
              </ProtectedRoute>
            } />
            <Route path="/periodos" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Periodos />
              </ProtectedRoute>
            } />
             <Route path="/cursos" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Cursos />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
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
