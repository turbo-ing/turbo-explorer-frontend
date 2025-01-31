import { columns } from '@/components/GameSessionsTable/columns'

// import { useState } from 'react'
// import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import GameSessionsTable from '@/components/GameSessionsTable'
import { Game, SessionEvent } from '@/components/turbo-explorer'
import { Session } from '@/components/turbo-explorer'
import api from '@/util/api'
import useIframeMessageHandler from '@/hook/useIframeErrorHandler'
import IsNotIframe from '@/components/IsNotIframe'

export interface GameSession {
  id: string
  topicId: string
  dateTime: string
  interactionCount: number
}

export const dynamic = 'force-dynamic'; // Enable dynamic data fetching

async function fetchGameBySlug(slug: string): Promise<Game> {
  const { data } = await api.get(`/apps/slug/${slug}`);
  return data;
}

async function fetchSessionsBySlug(slug: string): Promise<Session[]> {
  const { data } = await api.get(`apps/slug/${slug}/sessions`);
  return data;
}

export default async function GamePage({ params }: { params: { id: string } }) {
  let game: Game | null = null;
  let sessions: Session[] = [];
  let error: string | null = null;

  // id = game slug
  const {id} = await params

  try {
    sessions = await fetchSessionsBySlug(id)
    game = await fetchGameBySlug(id)
  } catch (err) {
    console.error('Error fetching data:', err);
    error = 'Failed to fetch game or session data.';
  }

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!game) return <div className="p-8">Game not found.</div>;

  return (
    <div className="lg:container mx-auto min-h-screen text-gray-600 bg-gray-100 p-8 ">
      <IsNotIframe>
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games List
        </Link>
      </IsNotIframe>

      <h1 className="text-3xl font-bold mb-6">{game.name}</h1>
      <pre className="font-medium mb-3">
          {game.description}
      </pre>
      <GameSessionsTable columns={columns} data={sessions}/>
    </div>
  );
}