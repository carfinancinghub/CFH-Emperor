// Auto-generated minimal stub (safe). Replace with real endpoints later.
import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:8080';

export async function ping() {
  const { data } = await axios.get(\\/health\);
  return data;
}
export default { ping };
