# Usa un'immagine di base ufficiale di Node.js
FROM node:20

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Esegui linting del codice
RUN npm run lint

# Compila il codice TypeScript
RUN npm run build

# Espone la porta dell'app
EXPOSE 3000

# Comando per eseguire l'app
CMD ["node", "dist/index.js"]
