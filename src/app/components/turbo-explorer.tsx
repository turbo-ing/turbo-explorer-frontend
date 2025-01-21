'use client'

import { useState } from 'react'
import GamesList from './games-list'
import StatsBar from './stats-bar'
import AddGameForm from './add-game-form'

export interface Game {
  id: number
  name: string
  sessions: number
  interactions: number
}

export default function TurboExplorer() {
  const [games, setGames] = useState<Game[]>([
    { id: 1, name: 'Tic Tac Toe', sessions: 100, interactions: 500 },
    { id: 2, name: 'Chess', sessions: 75, interactions: 300 },
    { id: 3, name: 'Sudoku', sessions: 50, interactions: 200 },
  ])

  const addGame = (newGame: Omit<Game, 'id'>) => {
    setGames([...games, { ...newGame, id: games.length + 1 }])
  }

  const totalSessions = games.reduce((sum, game) => sum + game.sessions, 0)
  const totalInteractions = games.reduce((sum, game) => sum + game.interactions, 0)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Turbo Explorer</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GamesList games={games} />
        </div>
        <div>
          <StatsBar 
            gamesCount={games.length} 
            sessionsCount={totalSessions} 
            interactionsCount={totalInteractions} 
          />
          <AddGameForm onAddGame={addGame} />
        </div>
      </div>
    </div>
  )
}

