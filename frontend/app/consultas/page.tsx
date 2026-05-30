// ============================================================
// Página de Consultas
// Permite registrar e listar consultas vinculadas a pacientes
// O paciente deve ser cadastrado antes de criar uma consulta
// ============================================================

"use client";
import { useEffect, useState } from "react";

const API = "http://localhost:8000";

// Tipagem simplificada do paciente (só o necessário para o select)
interface Paciente { id: string; nome: string; }

// Tipagem completa da consulta retornada pela API
interface Consulta {
  id: string;
  paciente_id: string;
  descricao: string;
  data_consulta: string;
  criado_em: string;
}

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]); // para preencher o select

  // Dados do formulário de nova consulta
  const [form, setForm] = useState({
    paciente_id: "",
    descricao: "",
    data_consulta: ""
  });

  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  // Carrega consultas e pacientes da API
  const carregar = () => {
    fetch(`${API}/consultas`).then(r => r.json()).then(setConsultas).catch(() => {});
    fetch(`${API}/pacientes`).then(r => r.json()).then(setPacientes).catch(() => {});
  };

  useEffect(() => { carregar(); }, []);

  // Atualiza o formulário conforme o usuário preenche os campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia a nova consulta para a API
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
      setForm({ paciente_id: "", descricao: "", data_consulta: "" }); // limpa o formulário
      carregar();
    } catch {
      setErro("Erro ao registrar consulta. Verifique se o paciente existe.");
    }
  };

  // Retorna o nome do paciente a partir do ID (para exibir na tabela)
  const nomePaciente = (id: string) =>
    pacientes.find(p => p.id === id)?.nome || "—";

  return (
    <>
      <h1>📋 Consultas</h1>
      <p className="subtitulo">Registre e acompanhe as consultas dos pacientes.</p>

      {/* Formulário de registro de consulta */}
      <div className="card">
        <h2>Nova Consulta</h2>

        {msg && <div className="alert alert-sucesso">{msg}</div>}
        {erro && <div className="alert alert-erro">{erro}</div>}

        {/* Select populado dinamicamente com os pacientes cadastrados */}
        <label>Paciente</label>
        <select name="paciente_id" value={form.paciente_id} onChange={handleChange}>
          <option value="">Selecione um paciente...</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <label>Data da Consulta</label>
        <input name="data_consulta" type="date" value={form.data_consulta} onChange={handleChange} />

        <label>Descrição</label>
        <input
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descreva o motivo da consulta..."
        />

        <button className="btn btn-primary" onClick={salvar}>Registrar Consulta</button>
      </div>

      {/* Tabela com todas as consultas registradas */}
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
                  {/* Exibe o nome do paciente em vez do ID */}
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
