"use client";
import { useEffect, useState } from "react";

const API = "http://localhost:8000";

interface Paciente { id: string; nome: string; }
interface Consulta {
  id: string;
  paciente_id: string;
  descricao: string;
  data_consulta: string;
  criado_em: string;
}

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({ paciente_id: "", descricao: "", data_consulta: "" });
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  const carregar = () => {
    fetch(`${API}/consultas`).then(r => r.json()).then(setConsultas).catch(() => {});
    fetch(`${API}/pacientes`).then(r => r.json()).then(setPacientes).catch(() => {});
  };

  useEffect(() => { carregar(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvar = async () => {
    setMsg(""); setErro("");
    try {
      const res = await fetch(`${API}/consultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setMsg("Consulta registrada com sucesso!");
      setForm({ paciente_id: "", descricao: "", data_consulta: "" });
      carregar();
    } catch {
      setErro("Erro ao registrar consulta. Verifique se o paciente existe.");
    }
  };

  const nomePaciente = (id: string) => pacientes.find(p => p.id === id)?.nome || "—";

  return (
    <>
      <h1>📋 Consultas</h1>
      <p className="subtitulo">Registre e acompanhe as consultas dos pacientes.</p>

      <div className="card">
        <h2>Nova Consulta</h2>
        {msg && <div className="alert alert-sucesso">{msg}</div>}
        {erro && <div className="alert alert-erro">{erro}</div>}
        <label>Paciente</label>
        <select name="paciente_id" value={form.paciente_id} onChange={handleChange}>
          <option value="">Selecione um paciente...</option>
          {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <label>Data da Consulta</label>
        <input name="data_consulta" type="date" value={form.data_consulta} onChange={handleChange} />
        <label>Descrição</label>
        <input name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva o motivo da consulta..." />
        <button className="btn btn-primary" onClick={salvar}>Registrar Consulta</button>
      </div>

      <div className="card">
        <h2>Consultas Registradas ({consultas.length})</h2>
        {consultas.length === 0 ? (
          <p style={{ color: "var(--texto-suave)" }}>Nenhuma consulta registrada ainda.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Paciente</th><th>Data</th><th>Descrição</th></tr>
            </thead>
            <tbody>
              {consultas.map(c => (
                <tr key={c.id}>
                  <td><strong>{nomePaciente(c.paciente_id)}</strong></td>
                  <td>{c.data_consulta}</td>
                  <td>{c.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
