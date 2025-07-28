#!/bin/bash

# Script de configuration du serveur pour le déploiement de l'API Fastify
# À exécuter sur le serveur Raspberry Pi

set -e

echo "🚀 Configuration du serveur pour l'API Fastify MesBlocs"

# Vérification des droits
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Ce script doit être exécuté avec sudo"
    exit 1
fi

# Variables
USER="michel"
APP_DIR="/opt/back"
REPO_DIR="$APP_DIR/MesBlocs-api-fastify"
SERVICE_NAME="fastifyapi"

echo "📁 Création de la structure des dossiers..."
mkdir -p $APP_DIR
chown $USER:$USER $APP_DIR

echo "📥 Clonage du repository..."
if [ -d "$REPO_DIR" ]; then
    echo "Le repository existe déjà, mise à jour..."
    cd $REPO_DIR
    sudo -u $USER git pull origin main
else
    cd $APP_DIR
    # Remplace par l'URL de ton repository
    sudo -u $USER git clone https://github.com/ton-username/MesBlocs-api-fastify.git
    cd $REPO_DIR
fi

echo "📦 Installation des dépendances..."
sudo -u $USER /opt/nodejs/bin/npm ci

echo "🔨 Build de l'application..."
sudo -u $USER /opt/nodejs/bin/npm run build

echo "🗄️ Configuration de la base de données..."
sudo -u $USER /opt/nodejs/bin/npm run db:generate
sudo -u $USER /opt/nodejs/bin/npm run db:push

echo "⚙️ Configuration du service systemd..."
cp $REPO_DIR/deploy/fastifyapi.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable $SERVICE_NAME

echo "🚀 Démarrage du service..."
systemctl start $SERVICE_NAME

echo "✅ Configuration terminée!"
echo ""
echo "📊 Status du service:"
systemctl status $SERVICE_NAME --no-pager

echo ""
echo "🔗 L'API devrait être accessible sur:"
echo "  http://localhost:8080"
echo "  http://$(hostname -I | awk '{print $1}'):8080"

echo ""
echo "📝 Commandes utiles:"
echo "  sudo systemctl status $SERVICE_NAME    # Voir le status"
echo "  sudo systemctl restart $SERVICE_NAME   # Redémarrer"
echo "  sudo journalctl -u $SERVICE_NAME -f    # Voir les logs en temps réel"