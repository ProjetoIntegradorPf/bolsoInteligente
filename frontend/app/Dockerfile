# Use uma imagem base do node para construir o aplicativo React
FROM node:alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e package-lock.json (ou yarn.lock) para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do aplicativo
RUN npm install

# Copie o código do aplicativo para o diretório de trabalho
COPY . .

# Construa o aplicativo React
RUN npm run build

# Exponha a porta 3000 do contêiner
EXPOSE 3000

# Comando para iniciar o servidor web do aplicativo React
CMD ["npm", "start"]
