// ============================================================
// Página de Pacientes
// Permite cadastrar, listar e remover pacientes
// Se comunica com a API FastAPI via fetch
// ============================================================

"use client"; // componente interativo — roda no navegador
import { useEffect, useState } from "react";

const API = "http://localhost:8000";

// Tipagem do objeto paciente retornado pela API
interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone?: string;  // campo opcional
  criado_em: string;
}

export default function PacientesPage() {
  // Lista de pacientes carregada da API
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  // Dados do formulário de cadastro
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    telefone: ""
  });

  // Mensagens de feedback para o usuário
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Busca a lista de pacientes da API
  const carregar = () => {
    fetch(`${API}/pacientes`)
      .then(r => r.json())
      .then(setPacientes)
      .catch(() => setErro("Erro ao conectar com a API"));
  };

  // Carrega os pacientes ao abrir a página
  useEffect(() => { carregar(); }, []);

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envia o formulário para a API — cadastra novo paciente
  const salvar = async () => {
    setLoading(true); setMsg(""); setErro("");
    try {
      const res = await fetch(`${API}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // envia os dados como JSON
      });
      if (!res.ok) throw new Error();
      setMsg("Paciente cadastrado com sucesso!");
      setForm({ nome: "", cpf: "", data_nascimento: "", telefone: "" }); // limpa o formulário
      carregar(); // recarrega a lista
    } catch {
      setErro("Erro ao cadastrar paciente.");
    } finally {
      setLoading(false);
    }
  };

  // Remove um paciente pelo ID após confirmação
  const deletar = async (id: string) => {
    if (!confirm("Remover paciente?")) return;
    await fetch(`${API}/pacientes/${id}`, { method: "DELETE" });
    carregar(); // recarrega a lista após remoção
  };

  return (
    <>
      <h1>👤 Pacientes</h1>
      <p className="subtitulo">Cadastre e gerencie os pacientes do sistema.</p>

      {/* Formulário de cadastro */}
      <div className="card">
        <h2>Novo Paciente</h2>

        {/* Alertas de sucesso ou erro */}
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

      {/* Tabela com a lista de pacientes cadastrados */}
      <div className="card">
        <h2>Pacientes Cadastrados ({pacientes.length})</h2>
        {pacientes.length === 0 ? (
          <p style={{ color: "var(--texto-suave)" }}>Nenhum paciente cadastrado ainda.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>CPF</th><th>Nascimento</th><th>Telefone</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza uma linha por paciente */}
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td>{p.cpf}</td>
                  <td>{p.data_nascimento}</td>
                  <td>{p.telefone || "—"}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem" }}
                      onClick={() => deletar(p.id)}
                    >
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
