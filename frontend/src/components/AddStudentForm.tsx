import { useState, useEffect } from 'react';

interface Student {
    id: number;
    cpf: string;
    name: string;
    email: string;
    institucionalEmail: string;
    cellphone: string;
    CursoId: number;
}

interface Curso {
    id: number; // Changed to number assuming backend uses numeric IDs for courses
    nome: string;
    tipo: string;
    anosDuracao: number;
    turno: string;
    departamento: string;
}

interface AddStudentFormProps {
    onAddStudent: (student: Omit<Student, 'id'>) => void;
    editingStudent?: Student | null;
    onUpdateStudent?: (student: Student) => void;
    onCancel?: () => void;
}

const initialFormState: Omit<Student, 'id'> = {
    cpf: '',
    name: '',
    email: '',
    institucionalEmail: '',
    cellphone: '',
    CursoId: 0, // Changed to 0 for initial state, assuming 0 or null is 'no selection'
};

const AddStudentForm = ({
    onAddStudent,
    editingStudent,
    onUpdateStudent,
    onCancel,
}: AddStudentFormProps) => {
    const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [cpfFormated, setCpfFormated] = useState(''); // State to hold formatted CPF for display

    // New state for validation errors
    const [errors, setErrors] = useState({
        cpf: '',
        name: '',
        email: '',
        institucionalEmail: '',
        cellphone: '',
        CursoId: '',
    });

    // --- Validation Functions ---

    const validateRequired = (value: string, fieldName: string): string => {
        if (!value.trim()) {
            return `O campo ${fieldName} é obrigatório.`;
        }
        return '';
    };

    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Campo obrigatório.';
        }
        if (!emailRegex.test(email)) {
            return 'Formato de email inválido.';
        }
        return '';
    };

    const validateCpf = (cpf: string): string => {
        const cleanedCpf = cpf.replace(/\D/g, ''); // Remove all non-digits
        if (cleanedCpf.length !== 11 || /^(.)\1+$/.test(cleanedCpf)) {
            return 'CPF inválido (deve conter 11 dígitos e não pode ser sequência de números iguais).';
        }

        // Basic CPF algorithm validation (more robust validation might be needed for production)
        let sum = 0;
        let rest;

        for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cleanedCpf.substring(9, 10))) return 'CPF inválido.';

        sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cleanedCpf.substring(10, 11))) return 'CPF inválido.';

        return ''; // CPF is valid
    };

    const validateCellphone = (cellphone: string): string => {
        const phoneRegex = /^\(?\d{2}\)?\s*\d{4,5}-?\d{4}$/; // (XX) XXXXX-XXXX or XXXX-XXXX
        if (!cellphone) {
            return 'Campo obrigatório.';
        }
        if (!phoneRegex.test(cellphone)) {
            return 'Formato de telefone inválido (Ex: (XX) XXXXX-XXXX).';
        }
        return '';
    };

    // --- Effects ---

    useEffect(() => {
        if (editingStudent) {
            const { id, ...data } = editingStudent;
            setFormData(data);
            setCpfFormated(data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')); // Format CPF for display
        } else {
            setFormData(initialFormState); // Reset form when not editing
            setCpfFormated(''); // Clear formatted CPF
            setErrors({ // Clear errors when not editing
                cpf: '', name: '', email: '', institucionalEmail: '', cellphone: '', CursoId: '',
            });
        }
    }, [editingStudent]); // Dependency on editingStudent

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const res = await fetch('http://localhost:3000/Cursos', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
                const data: Curso[] = await res.json();
                setCursos(data);
            } catch (error) {
                console.error('Erro ao buscar os cursos:', error);
                // Optionally show an alert to the user
                // alert('Erro ao carregar cursos. Por favor, tente novamente.');
            }
        };
        fetchCursos();
    }, []);

    // --- Handlers ---

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'cpf') {
            const numbers = value.replace(/\D/g, ''); // Keep only numbers for internal state
            if (numbers.length <= 11) {
                const formatted = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                setCpfFormated(formatted);
                setFormData(prev => ({ ...prev, [name]: numbers })); // Store clean CPF
                setErrors(prev => ({ ...prev, cpf: validateCpf(numbers) })); // Validate clean CPF
            }
        } else if (name === 'cellphone') {
            // Basic formatting for phone number (can be more sophisticated)
            const cleaned = value.replace(/\D/g, '');
            let formattedPhone = cleaned;
            if (cleaned.length > 0) {
                formattedPhone = `(${cleaned.substring(0, 2)}`;
                if (cleaned.length > 2) {
                    formattedPhone += `) ${cleaned.substring(2, 7)}`;
                    if (cleaned.length > 7) {
                        formattedPhone += `-${cleaned.substring(7, 11)}`;
                    }
                }
            }
            setFormData(prev => ({ ...prev, [name]: formattedPhone }));
            setErrors(prev => ({ ...prev, cellphone: validateCellphone(formattedPhone) }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'CursoId' ? Number(value) : value,
            }));
            // Validate other fields on change
            if (name === 'name') setErrors(prev => ({ ...prev, name: validateRequired(value, 'Nome completo') }));
            if (name === 'email') setErrors(prev => ({ ...prev, email: validateEmail(value) }));
            if (name === 'institucionalEmail') setErrors(prev => ({ ...prev, institucionalEmail: validateEmail(value) }));
            if (name === 'CursoId') setErrors(prev => ({ ...prev, CursoId: validateRequired(value, 'Curso') }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Run all validations before submission
        const currentErrors = {
            cpf: validateCpf(formData.cpf),
            name: validateRequired(formData.name, 'Nome completo'),
            email: validateEmail(formData.email),
            institucionalEmail: validateEmail(formData.institucionalEmail),
            cellphone: validateCellphone(formData.cellphone),
            CursoId: validateRequired(formData.CursoId.toString(), 'Curso'), // Convert CursoId to string for validation
        };

        setErrors(currentErrors);

        // Check if there are any errors
        const hasErrors = Object.values(currentErrors).some(error => error !== '');
        if (hasErrors) {
            alert('Por favor, corrija os erros no formulário antes de salvar.');
            return;
        }

        try {
            if (editingStudent && onUpdateStudent) {
                // Update Student (PUT request)
                const response = await fetch(`http://localhost:3000/alunos/${editingStudent.id}`, { // Assuming /alunos/{id} for PUT
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        nome: formData.name,
                        emailInstitucional: formData.institucionalEmail,
                        emailPessoal: formData.email,
                        cursoID: Number(formData.CursoId),
                        cpf: formData.cpf,
                        telefone: formData.cellphone,
                        // Assuming roles are handled by backend or not updated here
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao atualizar aluno: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
                }

                const updatedStudent: Student = await response.json(); // API should return updated student
                onUpdateStudent(updatedStudent); // Call parent update handler
                alert('Aluno atualizado com sucesso!');

            } else {
                // Add New Student (POST request)
                const response = await fetch('http://localhost:3000/register', { // Using your /register endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        nome: formData.name,
                        emailInstitucional: formData.institucionalEmail,
                        emailPessoal: formData.email,
                        senha: `${formData.cpf}`, // Using CPF as initial password
                        Aluno: { cursoID: Number(formData.CursoId) },
                        cpf: formData.cpf,
                        telefone: formData.cellphone.replace(/\D/g, ''), // Send clean phone number to API
                        papeis: ['ALUNO'],
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao adicionar aluno: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
                }

                const newStudentData = await response.json(); // Assuming API returns the created student
                onAddStudent(newStudentData); // Call parent add handler
                alert('Aluno adicionado com sucesso!');
            }
        } catch (err: any) {
            console.error('Erro ao processar aluno:', err.message);
            alert(`Erro ao salvar o aluno: ${err.message}`);
        }

        setFormData(initialFormState); // Reset form after successful submission
        setCpfFormated(''); // Clear formatted CPF after submission
        setErrors({ // Clear errors after submission
            cpf: '', name: '', email: '', institucionalEmail: '', cellphone: '', CursoId: '',
        });
        if (onCancel) onCancel(); // Call onCancel to hide form if applicable
    };

    return (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                {editingStudent ? 'Editar Aluno' : 'Adicionar Aluno'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { name: 'name', label: 'Nome completo *', type: 'text', placeholder: 'Nome do aluno' },
                        { name: 'email', label: 'Email Pessoal *', type: 'email', placeholder: 'email@gmail.com' },
                        { name: 'institucionalEmail', label: 'Email Institucional *', type: 'email', placeholder: 'aluno@universidade.edu' },
                        { name: 'cellphone', label: 'Telefone *', type: 'text', placeholder: '(00) 00000-0000' },
                    ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={(formData as any)[name]}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border-2 ${ (errors as any)[name] ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500 focus:outline-none`}
                                placeholder={placeholder}
                                required
                            />
                            {(errors as any)[name] && <p className="text-red-500 text-sm mt-1">{(errors as any)[name]}</p>}
                        </div>
                    ))}
                    {/* CPF field separately due to specific formatting */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                        <input
                            type="text"
                            name="cpf"
                            value={cpfFormated} // Use formatted CPF for display
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border-2 ${ errors.cpf ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500 focus:outline-none`}
                            placeholder="000.000.000-00"
                            maxLength={14} // Max length for formatted CPF
                            required
                        />
                        {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
                        <select
                            name="CursoId"
                            value={formData.CursoId}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border-2 ${ errors.CursoId ? 'border-red-500' : 'border-gray-300'} rounded focus:border-purple-500`}
                            required
                        >
                            <option value="">Selecione um curso</option>
                            {cursos.map(curso => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.nome} — {curso.departamento || 'Sem departamento'}
                                </option>
                            ))}
                        </select>
                        {errors.CursoId && <p className="text-red-500 text-sm mt-1">{errors.CursoId}</p>}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors font-medium"
                    >
                        {editingStudent ? 'Atualizar Aluno' : 'Adicionar Aluno'}
                    </button>

                    {onCancel && ( // Only show cancel button if onCancel prop is provided
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddStudentForm;