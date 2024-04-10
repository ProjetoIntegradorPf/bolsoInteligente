# Use a imagem oficial do Python como base
FROM python:3.9-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo requirements.txt para o diretório de trabalho
COPY requirements.txt requirements.txt

# Instala as dependências do projeto
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o conteúdo do diretório atual para o diretório de trabalho
COPY . .

# Expõe a porta 8000, que é a porta padrão do Uvicorn
EXPOSE 8000

# Comando para executar o servidor Uvicorn ao iniciar o container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
