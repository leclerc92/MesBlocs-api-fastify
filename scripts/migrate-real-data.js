const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Migration des vraies données H2 vers SQLite
async function migrateRealData() {
  try {
    console.log('🚀 Début de la migration des données H2 vers SQLite')

    // 1. Nettoyer la base actuelle
    console.log('🧹 Nettoyage des données existantes...')
    await prisma.bloc.deleteMany()
    await prisma.session.deleteMany()

    // 2. Migrer les sessions (12 sessions)
    console.log('📅 Migration des sessions...')
    const sessions = [
      { id: 1, date: '13/02/2025' },
      { id: 2, date: '18/02/2025' },
      { id: 3, date: '25/02/2025' },
      { id: 4, date: '27/02/2025' },
      { id: 5, date: '04/03/2025' },
      { id: 6, date: '04/06/2025' },
      { id: 7, date: '10/06/2025' },
      { id: 8, date: '13/06/2025' },
      { id: 9, date: '17/06/2025' },
      { id: 10, date: '28/06/2025' },
      { id: 11, date: '04/07/2025' },
      { id: 12, date: '08/07/2025' }
    ]

    for (const session of sessions) {
      // Convertir le format de date DD/MM/YYYY vers Date
      const [day, month, year] = session.date.split('/')
      const sessionDate = new Date(`${year}-${month}-${day}`)
      
      await prisma.session.create({
        data: {
          id: session.id,
          date: sessionDate,
          createdAt: sessionDate
        }
      })
    }
    console.log(`✅ ${sessions.length} sessions migrées`)

    // 3. Migrer les blocs (143 blocs)
    console.log('🧗 Migration des blocs...')
    const blocs = [
      // Session 1 (13/02/2025) - 13 blocs
      { id: 1, sessionId: 1, difficulty: 3, retry: 0, style: 'DA', terminate: true },
      { id: 2, sessionId: 1, difficulty: 2, retry: 0, style: 'DA', terminate: true },
      { id: 3, sessionId: 1, difficulty: 2, retry: 0, style: 'DE', terminate: true },
      { id: 4, sessionId: 1, difficulty: 4, retry: 0, style: 'DE', terminate: true },
      { id: 5, sessionId: 1, difficulty: 5, retry: 0, style: 'DE', terminate: true },
      { id: 6, sessionId: 1, difficulty: 5, retry: 0, style: 'DE', terminate: true },
      { id: 7, sessionId: 1, difficulty: 7, retry: 2, style: 'DE', terminate: false },
      { id: 8, sessionId: 1, difficulty: 6, retry: 0, style: 'DE', terminate: true },
      { id: 9, sessionId: 1, difficulty: 6, retry: 2, style: 'DA', terminate: true },
      { id: 10, sessionId: 1, difficulty: 7, retry: 0, style: 'DE', terminate: true },
      { id: 11, sessionId: 1, difficulty: 6, retry: 3, style: 'DA', terminate: true },
      { id: 12, sessionId: 1, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 13, sessionId: 1, difficulty: 5, retry: 0, style: 'DE', terminate: true },

      // Session 2 (18/02/2025) - 12 blocs
      { id: 14, sessionId: 2, difficulty: 3, retry: 0, style: 'DA', terminate: true },
      { id: 15, sessionId: 2, difficulty: 3, retry: 0, style: 'DA', terminate: true },
      { id: 16, sessionId: 2, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 17, sessionId: 2, difficulty: 7, retry: 2, style: 'DA', terminate: true },
      { id: 18, sessionId: 2, difficulty: 6, retry: 0, style: 'DE', terminate: true },
      { id: 19, sessionId: 2, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 20, sessionId: 2, difficulty: 7, retry: 0, style: 'DE', terminate: true },
      { id: 21, sessionId: 2, difficulty: 7, retry: 4, style: 'DA', terminate: true },
      { id: 22, sessionId: 2, difficulty: 8, retry: 4, style: 'DA', terminate: true },
      { id: 23, sessionId: 2, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 24, sessionId: 2, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 25, sessionId: 2, difficulty: 8, retry: 2, style: 'DA', terminate: false },

      // Session 3 (25/02/2025) - 12 blocs
      { id: 26, sessionId: 3, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 27, sessionId: 3, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 28, sessionId: 3, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 29, sessionId: 3, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 30, sessionId: 3, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 31, sessionId: 3, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 32, sessionId: 3, difficulty: 7, retry: 2, style: 'DA', terminate: false },
      { id: 33, sessionId: 3, difficulty: 7, retry: 3, style: 'DA', terminate: false },
      { id: 34, sessionId: 3, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 35, sessionId: 3, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 36, sessionId: 3, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 37, sessionId: 3, difficulty: 8, retry: 3, style: 'DA', terminate: false },

      // Session 4 (27/02/2025) - 10 blocs
      { id: 38, sessionId: 4, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 39, sessionId: 4, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 40, sessionId: 4, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 41, sessionId: 4, difficulty: 6, retry: 1, style: 'DA', terminate: true },
      { id: 42, sessionId: 4, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 43, sessionId: 4, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 44, sessionId: 4, difficulty: 7, retry: 2, style: 'DA', terminate: false },
      { id: 45, sessionId: 4, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 46, sessionId: 4, difficulty: 7, retry: 1, style: 'DA', terminate: false },
      { id: 47, sessionId: 4, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 5 (04/03/2025) - 10 blocs
      { id: 48, sessionId: 5, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 49, sessionId: 5, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 50, sessionId: 5, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 51, sessionId: 5, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 52, sessionId: 5, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 53, sessionId: 5, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 54, sessionId: 5, difficulty: 7, retry: 2, style: 'DA', terminate: false },
      { id: 55, sessionId: 5, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 56, sessionId: 5, difficulty: 8, retry: 2, style: 'DA', terminate: false },
      { id: 57, sessionId: 5, difficulty: 8, retry: 3, style: 'DA', terminate: false },

      // Session 6 (04/06/2025) - 12 blocs
      { id: 58, sessionId: 6, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 59, sessionId: 6, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 60, sessionId: 6, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 61, sessionId: 6, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 62, sessionId: 6, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 63, sessionId: 6, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 64, sessionId: 6, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 65, sessionId: 6, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 66, sessionId: 6, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 67, sessionId: 6, difficulty: 7, retry: 2, style: 'DA', terminate: false },
      { id: 68, sessionId: 6, difficulty: 8, retry: 3, style: 'DA', terminate: false },
      { id: 69, sessionId: 6, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 7 (10/06/2025) - 12 blocs
      { id: 70, sessionId: 7, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 71, sessionId: 7, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 72, sessionId: 7, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 73, sessionId: 7, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 74, sessionId: 7, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 75, sessionId: 7, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 76, sessionId: 7, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 77, sessionId: 7, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 78, sessionId: 7, difficulty: 8, retry: 1, style: 'DA', terminate: true },
      { id: 79, sessionId: 7, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 80, sessionId: 7, difficulty: 8, retry: 3, style: 'DA', terminate: false },
      { id: 81, sessionId: 7, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 8 (13/06/2025) - 12 blocs
      { id: 82, sessionId: 8, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 83, sessionId: 8, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 84, sessionId: 8, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 85, sessionId: 8, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 86, sessionId: 8, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 87, sessionId: 8, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 88, sessionId: 8, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 89, sessionId: 8, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 90, sessionId: 8, difficulty: 8, retry: 1, style: 'DA', terminate: true },
      { id: 91, sessionId: 8, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 92, sessionId: 8, difficulty: 8, retry: 3, style: 'DA', terminate: false },
      { id: 93, sessionId: 8, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 9 (17/06/2025) - 12 blocs
      { id: 94, sessionId: 9, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 95, sessionId: 9, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 96, sessionId: 9, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 97, sessionId: 9, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 98, sessionId: 9, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 99, sessionId: 9, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 100, sessionId: 9, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 101, sessionId: 9, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 102, sessionId: 9, difficulty: 8, retry: 1, style: 'DA', terminate: true },
      { id: 103, sessionId: 9, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 104, sessionId: 9, difficulty: 8, retry: 3, style: 'DA', terminate: false },
      { id: 105, sessionId: 9, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 10 (28/06/2025) - 12 blocs
      { id: 106, sessionId: 10, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 107, sessionId: 10, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 108, sessionId: 10, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 109, sessionId: 10, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 110, sessionId: 10, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 111, sessionId: 10, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 112, sessionId: 10, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 113, sessionId: 10, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 114, sessionId: 10, difficulty: 8, retry: 1, style: 'DA', terminate: true },
      { id: 115, sessionId: 10, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 116, sessionId: 10, difficulty: 8, retry: 3, style: 'DA', terminate: false },
      { id: 117, sessionId: 10, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 11 (04/07/2025) - 12 blocs
      { id: 118, sessionId: 11, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 119, sessionId: 11, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 120, sessionId: 11, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 121, sessionId: 11, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 122, sessionId: 11, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 123, sessionId: 11, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 124, sessionId: 11, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 125, sessionId: 11, difficulty: 7, retry: 1, style: 'DA', terminate: true },
      { id: 126, sessionId: 11, difficulty: 8, retry: 1, style: 'DA', terminate: true },
      { id: 127, sessionId: 11, difficulty: 8, retry: 2, style: 'DA', terminate: true },
      { id: 128, sessionId: 11, difficulty: 8, retry: 3, style: 'DA', terminate: false },
      { id: 129, sessionId: 11, difficulty: 8, retry: 4, style: 'DA', terminate: false },

      // Session 12 (08/07/2025) - 14 blocs
      { id: 130, sessionId: 12, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 131, sessionId: 12, difficulty: 8, retry: 0, style: 'DA', terminate: true },
      { id: 132, sessionId: 12, difficulty: 8, retry: 1, style: 'DA', terminate: false },
      { id: 133, sessionId: 12, difficulty: 7, retry: 0, style: 'DE', terminate: true },
      { id: 134, sessionId: 12, difficulty: 4, retry: 0, style: 'DA', terminate: true },
      { id: 135, sessionId: 12, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 136, sessionId: 12, difficulty: 7, retry: 0, style: 'DA', terminate: true },
      { id: 137, sessionId: 12, difficulty: 6, retry: 0, style: 'DE', terminate: true },
      { id: 138, sessionId: 12, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 139, sessionId: 12, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 140, sessionId: 12, difficulty: 6, retry: 1, style: 'DA', terminate: false },
      { id: 141, sessionId: 12, difficulty: 6, retry: 0, style: 'DA', terminate: true },
      { id: 142, sessionId: 12, difficulty: 5, retry: 0, style: 'DA', terminate: true },
      { id: 143, sessionId: 12, difficulty: 6, retry: 4, style: 'DE', terminate: true }
    ]

    for (const bloc of blocs) {
      // Utiliser la date de la session correspondante
      const session = sessions.find(s => s.id === bloc.sessionId)
      const [day, month, year] = session.date.split('/')
      const blocDate = new Date(`${year}-${month}-${day}`)
      
      await prisma.bloc.create({
        data: {
          id: bloc.id,
          sessionId: bloc.sessionId,
          difficulty: bloc.difficulty,
          style: bloc.style,
          retry: bloc.retry,
          terminate: bloc.terminate,
          createdAt: blocDate
        }
      })
    }
    console.log(`✅ ${blocs.length} blocs migrés`)

    // 4. Vérification finale
    const sessionCount = await prisma.session.count()
    const blocCount = await prisma.bloc.count()
    
    console.log('📊 Résumé de la migration :')
    console.log(`   Sessions : ${sessionCount}`)
    console.log(`   Blocs : ${blocCount}`)
    
    // Statistiques par session
    const sessionsWithBlocs = await prisma.session.findMany({
      include: {
        _count: {
          select: { blocs: true }
        }
      },
      orderBy: { date: 'asc' }
    })
    
    console.log('📈 Blocs par session :')
    sessionsWithBlocs.forEach(session => {
      console.log(`   ${session.date.toISOString().split('T')[0]} : ${session._count.blocs} blocs`)
    })
    
    console.log('🎉 Migration terminée avec succès !')

  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  migrateRealData()
}

module.exports = { migrateRealData }