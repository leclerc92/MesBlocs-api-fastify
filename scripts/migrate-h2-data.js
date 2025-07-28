const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Script de migration des données H2 vers SQLite
// Ce script va lire les données depuis le backup H2 et les insérer dans SQLite

const prisma = new PrismaClient()

// Données example - tu devras ajuster selon ta structure H2
const h2DataExample = {
  sessions: [
    // Structure attendue : { id, date, createdAt }
  ],
  blocs: [
    // Structure attendue : { id, sessionId, difficulty, style, retry, terminate, createdAt }
  ],
  users: [
    // Structure attendue : { id, email, firstName, lastName, password, isActive, createdAt }
  ]
}

async function migrateData() {
  try {
    console.log('🚀 Début de la migration des données H2 vers SQLite')

    // 1. Nettoyer la base actuelle (optionnel)
    console.log('🧹 Nettoyage des données existantes...')
    await prisma.bloc.deleteMany()
    await prisma.session.deleteMany()
    // await prisma.user.deleteMany() // Décommenter si tu veux aussi migrer les users

    // 2. Migrer les sessions
    console.log('📅 Migration des sessions...')
    const sessions = [
      // Tu devras remplacer par tes vraies données H2
      { id: 1, date: new Date('2024-01-15'), createdAt: new Date('2024-01-15') },
      { id: 2, date: new Date('2024-01-20'), createdAt: new Date('2024-01-20') },
    ]

    for (const session of sessions) {
      await prisma.session.create({
        data: {
          id: session.id,
          date: session.date,
          createdAt: session.createdAt
        }
      })
    }
    console.log(`✅ ${sessions.length} sessions migrées`)

    // 3. Migrer les blocs
    console.log('🧗 Migration des blocs...')
    const blocs = [
      // Tu devras remplacer par tes vraies données H2
      { 
        id: 1, 
        sessionId: 1, 
        difficulty: 6, 
        style: 'crimping', 
        retry: 3, 
        terminate: true,
        createdAt: new Date('2024-01-15')
      },
      { 
        id: 2, 
        sessionId: 1, 
        difficulty: 7, 
        style: 'slopers', 
        retry: 5, 
        terminate: false,
        createdAt: new Date('2024-01-15')
      },
    ]

    for (const bloc of blocs) {
      await prisma.bloc.create({
        data: {
          id: bloc.id,
          sessionId: bloc.sessionId,
          difficulty: bloc.difficulty,
          style: bloc.style,
          retry: bloc.retry,
          terminate: bloc.terminate,
          createdAt: bloc.createdAt
        }
      })
    }
    console.log(`✅ ${blocs.length} blocs migrés`)

    // 4. Vérification
    const sessionCount = await prisma.session.count()
    const blocCount = await prisma.bloc.count()
    
    console.log('📊 Résumé de la migration :')
    console.log(`   Sessions : ${sessionCount}`)
    console.log(`   Blocs : ${blocCount}`)
    console.log('🎉 Migration terminée avec succès !')

  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Fonction pour extraire les données du backup H2
function extractH2Data(backupPath) {
  console.log('🔍 Extraction des données H2...')
  console.log('⚠️  ATTENTION: Tu dois fournir les vraies données H2')
  console.log('   Le fichier .mv.db nécessite un outil H2 pour être lu')
  console.log('   Options possibles :')
  console.log('   1. Utiliser H2 Console pour exporter en CSV/SQL')
  console.log('   2. Utiliser un outil Java pour lire le fichier')
  console.log('   3. Fournir les données manuellement dans ce script')
  
  // Retourner des données exemple pour l'instant
  return {
    sessions: [],
    blocs: [],
    users: []
  }
}

if (require.main === module) {
  migrateData()
}

module.exports = { migrateData, extractH2Data }