const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};