import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, GraduationCap } from 'lucide-react';

const Login = () => {
    const [cpf, setCpf] = useState(''); // CPF sem formatação (apenas números)
    const [cpfView, setCpfView] = useState(""); // CPF com formatação para exibição
    const [senha, setSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState<'PROFESSOR' | 'ALUNO'>('ALUNO');
    
    // --- NOVO: Estado para erros de validação de CAMPO (campos vazios, formato errado) ---
    const [fieldErrors, setFieldErrors] = useState({
        cpf: '',
        senha: '',
    });
    
    // --- NOVO: Estado para MENSAGEM DE ERRO GERAL (erros de autenticação da API) ---
    const [errorMessage, setErrorMessage] = useState(''); 

    // O 'login' e 'loading' vêm do seu AuthContext
    const { login, loading } = useAuth(); 

    // Função de validação dos campos do formulário
    const validateForm = () => {
        let newErrors = { cpf: '', senha: '' };
        let isValid = true;

        // Validação do CPF
        if (!cpf.trim()) {
            newErrors.cpf = 'O CPF é obrigatório.';
            isValid = false;
        } else if (cpf.trim().length !== 11) {
            newErrors.cpf = 'O CPF deve ter 11 dígitos numéricos.';
            isValid = false;
        } else if (!/^\d{11}$/.test(cpf.trim())) {
            newErrors.cpf = 'O CPF deve conter apenas números.';
            isValid = false;
        }

        // Validação da Senha
        if (!senha.trim()) {
            newErrors.senha = 'A senha é obrigatória.';
            isValid = false;
        } else if (senha.trim().length < 6) { 
            newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
            isValid = false;
        }

        setFieldErrors(newErrors); 
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); // Limpa a mensagem de erro geral antes de cada tentativa de login
        setFieldErrors({ cpf: '', senha: '' }); // Limpa os erros de campo

        // Executa a validação do formulário
        if (!validateForm()) {
            // Se a validação falhar, os erros de campo já foram atualizados, apenas retorna
            return;
        }

        // Se a validação passou, tenta fazer o login
        const success = await login(cpf, senha); 
        if (!success) {
            setErrorMessage('CPF, senha ou tipo de usuário incorretos.'); // Define a mensagem de erro geral
        }
    };

    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, ''); 
        if (numbers.length > 9) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numbers.length > 6) {
            return numbers.replace(/(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (numbers.length > 3) {
            return numbers.replace(/(\d{3})/, '$1.$2');
        }
        return numbers;
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numbers = value.replace(/\D/g, ''); 
        if (numbers.length <= 11) {
            setCpf(numbers); 
            setCpfView(formatCPF(numbers));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistema Acadêmico</h1>
                    <p className="text-gray-600">Faça login para acessar o sistema</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                            CPF
                        </label>
                        <input
                            type="text"
                            id="cpf"
                            value={cpfView}
                            onChange={handleCPFChange}
                            className={`w-full px-3 py-2 border-2 ${fieldErrors.cpf ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500`}
                            placeholder="000.000.000-00"
                        />
                        {fieldErrors.cpf && <p className="text-red-500 text-xs mt-1">{fieldErrors.cpf}</p>}
                    </div>

                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className={`w-full px-3 py-2 border-2 ${fieldErrors.senha ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500`}
                            placeholder="Digite sua senha"
                        />
                        {fieldErrors.senha && <p className="text-red-500 text-xs mt-1">{fieldErrors.senha}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Usuário
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="tipoUsuario"
                                    value="ALUNO"
                                    checked={tipoUsuario === 'ALUNO'}
                                    onChange={(e) => setTipoUsuario(e.target.value as 'ALUNO')}
                                    className="w-4 h-4"
                                />
                                <Users className="text-blue-600" size={20} />
                                <span className="font-medium text-gray-700">Estudante</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="tipoUsuario"
                                    value="PROFESSOR"
                                    checked={tipoUsuario === 'PROFESSOR'}
                                    onChange={(e) => setTipoUsuario(e.target.value as 'PROFESSOR')}
                                    className="w-4 h-4"
                                />
                                <GraduationCap className="text-green-600" size={20} />
                                <span className="font-medium text-gray-700">Professor</span>
                            </label>
                        </div>
                    </div>

                    {errorMessage && ( // Agora usa 'errorMessage' para erros de autenticação
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;