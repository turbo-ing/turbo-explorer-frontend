'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import GameSessionsTable from '@/components/game-sessions-table'

interface GameSession {
  id: string
  topicId: string
  dateTime: string
  interactionCount: number
}

export default function GamePage() {
  const params = useParams()
  const [game, setGame] = useState<{ name: string, sessions: GameSession[] } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const sessionsPerPage = 5

  useEffect(() => {
    // In a real application, you would fetch the game data from an API
    // For this example, we'll use mock data
    const mockGame = {
      name: 'Tic Tac Toe',
      sessions: Array.from({ length: 20 }, (_, i) => ({
        id: `S${i + 1}`.padStart(3, '0'),
        topicId: `T${Math.floor(i / 3) + 1}`,
        dateTime: new Date(2023, 4, 15 + i).toISOString(),
        interactionCount: Math.floor(Math.random() * 50) + 10
      }))
    }
    setGame(mockGame)
  }, [params.id])

  if (!game) {
    return <div className="p-8">Loading...</div>
  }

  const indexOfLastSession = currentPage * sessionsPerPage
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage
  const currentSessions = game.sessions.slice(indexOfFirstSession, indexOfLastSession)
  const totalPages = Math.ceil(game.sessions.length / sessionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games List
      </Link>
      <h1 className="text-3xl font-bold mb-6">{game.name}</h1>
      <GameSessionsTable 
        sessions={currentSessions} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
      />
    </div>
  )
}