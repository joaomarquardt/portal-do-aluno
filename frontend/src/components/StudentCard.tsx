import { useState } from 'react';
import { Users, Mail, Calendar, Edit, Trash2 } from "lucide-react";

interface Student {
  id: number;
  cpf: string;
  name: string;
  email: string;
  institucionalEmail: string;
  cellphone: string;
  CursoId: number;
}

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentCard = ({ student, onEdit, onDelete }: StudentCardProps) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Users className="text-blue-500 mr-2" size={20} />
          <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="text-blue-500 hover:text-blue-700 p-1"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <Mail className="text-gray-500 mr-2" size={16} />
          <span className="text-gray-600">{student.email}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
