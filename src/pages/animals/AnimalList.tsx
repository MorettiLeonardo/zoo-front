import { useEffect, useState } from "react";
import { api } from "../../api/api";
import type { Animal } from "../../types/type";
import AnimalForm from "./AnimalForm";

export default function AnimalList() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  const fetchAnimais = async () => {
    try {
      const res = await api.get<Animal[]>("/animal");
      setAnimais(res.data);
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/animal/${id}`);
      fetchAnimais();
    } catch (error) {
      console.error("Erro ao deletar animal:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<Animal[]>("/animal");
        setAnimais(res.data); 
      } catch (error) {
        console.error("Erro ao buscar animais:", error);
      }
    };

    fetchData(); 
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Animais</h1>

      <div className="mb-8">
        <AnimalForm
          onSuccess={() => {
            fetchAnimais();
            setEditingAnimal(null);
          }}
          editingAnimal={editingAnimal}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Espécie</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Habitat</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">País</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {animais.map((animal) => (
              <tr key={animal.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-700">{animal.nome}</td>
                <td className="px-6 py-4 text-gray-700">{animal.especie}</td>
                <td className="px-6 py-4 text-gray-700">{animal.habitat}</td>
                <td className="px-6 py-4 text-gray-700">{animal.paisOrigem}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-3 py-1 rounded-md transition"
                    onClick={() => setEditingAnimal(animal)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded-md transition"
                    onClick={() => handleDelete(animal.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {animais.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhum animal cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
