# 🏥 Seleção FESF-SUS — 1 F.C

Sistema web de gerenciamento de pacientes e consultas, desenvolvido com **Python/FastAPI** no backend e **React/Next.js** no frontend.

---

## 🚀 Tecnologias utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Backend | Python 3.11 + FastAPI + Uvicorn |
| Frontend | Next.js 14 + React 18 + TypeScript |
| Estilo | CSS puro com variáveis customizadas |

---

## 📁 Estrutura do projeto

```
├── backend/
│   ├── main.py            # API completa com todos os endpoints
│   └── requirements.txt   # Dependências do Python
│
└── frontend/
    ├── app/
    │   ├── layout.tsx         # Layout base com navegação
    │   ├── page.tsx           # Dashboard principal
    │   ├── globals.css        # Estilos globais
    │   ├── pacientes/
    │   │   └── page.tsx       # Tela de gestão de pacientes
    │   └── consultas/
    │       └── page.tsx       # Tela de gestão de consultas
    ├── package.json
    ├── next.config.js
    └── tsconfig.json
```

---

## ⚙️ Como executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API disponível em: `http://localhost:8000`
Documentação interativa: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:3000`

---

## 📡 Endpoints da API

### Pacientes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/pacientes` | Lista todos os pacientes |
| POST | `/pacientes` | Cadastra novo paciente |
| GET | `/pacientes/{id}` | Busca paciente por ID |
| PUT | `/pacientes/{id}` | Atualiza dados do paciente |
| DELETE | `/pacientes/{id}` | Remove paciente |

### Consultas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/consultas` | Lista todas as consultas |
| POST | `/consultas` | Registra nova consulta |
| GET | `/consultas/{id}` | Busca consulta por ID |

---

## 🖥️ Telas da aplicação

- **Dashboard** — visão geral com status da API e totais
- **Pacientes** — cadastro, listagem e remoção de pacientes
- **Consultas** — registro e listagem de consultas vinculadas a pacientes

---

## 📝 Observações

- O backend utiliza armazenamento em memória (sem banco de dados externo), conforme escopo do projeto
- O frontend consome a API via `fetch` nativo do JavaScript
- A documentação da API é gerada automaticamente pelo FastAPI em `/docs`
