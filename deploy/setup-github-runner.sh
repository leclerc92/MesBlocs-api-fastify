#!/bin/bash

# Script de configuration du GitHub Actions Runner pour l'API Fastify
# À exécuter sur le serveur Raspberry Pi

set -e

echo "🏃 Configuration du GitHub Actions Runner pour l'API Fastify"

# Variables (à adapter selon ton repository)
GITHUB_REPO="https://github.com/ton-username/mesBlocs-api-fastify"
RUNNER_NAME="rpi-api-runner"
RUNNER_DIR="/opt/github-runners/api-runner"

# Vérification des droits
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Ce script doit être exécuté avec sudo"
    exit 1
fi

echo "📁 Création du dossier runner..."
mkdir -p $RUNNER_DIR
chown michel:michel $RUNNER_DIR

echo "📥 Téléchargement du GitHub Actions Runner..."
cd $RUNNER_DIR
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -o '"tag_name": "[^"]*' | cut -d'"' -f4 | sed 's/^v//')

# Architecture ARM64 pour Raspberry Pi
wget -O actions-runner-linux-arm64.tar.gz https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-arm64-${RUNNER_VERSION}.tar.gz

tar xzf actions-runner-linux-arm64.tar.gz
chown -R michel:michel $RUNNER_DIR

echo ""
echo "⚠️  ÉTAPES MANUELLES REQUISES:"
echo ""
echo "1. Va sur GitHub dans Settings > Actions > Runners de ton repository:"
echo "   $GITHUB_REPO/settings/actions/runners"
echo ""
echo "2. Clique sur 'New self-hosted runner'"
echo ""
echo "3. Copie le token généré et exécute ces commandes en tant qu'utilisateur 'michel':"
echo ""
echo "   sudo -u michel bash"
echo "   cd $RUNNER_DIR"
echo "   ./config.sh --url $GITHUB_REPO --token TON_TOKEN_ICI --name $RUNNER_NAME"
echo ""
echo "4. Puis configure le service systemd:"

cat > /etc/systemd/system/github-runner-api.service << EOF
[Unit]
Description=GitHub Actions Runner (API)
After=network.target

[Service]
Type=simple
User=michel
WorkingDirectory=$RUNNER_DIR
ExecStart=$RUNNER_DIR/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "5. Active et démarre le service:"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable github-runner-api"
echo "   sudo systemctl start github-runner-api"
echo ""
echo "✅ Configuration préparée! Suivez les étapes manuelles ci-dessus."