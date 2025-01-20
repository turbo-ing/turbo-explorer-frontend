'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SessionTimeline from '@/components/session-timeline'
import SessionActionsList from '@/components/session-actions-list'
import ZKProofSection from '@/components/zk-proof-section'

interface SessionEvent {
  id: string
  type: 'join' | 'leave'
  user: string
  timestamp: string
}

interface SessionAction {
  id: string
  type: string
  data: any
  timestamp: string
  user: string
}

interface ZKProof {
  id: string
  gameState: object
}

export default function SessionPage() {
  const params = useParams()
  const [session, setSession] = useState<{
    id: string
    events: SessionEvent[]
    actions: SessionAction[]
    zkProofs: ZKProof[]
  } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const actionsPerPage = 5

  //const mock1 : SessionEvent = { id: 'E1', type: 'join', user: 'Alice', timestamp: '2023-05-20T10:00:00Z' };
  const mockSessionEvent : SessionEvent[] = 
    [
      { id: 'E1', type: 'join', user: 'Alice', timestamp: '2023-05-20T10:00:00Z' },
      { id: 'E2', type: 'join', user: 'Bob', timestamp: '2023-05-20T10:05:00Z' },
      { id: 'E3', type: 'leave', user: 'Alice', timestamp: '2023-05-20T10:30:00Z' },
      { id: 'E4', type: 'join', user: 'Charlie', timestamp: '2023-05-20T10:35:00Z' },
      { id: 'E5', type: 'leave', user: 'Bob', timestamp: '2023-05-20T11:00:00Z' },
    ];
  

  useEffect(() => {
    // In a real application, you would fetch the session data from an API
    // For this example, we'll use mock data
    const mockSession = {
      id: params.id as string,
      events : mockSessionEvent,
      actions: Array.from({ length: 20 }, (_, i) => ({
        id: `A${i + 1}`,
        type: i % 2 === 0 ? 'move' : 'chat',
        data: i % 2 === 0 ? { player: ['Alice', 'Bob', 'Charlie'][i % 3], position: `${String.fromCharCode(65 + i % 3)}${i % 3 + 1}` } : { user: ['Alice', 'Bob', 'Charlie'][i % 3], message: `Message ${i + 1}` },
        timestamp: new Date(2023, 4, 20, 10, i * 3).toISOString(),
        user: ['Alice', 'Bob', 'Charlie'][i % 3]
      })),
      zkProofs: Array.from({ length: 3 }, (_, i) => ({
        id: `ZK${i + 1}`,
        gameState: {
          board: [
            ['X', 'O', ''],
            ['', 'X', ''],
            ['O', '', 'X']
          ],
          currentPlayer: i % 2 === 0 ? 'X' : 'O',
          winner: i === 2 ? 'X' : null
        }
      }))
    }
    setSession(mockSession)
  }, [params.id])

  if (!session) {
    return <div className="p-8">Loading...</div>
  }

  const indexOfLastAction = currentPage * actionsPerPage
  const indexOfFirstAction = indexOfLastAction - actionsPerPage
  const currentActions = session.actions.slice(indexOfFirstAction, indexOfLastAction)
  const totalPages = Math.ceil(session.actions.length / actionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100 p-8">
      <Link href="/game/1" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Game
      </Link>
      <h1 className="text-3xl font-bold mb-6">Session Details: {session.id}</h1>
      
      <div className="space-y-8">
        <SessionTimeline events={session.events} />
        <ZKProofSection proofs={session.zkProofs} />
        <SessionActionsList 
          actions={currentActions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  )
}

