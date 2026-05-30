# ============================================================
# API FESF-SUS — Backend
# Desenvolvido com FastAPI (Python)
# Gerencia pacientes e consultas via endpoints REST
# ============================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

# Inicializa a aplicação FastAPI com título e descrição
app = FastAPI(
    title="FESF-SUS API",
    description="API de gerenciamento de pacientes e consultas",
    version="1.0.0"
)

# Configuração de CORS — permite que o frontend (Next.js)
# se comunique com esta API sem bloqueio de segurança do navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # endereço do frontend
    allow_credentials=True,
    allow_methods=["*"],   # permite GET, POST, PUT, DELETE etc.
    allow_headers=["*"],
)

# ============================================================
# MODELOS DE DADOS
# Define a estrutura dos dados que a API recebe e retorna
# ============================================================

class Paciente(BaseModel):
    """Dados obrigatórios para cadastrar um paciente"""
    nome: str
    cpf: str
    data_nascimento: str
    telefone: Optional[str] = None  # campo opcional

class PacienteResponse(Paciente):
    """Resposta completa com ID gerado e data de criação"""
    id: str
    criado_em: str

class Consulta(BaseModel):
    """Dados obrigatórios para registrar uma consulta"""
    paciente_id: str       # ID do paciente vinculado
    descricao: str
    data_consulta: str

class ConsultaResponse(Consulta):
    """Resposta completa com ID gerado e data de criação"""
    id: str
    criado_em: str

# ============================================================
# BANCO DE DADOS EM MEMÓRIA
# Listas que armazenam os dados enquanto o servidor está rodando
# ============================================================

pacientes_db: List[PacienteResponse] = []
consultas_db: List[ConsultaResponse] = []

# ============================================================
# ROTAS — PACIENTES
# ============================================================

@app.get("/", tags=["Root"])
def root():
    """Rota raiz — verifica se a API está funcionando"""
    return {"mensagem": "API FESF-SUS funcionando!", "versao": "1.0.0"}

@app.get("/pacientes", response_model=List[PacienteResponse], tags=["Pacientes"])
def listar_pacientes():
    """Retorna todos os pacientes cadastrados"""
    return pacientes_db

@app.post("/pacientes", response_model=PacienteResponse, status_code=201, tags=["Pacientes"])
def criar_paciente(paciente: Paciente):
    """Cadastra um novo paciente com ID único gerado automaticamente"""
    novo = PacienteResponse(
        id=str(uuid.uuid4()),                  # gera ID único
        criado_em=datetime.now().isoformat(),  # registra data/hora atual
        **paciente.dict()
    )
    pacientes_db.append(novo)
    return novo

@app.get("/pacientes/{paciente_id}", response_model=PacienteResponse, tags=["Pacientes"])
def buscar_paciente(paciente_id: str):
    """Busca um paciente específico pelo seu ID"""
    for p in pacientes_db:
        if p.id == paciente_id:
            return p
    # Se não encontrar, retorna erro 404
    raise HTTPException(status_code=404, detail="Paciente não encontrado")

@app.put("/pacientes/{paciente_id}", response_model=PacienteResponse, tags=["Pacientes"])
def atualizar_paciente(paciente_id: str, dados: Paciente):
    """Atualiza os dados de um paciente existente"""
    for i, p in enumerate(pacientes_db):
        if p.id == paciente_id:
            # Mantém o ID e a data de criação originais
            pacientes_db[i] = PacienteResponse(
                id=paciente_id,
                criado_em=p.criado_em,
                **dados.dict()
            )
            return pacientes_db[i]
    raise HTTPException(status_code=404, detail="Paciente não encontrado")

@app.delete("/pacientes/{paciente_id}", tags=["Pacientes"])
def deletar_paciente(paciente_id: str):
    """Remove um paciente do sistema pelo seu ID"""
    for i, p in enumerate(pacientes_db):
        if p.id == paciente_id:
            pacientes_db.pop(i)
            return {"mensagem": "Paciente removido com sucesso"}
    raise HTTPException(status_code=404, detail="Paciente não encontrado")

# ============================================================
# ROTAS — CONSULTAS
# ============================================================

@app.get("/consultas", response_model=List[ConsultaResponse], tags=["Consultas"])
def listar_consultas():
    """Retorna todas as consultas registradas"""
    return consultas_db

@app.post("/consultas", response_model=ConsultaResponse, status_code=201, tags=["Consultas"])
def criar_consulta(consulta: Consulta):
    """Registra uma nova consulta vinculada a um paciente existente"""
    # Verifica se o paciente informado existe antes de criar a consulta
    ids_existentes = [p.id for p in pacientes_db]
    if consulta.paciente_id not in ids_existentes:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    nova = ConsultaResponse(
        id=str(uuid.uuid4()),
        criado_em=datetime.now().isoformat(),
        **consulta.dict()
    )
    consultas_db.append(nova)
    return nova

@app.get("/consultas/{consulta_id}", response_model=ConsultaResponse, tags=["Consultas"])
def buscar_consulta(consulta_id: str):
    """Busca uma consulta específica pelo seu ID"""
    for c in consultas_db:
        if c.id == consulta_id:
            return c
    raise HTTPException(status_code=404, detail="Consulta não encontrada")
