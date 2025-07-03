
import { useState } from 'react';

interface Student {
  id: number;
  cpf:string;
  name: string;
  email: string;
  institucionalEmail:string;
  cellphone: string;
  CursoId: number;
  gpa: number;
}

interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  editingStudent?: Student | null;
  onUpdateStudent?: (student: Student) => void;
  onCancel?: () => void;
}

const AddStudentForm = ({ onAddStudent, editingStudent, onUpdateStudent, onCancel }: AddStudentFormProps) => {
  const [formData, setFormData] = useState({
    name: editingStudent?.name || '',
    email: editingStudent?.email || '',
    cellphone: editingStudent?.cellphone || '',
    CursoId: editingStudent?.CursoId || null,
    gpa: editingStudent?.gpa || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent && onUpdateStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData
      });
    } else {
      onAddStudent(formData);
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      cellphone: '',
      CursoId: null,
      gpa: 0
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editingStudent ? 'Edit Student' : 'Add New Student'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Enter student name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Pessoal*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="student@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Institucional*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="student@college.edu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              cellphone *
            </label>
            <input
              type="number"
              name="Telefone"
              value={formData.cellphone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Computer Science"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano
            </label>
            <select
              name="CursoId"
              value={formData.CursoId}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GPA
            </label>
            <input
              type="number"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              min="0"
              max="4"
              step="0.1"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="3.5"
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors font-medium"
          >
            {editingStudent ? 'Update Student' : 'Add Student'}
          </button>
          
          {editingStudent && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
