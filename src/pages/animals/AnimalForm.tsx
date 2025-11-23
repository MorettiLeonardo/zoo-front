import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../api/api";
import type { Animal } from "../../types/type"; 

interface Props {
  editingAnimal?: Animal | null;
  onSuccess: () => void;
}

const schema = yup.object({
  nome: yup.string().required("Nome obrigatório"),
  descricao: yup.string().required("Descrição obrigatória"),
  dataNascimento: yup.string().required("Data obrigatória"),
  especie: yup.string().required("Espécie obrigatória"),
  habitat: yup.string().required("Habitat obrigatório"),
  paisOrigem: yup.string().required("País obrigatório"),
}).required();

type AnimalFormData = yup.InferType<typeof schema>;

export default function AnimalForm({ editingAnimal, onSuccess }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnimalFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editingAnimal) {
      reset({
        nome: editingAnimal.nome,
        descricao: editingAnimal.descricao,
        dataNascimento: editingAnimal.dataNascimento,
        especie: editingAnimal.especie,
        habitat: editingAnimal.habitat,
        paisOrigem: editingAnimal.paisOrigem,
      });
    }
  }, [editingAnimal, reset]);

    const onSubmit = async (data: AnimalFormData) => {
    try {
      const payload = {
        Id: editingAnimal?.id,
        Nome: data.nome,
        Descricao: data.descricao,
        DataNascimento: new Date(data.dataNascimento),
        Especie: data.especie,
        Habitat: data.habitat,
        PaisOrigem: data.paisOrigem,
      };

      if (editingAnimal) {
        await api.put(`/animal/${editingAnimal.id}`, payload);
      } else {
        await api.post("/animal", payload);
      }

      reset({
        nome: "",
        descricao: "",
        dataNascimento: "",
        especie: "",
        habitat: "",
        paisOrigem: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar animal:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <input {...register("nome")} placeholder="Nome" className="border p-2" />
      <p className="text-red-500">{errors.nome?.message}</p>

      <input {...register("descricao")} placeholder="Descrição" className="border p-2" />
      <p className="text-red-500">{errors.descricao?.message}</p>

      <input
        type="date"
        {...register("dataNascimento")}
        className="border p-2"
      />
      <p className="text-red-500">{errors.dataNascimento?.message}</p>

      <input {...register("especie")} placeholder="Espécie" className="border p-2" />
      <p className="text-red-500">{errors.especie?.message}</p>

      <input {...register("habitat")} placeholder="Habitat" className="border p-2" />
      <p className="text-red-500">{errors.habitat?.message}</p>

      <input {...register("paisOrigem")} placeholder="País" className="border p-2" />
      <p className="text-red-500">{errors.paisOrigem?.message}</p>

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        {editingAnimal ? "Atualizar" : "Cadastrar"}
      </button>
    </form>
  );
}
