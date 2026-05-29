from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(
    title="FESF-SUS API",
    description="API de gerenciamento de pacientes e consultas",
    version="1.0.0"
)

# CORS para o frontend Next.js funcionar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Modelos ----

class Paciente(BaseModel):
    nome: str
    cpf: str
    data_nascimento: str
    telefone: Optional[str] = None

class PacienteResponse(Paciente):
    id: str
    criado_em: str

class Consulta(BaseModel):
    paciente_id: str
    descricao: str
    data_consulta: str

class ConsultaResponse(Consulta):
    id: str
    criado_em: str

# ---- Banco de dados em memória ----

pacientes_db: List[PacienteResponse] = []
consultas_db: List[ConsultaResponse] = []

# ---- Rotas ----

@app.get("/", tags=["Root"])
def root():
    return {"mensagem": "API FESF-SUS funcionando!", "versao": "1.0.0"}

@app.get("/pacientes", response_model=List[PacienteResponse], tags=["Pacientes"])
def listar_pacientes():
    return pacientes_db

@app.post("/pacientes", response_model=PacienteResponse, status_code=201, tags=["Pacientes"])
def criar_paciente(paciente: Paciente):
    novo = PacienteResponse(
        id=str(uuid.uuid4()),
        criado_em=datetime.now().isoformat(),
        **paciente.dict()
    )
    pacientes_db.append(novo)
    return novo

@app.get("/pacientes/{paciente_id}", response_model=PacienteResponse, tags=["Pacientes"])
def buscar_paciente(paciente_id: str):
    for p in pacientes_db:
        if p.id == paciente_id:
            return p
    raise HTTPException(status_code=404, detail="Paciente não encontrado")

@app.put("/pacientes/{paciente_id}", response_model=PacienteResponse, tags=["Pacientes"])
def atualizar_paciente(paciente_id: str, dados: Paciente):
    for i, p in enumerate(pacientes_db):
        if p.id == paciente_id:
            pacientes_db[i] = PacienteResponse(
                id=paciente_id,
                criado_em=p.criado_em,
                **dados.dict()
            )
            return pacientes_db[i]
    raise HTTPException(status_code=404, detail="Paciente não encontrado")

@app.delete("/pacientes/{paciente_id}", tags=["Pacientes"])
def deletar_paciente(paciente_id: str):
    for i, p in enumerate(pacientes_db):
        if p.id == paciente_id:
            pacientes_db.pop(i)
            return {"mensagem": "Paciente removido com sucesso"}
    raise HTTPException(status_code=404, detail="Paciente não encontrado")

@app.get("/consultas", response_model=List[ConsultaResponse], tags=["Consultas"])
def listar_consultas():
    return consultas_db

@app.post("/consultas", response_model=ConsultaResponse, status_code=201, tags=["Consultas"])
def criar_consulta(consulta: Consulta):
    # verifica se paciente existe
    ids = [p.id for p in pacientes_db]
    if consulta.paciente_id not in ids:
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
    for c in consultas_db:
        if c.id == consulta_id:
            return c
    raise HTTPException(status_code=404, detail="Consulta não encontrada")
