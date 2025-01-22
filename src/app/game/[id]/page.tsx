'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import GameSessionsTable from '@/components/game-sessions-table'
import { Game } from '@/components/turbo-explorer'
import { Session } from '@/components/turbo-explorer'
import api from '@/util/api'
import useIframeMessageHandler from '@/hook/useIframeErrorHandler'

export interface GameSession {
  id: string
  topicId: string
  dateTime: string
  interactionCount: number
}

//TODO: completely overhaul this awful logic.
// I'll steal the stuff to grab session info though lol

export const fetchGameBySlug = (slug: string) => api.get(`/apps/slug/${slug}`);
export const fetchSessionsByGameId = (gameId: string) => api.get(`/sessions/appId/${gameId}`);


export default function GamePage() {
  const { sendMessageToParent } = useIframeMessageHandler()
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 5;
  const isIframe = window.self !== window.top

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: gameData } = await fetchGameBySlug(params.id as string);
        setGame(gameData);

        const { data: sessionsData } = await fetchSessionsByGameId(gameData.id);
        setSessions(sessionsData);
      } catch (err: any) {
        if (isIframe) {
          sendMessageToParent(err.message || 'An error occurred', );
        }else{
          setError(err.message || 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);


  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  if (window.self !== window.top) {
    return <h1>IFRAME</h1>
  }
  if (loading) return
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!game) return <div className="p-8">Game not found.</div>;

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100 p-8">
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
  );
}