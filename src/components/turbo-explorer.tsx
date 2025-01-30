'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GamesList from './games-list';
import { Box, Clock, ArrowRight, Plus } from 'lucide-react';
import { config } from 'dotenv';
import api from '@/util/api';

config();

export interface Game {
  id: number,
  name: string,
  description: string,
  icon?: string,
  domain_name: string,
  game_id: string,
  verification_key: string,
  sessions: number,
  interactions: number,
  slug: string,
  created_at: Date,
  updated_at: Date,
  recent_blob_pull: bigint,
}

export interface Session {
  id: number,
  app_id: number,
  session_id: string,
  topic: string,
  interaction_count: number,
  created_at: Date,
  updated_at: Date,
  recent_blob_pull: bigint, 
}

export interface SessionEvent {
  id: number,
  session_id: number,
  peer_id: string,
  event: string,
  created_at: Date,
  recent_blob_pull: bigint, 
}

export interface Interaction {
  id: number,
  session_id: number,
  peer_id: string,
  body: string,
  created_at: Date,
  recent_blob_pull: bigint,
}

export default function TurboExplorer() {

  //Where we'll store the games we pull from the API
  const [games, setGames] = useState<Game[]>([])

  //How we'll pull the games from the API
  useEffect(() => {    
      console.log("Pulling game objects from API backend...");
      api.get('/apps').then((r) => {
        const newGames : Game[] = [];
        for(let i=0; i<r.data.length; i++){
          const newGame : Game = {
            id: r.data[i].id,
            name: r.data[i].name,
            description: r.data[i].description,
            domain_name: r.data[i].domain_name,
            game_id: r.data[i].game_id,
            verification_key: r.data[i].verification_key,
            sessions: r.data[i].session_count,
            interactions: r.data[i].interaction_count,
            slug: r.data[i].slug,
            created_at: r.data[i].created_at,
            updated_at: r.data[i].updated_at,
            recent_blob_pull: r.data[i].recent_blob_pull,
          }
          newGames.push(newGame);
        }
        setGames(newGames);
      })
  },[])



  /*const [games, setGames] = useState<Game[]>([
    { id: 1, name: 'Tic Tac Toe', sessions: 100, interactions: 500 },
    { id: 2, name: 'Chess', sessions: 75, interactions: 300 },
    { id: 3, name: 'Sudoku', sessions: 50, interactions: 200 },
  ])*/

  const totalSessions = games.reduce((sum, game) => sum + game.sessions, 0)
  const totalInteractions = games.reduce((sum, game) => sum + game.interactions, 0)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Turbo Explorer</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
          <div className="p-2">
            <Box className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{games.length}</div>
            <div className="text-gray-600">Total Games</div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
          <div className="p-2">
            <Clock className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <div className="text-gray-600">Total Sessions</div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
          <div className="p-2">
            <ArrowRight className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalInteractions}</div>
            <div className="text-gray-600">Total Interactions</div>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Games List</h2>
          <Link href="/add-game" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Game
          </Link>
        </div>
        <GamesList games={games} />
      </div>
    </div>
  )
}

