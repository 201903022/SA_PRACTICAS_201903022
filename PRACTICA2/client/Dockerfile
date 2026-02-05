FROM node:20-alpine

WORKDIR /app

# Instalar deps primero (cache)
COPY package*.json ./
RUN npm install

# Copiar codigo
COPY . .

EXPOSE 5173

# Vite debe escuchar en 0.0.0.0 dentro del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
