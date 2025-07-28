# Guide de Déploiement - API Fastify MesBlocs

Ce guide détaille le processus de déploiement automatique de l'API Fastify sur votre serveur Raspberry Pi.

## Architecture de Déploiement

- **Server**: Raspberry Pi (192.168.1.10:2222)
- **User**: michel
- **App Directory**: `/opt/back/mesBlocs-api-fastify`
- **Service**: `fastifyapi` (systemd)
- **Port**: 8080

## Installation Initiale sur le Serveur

### 1. Connexion au serveur
```bash
ssh -p 2222 michel@192.168.1.10
```

### 2. Configuration initiale de l'application
```bash
# Télécharger et exécuter le script de setup
sudo ./deploy/setup-server.sh
```

### 3. Configuration du GitHub Actions Runner
```bash
# Préparer la configuration du runner
sudo ./deploy/setup-github-runner.sh
```

Suivez ensuite les instructions affichées pour configurer le runner avec votre token GitHub.

## Structure des Services

### Service systemd: `fastifyapi`
- **Location**: `/etc/systemd/system/fastifyapi.service`
- **User**: michel
- **Working Directory**: `/opt/back/mesBlocs-api-fastify`
- **Command**: `/opt/nodejs/bin/node dist/server.js`

### Commandes utiles
```bash
# Status du service
sudo systemctl status fastifyapi

# Redémarrer le service
sudo systemctl restart fastifyapi

# Voir les logs
sudo journalctl -u fastifyapi -f

# Arrêter/démarrer
sudo systemctl stop fastifyapi
sudo systemctl start fastifyapi
```

## Déploiement Automatique

### GitHub Actions Workflow
Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement sur les push vers `main`.

**Étapes du déploiement:**
1. 📥 Pull du code depuis GitHub
2. 📦 Installation des dépendances (`npm ci`)
3. 🔨 Génération du client Prisma
4. 🗄️ Application des migrations DB
5. 🏗️ Build TypeScript (`npm run build`)
6. 🚀 Redémarrage du service
7. ✅ Vérification du déploiement

### Vérifications Automatiques
- HTTP status check sur `http://localhost:8080/api/sessions`
- Codes attendus: 200, 403, 405
- Timeout: 15 secondes

## Configuration de Production

### Variables d'environnement
Le fichier `deploy/production.env` contient la configuration:
- `NODE_ENV=production`
- `PORT=8080`
- `DATABASE_URL=file:./prisma/dev.db`
- `CORS_ORIGIN` configuré pour le frontend

### Base de Données
- Type: SQLite (fichier local)
- Location: `prisma/dev.db`
- Migrations automatiques via Prisma

## Troubleshooting

### Service ne démarre pas
```bash
# Vérifier les logs
sudo journalctl -u fastifyapi -n 50

# Vérifier les permissions
ls -la /opt/back/mesBlocs-api-fastify/dist/
```

### Build échoue
```bash
# Vérifier Node.js et npm
/opt/nodejs/bin/node -v
/opt/nodejs/bin/npm -v

# Nettoyer et rebuild
cd /opt/back/mesBlocs-api-fastify
rm -rf node_modules dist
npm ci
npm run build
```

### API inaccessible
```bash
# Vérifier le port
sudo netstat -tlnp | grep :8080

# Test local
curl http://localhost:8080/api/sessions
```

## Monitoring

### Logs de l'application
```bash
# Logs en temps réel
sudo journalctl -u fastifyapi -f

# Logs des dernières 24h
sudo journalctl -u fastifyapi --since "24 hours ago"
```

### Status système
```bash
# Santé générale
sudo systemctl status fastifyapi

# Usage ressources
top -p $(pgrep -f "node dist/server.js")
```

## URLs de l'Application

- **API Backend**: `http://mesblocs-api:8080/api/`
- **Frontend**: `http://mesblocs-app:3000/`
- **Local API**: `http://192.168.1.10:8080/api/`

## Sécurité

- Service run sous l'utilisateur `michel` (non-root)
- CORS configuré pour le frontend uniquement
- Base de données locale (pas d'exposition réseau)
- Logs centralisés via systemd

---

**Note**: Assurez-vous que le repository GitHub contient la bonne URL dans le script `setup-github-runner.sh` avant de l'exécuter.