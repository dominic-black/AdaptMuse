import { Entity } from "@/types/entity";

export const getEntityContent = async (query: string, type: string): Promise<Entity | null> => {
    const response = await fetch(`/api/entity?query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
    if (!response.ok) {
      // Handle error
      return null;
    }
    const data = await response.json();
    return data.entity ?? null;
  };
  