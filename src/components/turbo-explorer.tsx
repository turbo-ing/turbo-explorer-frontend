// import { useEffect, useState } from 'react';
import Link from 'next/link';
import GamesList from './games-list';
import { Box, Clock, ArrowRight, Plus } from 'lucide-react';
import { config } from 'dotenv';
import api from '@/util/api';
import Container from './Container';
import Search from './Search';
import GameStats from './GameStats';

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

  //Where we'll store the games we pull from the API
  const games = await getGames()
  console.log(games);
  

  // //How we'll pull the games from the API
  // useEffect(() => {
  //   console.log("Pulling game objects from API backend...");
  //   api.get('/apps').then((r) => {
  //     const newGames: Game[] = [];
  //     for (let i = 0; i < r.data.length; i++) {
  //       const newGame: Game = {
  //         id: r.data[i].id,
  //         name: r.data[i].name,
  //         description: r.data[i].description,
  //         domain_name: r.data[i].domain_name,
  //         game_id: r.data[i].game_id,
  //         verification_key: r.data[i].verification_key,
  //         sessions: r.data[i].session_count,
  //         interactions: r.data[i].interaction_count,
  //         slug: r.data[i].slug,
  //         created_at: r.data[i].created_at,
  //         updated_at: r.data[i].updated_at,
  //         recent_blob_pull: r.data[i].recent_blob_pull,
  //       }
  //       newGames.push(newGame);
  //     }
  //     setGames(newGames);
  //   })
  // }, [])

  const totalSessions = games.reduce((sum, game) => sum + game.session_count, 0)
  const totalInteractions = games.reduce((sum, game) => sum + game.interaction_count, 0)

  return (
    <div className="bg-gray-100">
      <Container className='flex flex-col h-72 justify-center gap-6 ' color='bg-turbo-red gradient'>
        <div className='space-y-1 text-white'>
        <h1 className='text-5xl sm:text-6xl  font-medium'>
          The Turbo Game Explorer</h1>
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
            <Link href="/add-game" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Game
            </Link>
          </div>
          <GamesList games={games} />
        </div>
      </Container>
    </div>
  )
}
