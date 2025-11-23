import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { Cuidado, Animal } from "../../types/type";
import CuidadoForm from "./CuidadoForm";

export default function CuidadoList() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  const [cuidados, setCuidados] = useState<Cuidado[]>([]);
  const [editingCuidado, setEditingCuidado] = useState<Cuidado | null>(null);

  const fetchCuidados = async (animalId: string) => {
    if (!animalId) {
      setCuidados([]);
      return;
    }
    try {
      const res = await api.get<Cuidado[]>(`/cuidados?animalId=${animalId}`);
      setCuidados(res.data);
    } catch (error) {
      console.error("Erro ao buscar cuidados:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get<Animal[]>("/animal");
        setAnimais(res.data);
      } catch (error) {
        console.error("Erro ao buscar animais:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchAndReset = async () => {
      if (!selectedAnimal) {
        setCuidados([]);
        setEditingCuidado(null);
        return;
      }

      try {
        const res = await api.get<Cuidado[]>(`/cuidados?animalId=${selectedAnimal}`);
        setCuidados(res.data);
        setEditingCuidado(null); 
      } catch (error) {
        console.error("Erro ao buscar cuidados:", error);
      }
    };

    fetchAndReset();
  }, [selectedAnimal]);

  const handleDelete = async (id: string) => {
    await api.delete(`/cuidados/${id}`);
    fetchCuidados(selectedAnimal);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cuidados</h2>

      {/* Select de animais */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Selecione o animal</label>
        <select
          value={selectedAnimal}
          onChange={(e) => setSelectedAnimal(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="">Selecione um animal</option>
          {animais.map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
      </div>

      {selectedAnimal && animais.length > 0 && (
        <div className="mb-6">
          <CuidadoForm
            animalId={selectedAnimal}
            editingCuidado={editingCuidado}
            onSuccess={() => fetchCuidados(selectedAnimal)}
            animais={animais}
          />
        </div>
      )}

      {/* Tabela de cuidados */}
      {cuidados.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">Frequência</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cuidados.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.nome}</td>
                  <td className="p-3">{c.descricao}</td>
                  <td className="p-3">{c.frequencia}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-md transition"
                      onClick={() => setEditingCuidado(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                      onClick={() => handleDelete(c.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
