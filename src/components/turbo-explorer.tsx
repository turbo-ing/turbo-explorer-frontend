// import { useEffect, useState } from 'react';
import Link from 'next/link';
import GamesList from './games-list';
import { config } from 'dotenv';
import api from '@/util/api';
import Container from './Container';
import Search from './Search';
import GameStats from './GameStats';
import { Plus } from 'lucide-react';

config();

export interface Game {
  id: number,
  name: string,
  description: string,
  icon?: string,
  domain_name: string,
  game_id: string,
  verification_key: string,
  session_count: number,
  interaction_count: number,
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

async function getGames(): Promise<Game[]> {
  const { data } = await api.get(`/apps`);
  return data;
}

export default async function TurboExplorer() {
  const games = await getGames()  

  const totalSessions = games.reduce((sum, game) => sum + game.session_count, 0)
  const totalInteractions = games.reduce((sum, game) => sum + game.interaction_count, 0)

  return (
    <div className="bg-stone-100">
      <Container className='flex flex-col h-72 justify-center gap-6 ' color='bg-turbo-red gradient'>
        <div className='space-y-1 text-white'>
        <h1 className='text-5xl sm:text-6xl  font-medium'>
          Turbo Game Explorer</h1>
        </div>
        <Search />
      </Container>
      <Container className='-translate-y-8 -mb-8'>
      <GameStats games={games} totalSessions={totalSessions} totalInteractions={totalInteractions} />
      </Container>

      {/* Stats Overview */}
      <Container>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Games List</h2>
            <Link href="/add-game" className="bg-stone-900 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-white hover:text-stone-900 hover:border-stone-900 border-transparent border transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add New Game
            </Link>
          </div>
          <GamesList games={games} />
        </div>
      </Container>
    </div>
  )
}
