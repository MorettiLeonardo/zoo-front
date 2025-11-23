export interface Animal {
  id: string;
  nome: string;
  descricao: string;
  dataNascimento: string;
  especie: string;
  habitat: string;
  paisOrigem: string;
}

export interface Cuidado {
  id: string;
  nome: string;
  descricao: string;
  frequencia: string;
  animalId: string;
}

export type AnimalFormData = Omit<Animal, "id">;

export interface Cuidado {
  id: string;
  nome: string;
  descricao: string;
  frequencia: string;
  animalId: string;
}

export type CuidadoFormData = {
  nome: string;
  descricao: string;
  frequencia: string;
  animalId: string;
};
