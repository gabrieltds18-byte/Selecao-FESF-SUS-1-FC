"use client";
import { useEffect, useState } from "react";

const API = "http://localhost:8000";

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone?: string;
  criado_em: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({ nome: "", cpf: "", data_nascimento: "", telefone: "" });
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const carregar = () => {
    fetch(`${API}/pacientes`).then(r => r.json()).then(setPacientes).catch(() => setErro("Erro ao conectar com a API"));
  };

  useEffect(() => { carregar(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvar = async () => {
    setLoading(true); setMsg(""); setErro("");
    try {
      const res = await fetch(`${API}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setMsg("Paciente cadastrado com sucesso!");
      setForm({ nome: "", cpf: "", data_nascimento: "", telefone: "" });
      carregar();
    } catch {
      setErro("Erro ao cadastrar paciente.");
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (id: string) => {
    if (!confirm("Remover paciente?")) return;
    await fetch(`${API}/pacientes/${id}`, { method: "DELETE" });
    carregar();
  };

  return (
    <>
      <h1>👤 Pacientes</h1>
      <p className="subtitulo">Cadastre e gerencie os pacientes do sistema.</p>

      <div className="card">
        <h2>Novo Paciente</h2>
        {msg && <div className="alert alert-sucesso">{msg}</div>}
        {erro && <div className="alert alert-erro">{erro}</div>}
        <label>Nome completo</label>
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Maria Silva" />
        <label>CPF</label>
        <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
        <label>Data de Nascimento</label>
        <input name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} />
        <label>Telefone (opcional)</label>
        <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(71) 99999-9999" />
        <button className="btn btn-primary" onClick={salvar} disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar Paciente"}
        </button>
      </div>

      <div className="card">
        <h2>Pacientes Cadastrados ({pacientes.length})</h2>
        {pacientes.length === 0 ? (
          <p style={{ color: "var(--texto-suave)" }}>Nenhum paciente cadastrado ainda.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Nome</th><th>CPF</th><th>Nascimento</th><th>Telefone</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td>{p.cpf}</td>
                  <td>{p.data_nascimento}</td>
                  <td>{p.telefone || "—"}</td>
                  <td>
                    <button className="btn btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem" }} onClick={() => deletar(p.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
