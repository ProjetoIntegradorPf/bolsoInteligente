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

# Define o comando de inicialização para iniciar ambos os servidores
CMD ["bash", "-c", "uvicorn main:app & npm start"]
