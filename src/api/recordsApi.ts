import axios from "axios";
import { Record } from "../types/Record";

const API_URL = "http://localhost:3001/records";

export async function fetchRecords(start = 0, limit = 20): Promise<Record[]> {
    const { data } = await axios.get<Record[]>(`${API_URL}?_start=${start}&_limit=${limit}`);
    return data;
}

export async function createRecord(record: Omit<Record, "id">): Promise<Record> {
    const { data } = await axios.post<Record>(API_URL, record);
    return data;
}

