import { FilterType } from "@/components/Search";
import api from "./api";

export interface SearchQueryResult {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

/**
 * Fetch search results from the external API.
 *
 * @param {string} query - The search query.
 * @param {string} filter - The filter parameter.
 * @param {object} [fetchOptions={}] - Optional fetch options.
 * @returns {Promise<any>} The parsed JSON response.
 */
export async function fetchSearch(query: string, filter: FilterType, fetchOptions = {}): Promise<SearchQueryResult[]> {
    const url = `https://jsonplaceholder.typicode.com/todos?q=${query}&f=${filter? filter.toString() : ""}`
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    // TODO: Implement this in backend
    // const url = `/search?q=${encodeURIComponent(query)}&f=${encodeURIComponent(filter? filter.toString() : "")}`
    // const {data} = await api.get(url, fetchOptions);
  
    return data;
  }