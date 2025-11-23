import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../api/api";
import type { Cuidado, Animal } from "../../types/type";

interface Props {
  editingCuidado?: Cuidado | null;
  animalId: string;
  onSuccess: () => void;
  animais: Animal[];
}

const schema = yup.object({
  nome: yup.string().required("Selecione o cuidado"),
  descricao: yup.string().required("Descrição obrigatória"),
  frequencia: yup.string().required("Frequência obrigatória"),
  animalId: yup.string().required("Selecione um animal"),
}).required();

type CuidadoFormData = yup.InferType<typeof schema>;

export default function CuidadoForm({ editingCuidado, animalId, onSuccess, animais }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CuidadoFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editingCuidado) {
      reset({
        nome: editingCuidado.nome,
        descricao: editingCuidado.descricao,
        frequencia: editingCuidado.frequencia,
        animalId: editingCuidado.animalId,
      });
    } else {
      reset({ animalId });
    }
  }, [editingCuidado, reset, animalId]);


  const onSubmit = async (data: CuidadoFormData) => {
    try {
      if (editingCuidado) {
        const payload = {
          Id: editingCuidado.id,
          Nome: data.nome,
          Descricao: data.descricao,
          Frequencia: data.frequencia,
        };

        await api.put(`/cuidados/${editingCuidado.id}`, payload);
      } else {
        const payload = {
          Nome: data.nome,
          Descricao: data.descricao,
          Frequencia: data.frequencia,
          AnimalId: data.animalId,
        };

        await api.post("/cuidados", payload);
      }

      reset({
        animalId: "",
        descricao: "",
        frequencia: "",
        nome: ""
      });
      onSuccess();
    } catch (error: unknown) {
      console.error("Erro ao salvar cuidado:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-md">
      
      <label className="text-gray-700 font-medium">Animal</label>
      <select {...register("animalId")} className="border rounded-md p-2">
        <option value="">Selecione um animal</option>
        {(animais || []).map(a => (
          <option key={a.id} value={a.id}>{a.nome}</option>
        ))}
      </select>
      <p className="text-red-500 text-sm">{errors.animalId?.message}</p>

      <label className="text-gray-700 font-medium">Tipo de Cuidado</label>
      <select {...register("nome")} className="border rounded-md p-2">
        <option value="">Selecione o cuidado</option>
        <option value="Alimentação">Alimentação</option>
        <option value="Exame Veterinário">Exame Veterinário</option>
        <option value="Vacinação">Vacinação</option>
        <option value="Treinamento">Treinamento</option>
      </select>
      <p className="text-red-500 text-sm">{errors.nome?.message}</p>

      <label className="text-gray-700 font-medium">Descrição</label>
      <input {...register("descricao")} placeholder="Descrição" className="border rounded-md p-2" />
      <p className="text-red-500 text-sm">{errors.descricao?.message}</p>

      <label className="text-gray-700 font-medium">Frequência</label>
      <input {...register("frequencia")} placeholder="Frequência (diária, semanal...)" className="border rounded-md p-2" />
      <p className="text-red-500 text-sm">{errors.frequencia?.message}</p>

      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-medium p-2 rounded-md transition">
        {editingCuidado ? "Atualizar" : "Cadastrar"}
      </button>
    </form>
  );
}
