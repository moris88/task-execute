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
npm run init
```

Questo comando creerà un'immagine Docker e avvierà un container con l'applicazione in esecuzione.
Per fermare il container, esegui:

```bash
npm run stop
```

## CLI

Per interagire con l'applicazione tramite la CLI, puoi utilizzare i seguenti comandi:

```bash
npm run cli
```

Questo comando avvierà un'interfaccia a riga di comando per interagire con l'applicazione.
