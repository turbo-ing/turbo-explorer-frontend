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
import IsNotIframe from '@/app/components/IsNotIframe'

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

async function fetchSessionsByGameId(gameId: string): Promise<Session[]> {
  const { data } = await api.get(`/sessions/appId/${gameId}`);
  return data;
}

function getRandomDate(): Date {
  const startTimestamp = 0; // Unix epoch start: January 1, 1970
  const endTimestamp = new Date(2100, 0, 1).getTime(); // Arbitrary future date: January 1, 2100
  const randomTimestamp = Math.random() * (endTimestamp - startTimestamp);
  return new Date(randomTimestamp);
}

const MOCK_SESSIONS :Session[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i,
  topic: String(i % 5),
  app_id: Math.random()*100,
  session_id: (Math.random()*100).toString(),
  interaction_count: Math.random()*10,
  created_at: getRandomDate(),
  updated_at: getRandomDate(),
}))

export default async function GamePage({ params }: { params: { id: string } }) {
  let game: Game | null = null;
  let sessions: Session[] = [];
  let error: string | null = null;

  const {id} = await params

  try {
    // Fetch game and session data
    game = await fetchGameBySlug(id);
    if (game) {
      sessions = await fetchSessionsByGameId(game.id.toString());
    }
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
      <GameSessionsTable columns={columns} data={MOCK_SESSIONS}/>
    </div>
  );
}