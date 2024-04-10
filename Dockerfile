# Use a imagem base do Python para o backend
FROM python:3.10 AS backend-build

# Define o diretório de trabalho para o backend
WORKDIR /app/backend

# Copia os arquivos do backend
COPY backend/ .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Use a imagem base do Node.js para o frontend
FROM node:14 AS frontend-build

# Define o diretório de trabalho para o frontend
WORKDIR /app/frontend

# Copia os arquivos do frontend
COPY frontend/app/package*.json ./
COPY frontend/app/public ./public
COPY frontend/app/src ./src

# Instala as dependências do npm e constrói o frontend
RUN npm install
RUN npm run build

# Copia os arquivos do frontend construído para o diretório de arquivos estáticos do FastAPI
COPY --from=frontend-build /app/frontend/build /app/backend/app/static

# Define o comando de inicialização do servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
