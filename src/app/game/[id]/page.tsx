'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import GameSessionsTable from '@/components/game-sessions-table'
import { Game } from '@/components/turbo-explorer'
import { Session } from '@/components/turbo-explorer'
// import { SessionEvent } from '@/components/turbo-explorer'
// import { Interaction } from '@/components/turbo-explorer'
import api from '@/util/api'

export interface GameSession {
  id: string
  topicId: string
  dateTime: string
  interactionCount: number
}

//TODO: completely overhaul this awful logic.
// I'll steal the stuff to grab session info though lol

export default function GamePage() {
  const params = useParams()
  ////const [game, setGame] = useState<{ name: string, sessions: GameSession[] } | null>(null)
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1)
  const sessionsPerPage = 5

  useEffect(() => {
    const handleWindowError = (
      message: Event | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      const errorDetails = {
        type: 'iframe-error',
        message: typeof message === 'string' ? message : 'An unknown error occurred',
        source: source || '',
        lineno: lineno || 0,
        colno: colno || 0,
        error: error ? error.toString() : null,
      };

      try {
        const trustedOrigin = '*'; // Replace with actual trusted origin, e.g., 'https://example.com'
        window.parent.postMessage(errorDetails, trustedOrigin);
      } catch (postError) {
        console.error('Failed to post message to parent:', postError);
      }
    };

    // Assign the error handler
    window.onerror = handleWindowError;

    return () => {
      // Cleanup on component unmount
      window.onerror = null;
    };
  }, []);


useEffect(() => {
  setLoaded(true);
  console.log("Grabbing game with slug " + params.id + " from API backend...")
  //grab the game at correct url (apps by id)
  api.get('/apps/slug/' + params.id).then((r) => {
    console.log(r.data);
    const newGame: Game = {
      id: r.data.id,
      name: r.data.name,
      description: r.data.description,
      domain_name: r.data.domain_name,
      game_id: r.data.game_id,
      sessions: r.data.session_count,
      interactions: r.data.interaction_count,
      slug: r.data.slug,
      created_at: r.data.created_at,
      updated_at: r.data.updated_at,
    }
    setGame(newGame);
    //grab the sessions from the game ID of our URL slug we just pulled
    console.log("Grabbing sessions of game with ID " + r.data.id + " from API backend...")
    api.get('/sessions/appId/' + r.data.id).then((r2) => {
      const newSessions: Session[] = [];
      for (let i = 0; i < r2.data.length; i++) {
        const newSession: Session = {
          id: r2.data[i].id,
          app_id: r2.data[i].app_id,
          session_id: r2.data[i].session_id,
          topic: r2.data[i].topic,
          interactions: r2.data[i].interaction_count,
          created_at: r2.data[i].created_at,
          updated_at: r2.data[i].updated_at,
        }
        newSessions.push(newSession);
      }
      setSessions(newSessions);
    })
  })
}, [params.id])


// In a real application, you would fetch the game data from an API
// For this example, we'll use mock data
/*const mockGame = {
  name: "" + params.id,
  sessions: Array.from({ length: 20 }, (_, i) => ({
    id: `S${i + 1}`.padStart(3, '0'),
    topicId: `T${Math.floor(i / 3) + 1}`,
    dateTime: new Date(2023, 4, 15 + i).toISOString(),
    interactionCount: Math.floor(Math.random() * 50) + 10
  }))
}*/

if (!game) {
  return <div className="p-8">Loading...</div>
}

const indexOfLastSession = currentPage * sessionsPerPage
const indexOfFirstSession = indexOfLastSession - sessionsPerPage
const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession)
const totalPages = Math.ceil(sessions.length / sessionsPerPage)

const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
)
}