# FASE 1: Build
FROM node:22-slim AS builder

# Directory di lavoro per il build
WORKDIR /app

# Copia i file di definizione delle dipendenze
COPY package*.json ./

# Installa tutte le dipendenze (inclusi dev) per build e lint
RUN npm ci

# Copia tutto il resto del codice
COPY . .

# Lint + build dell'app
RUN npm run lint && npm run build

# FASE 2: Immagine finale per runtime
FROM node:22-slim

# Crea un utente non root per eseguire l'app in sicurezza
RUN useradd -m appuser

# Crea directory log e imposta permessi
RUN mkdir -p /logs && chown -R appuser:appuser /logs

# Directory di lavoro
WORKDIR /batch

# Dopo WORKDIR /batch
RUN mkdir -p /batch/logs && chown -R appuser:appuser /batch/logs

# Copia solo ciò che serve per il runtime
COPY --chown=appuser:appuser --from=builder /app/dist ./dist
COPY --chown=appuser:appuser --from=builder /app/package*.json ./

# Installa solo dipendenze di produzione
RUN npm ci --omit=dev

# Usa l'utente non root
USER appuser

# Espone la porta dell'app
EXPOSE 8080

# Healthcheck (opzionale ma consigliato)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node dist/index.cjs health || exit 1

# Comando di avvio dell'app
CMD ["node", "dist/index.cjs"]
