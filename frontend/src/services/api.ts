import axios from "axios";
import { ApiResponse } from "../types";

export const fetchSalaryData = async (year: number): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`/data/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salary data:", error);
    throw error;
  }
};
