Set-Location 'C:\Backup_Projects\CFH\frontend'
$new = @'
import React, { useState } from "react";
import axios from "axios";
import Navbar from "../needsHome/Navbar";

type FormData = {
  make: string;
  model: string;
  year: number | string;
  condition: string;
};

const API_URL =
  (import.meta as any)?.env?.VITE_API_URL ??
  (process.env as any)?.REACT_APP_API_URL ??
  "";

export default function TradeInForm() {
  const [formData, setFormData] = useState<FormData>({
    make: "",
    model: "",
    year: "",
    condition: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await axios.post(
        `${API_URL}/api/tradein/evaluate`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Trade-in value: $${res.data?.value ?? "N/A"}`);
    } catch (err: any) {
      setMessage(
        `❌ Failed to evaluate trade-in${
          err?.response?.data?.message ? `: ${err.response.data.message}` : ""
        }`
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Trade-In Evaluation</h1>
        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Make"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Year"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: Number(e.target.value) })
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Condition"
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Evaluate Trade-In
          </button>
        </form>
      </div>
    </div>
  );
}
'@
$new | Set-Content -Path .\src\components\needsHome\TradeInForm.tsx -Encoding UTF8
