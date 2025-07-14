import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Users, BookOpen, GraduationCap, Award, Calendar, LogOut, User as UserIcon, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardAluno from "./pages/DashboardAluno";
import Professores from "./pages/Professores";
import Turmas from "./pages/Turmas";
import Periodos from "./pages/Periodos";
import Cursos from "./pages/Cursos";
import Disciplinas from "./pages/Disciplina";
import NotFound from "./pages/NotFound";
import UserProfileEditForm from "./pages/PerfilUsuarioForm";
import MinhasDisciplinas from "./pages/MinhasDisciplinas";
import CadastrarNotaDisc from "./pages/CadastrarNotaDisc";
import AcompanharDesempenho from "./pages/AcompanharDesempenho";

const queryClient = new QueryClient();

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const adminMenuItems: MenuItem[] = [
  { title: "Gestão de Alunos", url: "/dashboard/admin", icon: Users },
  { title: "Gestão de Professores", url: "/professores", icon: GraduationCap },
  { title: "Gestão de Turmas", url: "/turmas", icon: BookOpen },
  { title: "Gestão de Cursos", url: "/cursos", icon: Calendar },
  { title: "Gestão de Disciplinas", url: "/disciplinas", icon: BookOpen },
  { title: "Períodos Letivos", url: "/periodos", icon: Calendar }
];

const alunoMenuItems: MenuItem[] = [
  { title: "Meu Dashboard", url: "/dashboard/aluno", icon: Users },
  { title: "Minhas Turmas", url: "/minhas-turmas", icon: BookOpen },
];

const professorMenuItems: MenuItem[] = [
  { title: "Meu Dashboard", url: "/dashboard/professor", icon: GraduationCap },
  { title: "Minhas Disciplinas", url: "/minhas-disciplinas", icon: BookOpen },
  { title: "Lançar Notas", url: "/lancar-notas", icon: Award },
];

const DashboardLayout = ({ children, menuItems, user, logout, navigate }: {
  children: React.ReactNode;
  menuItems: MenuItem[];
  user: any;
  logout: () => void;
  navigate: (path: string) => void;
}) => {
  const getHeaderTitle = () => {
    if (user?.role === 'ALUNO') return 'Portal do Aluno';
    if (user?.role === 'PROFESSOR') return 'Portal do Professor';
    if (user?.role === 'ADMIN') return 'Painel Administrativo';
    return 'Sistema Acadêmico';
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{getHeaderTitle()}</h1>
              <p className="text-gray-600">Bem-vindo, {user?.nome || 'Usuário'}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};


const AppContent = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

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

  switch (user.role) {
    case "PROFESSOR":
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/professor" replace />} />
          <Route
            path="/dashboard/professor"
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <DashboardLayout menuItems={professorMenuItems} user={user} logout={logout} navigate={navigate}>
                  <DashboardProfessor />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/minhas-disciplinas" element={
            <ProtectedRoute allowedRoles={['PROFESSOR']}>
              <DashboardLayout menuItems={professorMenuItems} user={user} logout={logout} navigate={navigate}>
                <MinhasDisciplinas/>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/lancar-notas" element={
            <ProtectedRoute allowedRoles={['PROFESSOR']}>
              <DashboardLayout menuItems={professorMenuItems} user={user} logout={logout} navigate={navigate}>
                <CadastrarNotaDisc professorId={0}></CadastrarNotaDisc>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route
            path="/meu-perfil/editar"
            element={
              <ProtectedRoute allowedRoles={['PROFESSOR']}>
                <UserProfileEditForm />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );

    case 'ALUNO':
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/aluno" replace />} />
          <Route
            path="/dashboard/aluno"
            element={
              <ProtectedRoute allowedRoles={['ALUNO']}>
                <DashboardLayout menuItems={alunoMenuItems} user={user} logout={logout} navigate={navigate}>
                  <DashboardAluno />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/minhas-turmas" element={
            <ProtectedRoute allowedRoles={['ALUNO']}>
              <DashboardLayout menuItems={alunoMenuItems} user={user} logout={logout} navigate={navigate}>
                <AcompanharDesempenho/>
              </DashboardLayout>
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

    case 'ADMIN':
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/admin" replace />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout menuItems={adminMenuItems} user={user} logout={logout} navigate={navigate}>
                  <DashboardAdmin />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/professores" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout menuItems={adminMenuItems} user={user} logout={logout} navigate={navigate}>
                <Professores />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/turmas" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout menuItems={adminMenuItems} user={user} logout={logout} navigate={navigate}>
                <Turmas />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/disciplinas" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout menuItems={adminMenuItems} user={user} logout={logout} navigate={navigate}>
                <Disciplinas />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/periodos" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout menuItems={adminMenuItems} user={user} logout={logout} navigate={navigate}>
                <Periodos />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/cursos" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout menuItems={adminMenuItems} user={user} logout={logout} navigate={navigate}>
                <Cursos />
              </DashboardLayout>
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

    default:
      return <Navigate to="/login" replace />;
  }
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
