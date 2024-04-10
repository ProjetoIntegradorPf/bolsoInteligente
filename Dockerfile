# Estágio de construção do frontend
FROM node:14 AS frontend-build

WORKDIR /app/frontend

COPY frontend/app/ .

RUN npm install
RUN npm run build

# Estágio de construção do backend
FROM python:3.10 AS backend-build

WORKDIR /app/backend

COPY backend/ .

RUN pip install --no-cache-dir -r requirements.txt

# Copia os arquivos do frontend construído para o diretório de arquivos estáticos do FastAPI
COPY --from=frontend-build /app/frontend/build /app/backend/app/static

# Define o comando de inicialização do servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
