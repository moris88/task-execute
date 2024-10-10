# Progetto Node.js

Questo è un progetto di esempio per mostrare come creare un'applicazione Node.js con Docker.

## Come usare

Per iniziare, clona il repository sul tuo computer e installa le dipendenze.

```bash
git clone
cd mio-progetto-node
npm install
```

Per buildare l'applicazione, esegui il comando:

```bash
npm run build
```

Per avviare l'applicazione, esegui il comando:

```bash
npm start
```

## Docker

Per eseguire l'applicazione con Docker, esegui i seguenti comandi:

```bash
docker build -t mio-progetto-node .
docker run -p 3000:3000 mio-progetto-node
```
