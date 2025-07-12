
import { Users, BookOpen, GraduationCap, Calendar, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  {
    title: "Gestão de Alunos",
    url: "/",
    icon: Users
  },
  {
    title: "Gestão de Professores",
    url: "/professores",
    icon: GraduationCap
  },
  {
    title: "Gestão de Turmas",
    url: "/turmas",
    icon: BookOpen
  },
  {
    title: "Períodos Letivos",
    url: "/periodos",
    icon: Calendar
  },
    {
    title: "Cursos",
    url: "/cursos",
    icon: Calendar
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-60 bg-white border-r-2 border-gray-300 h-full shadow-md">
      <div className="p-4">
        <h2 className="text-blue-600 font-bold text-lg mb-2">Sistema Acadêmico</h2>
        <p className="text-sm text-gray-600 mb-6">Bem-vindo, {user?.nome}</p>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded transition-colors text-decoration-none ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 font-medium border-l-4 border-blue-500'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 w-full text-left rounded transition-colors hover:bg-red-50 text-red-600"
          >
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </div>
    </div>
  );
}
