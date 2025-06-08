import React,{useState,useEffect} from "react";
import { FaTrash } from "react-icons/fa";


type Comunicado = {
  titulo: string;
  mensagem: string;
};
type Props = {
  comunicados: Comunicado[];
  setComunicados: React.Dispatch<React.SetStateAction<Comunicado[]>>;
};

export default function Comunicados({ comunicados, setComunicados }: Props){
      
    const removerComunicado = (indice: number) => {
        const novaLista = [...comunicados];
        novaLista.splice(indice, 1);
        setComunicados(novaLista);
    };
    return(
        <>
        <div className="listaComunicados">
            {comunicados.map((item, index) => (
                <div key={index} className="comunicado">
                <div className="comunicadoHeader">
                    <strong>{item.titulo}</strong>
                    <button
                    className="botaoLixeira"
                    onClick={() => removerComunicado(index)}
                    title="Excluir comunicado"
                    >
                    <FaTrash />
                    </button>
                </div>
                <p>{item.mensagem}</p>
                </div>
            ))}
            </div>
        </>
    )
}