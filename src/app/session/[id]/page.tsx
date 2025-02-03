'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SessionTimeline from '@/components/session-timeline'
import SessionActionsList from '@/components/session-actions-list'
import ZKProofSection from '@/components/zk-proof-section'
import {
  Session,
  SessionEvent,
  Interaction,
  Game,
} from '@/components/turbo-explorer'
import api from '@/util/api'
import BackButton from '@/components/BackButton'
import Container from '@/components/Container'

export interface ZkProof {
  id: string
  peer_id: string
  proof: string
  verification_key: string
  recent_blob_pull: bigint
}

interface ErrorResponse {
  message: string;
  status?: number;
}

// Add these interfaces for API responses
interface SessionEventResponse {
  id: string
  session_id: string
  peer_id: string
  event: string
  created_at: string
  recent_blob_pull: bigint
}

interface InteractionResponse {
  id: string
  session_id: string
  peer_id: string
  body: string
  created_at: string
  recent_blob_pull: bigint
}

interface ZkProofResponse {
  id: string
  peer_id: string
  proof: string
  verification_key: string
  recent_blob_pull: bigint
}

export default function SessionPage() {
  const params = useParams()
  const [session, setSession] = useState<Session | undefined>()
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [zkProofs, setZkProofs] = useState<ZkProof[]>([])
  const [game, setGame] = useState<Game | undefined>()
  const [loading, setLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const actionsPerPage = 5

  useEffect(() => {
    // If `params.id` doesn't exist yet, don't proceed
    if (!params.id) return

    // Convert params.id to a string in case it's an array
    const sessionId = Array.isArray(params.id) ? params.id[0] : params.id

    // Fetch data function
    async function fetchData(id: string) {
      try {
        // TODO: Create api endpoint that does this in one call
        const sessionRes = await api.get(`/sessions/id/${id}`)
        const sessionData: Session = {
          id: sessionRes.data.id,
          app_id: sessionRes.data.app_id,
          session_id: sessionRes.data.session_id,
          topic: sessionRes.data.topic,
          interaction_count: sessionRes.data.interaction_count,
          created_at: sessionRes.data.created_at,
          updated_at: sessionRes.data.updated_at,
          recent_blob_pull: sessionRes.data.recent_blob_pull,
        }
        setSession(sessionData)

        const [eventsRes, interactionsRes, proofsRes, gameRes] = await Promise.all([
          api.get(`/session-events/sessionId/${sessionData.id}`),
          api.get(`/interactions/sessionId/${sessionData.id}`),
          api.get(`/zkProofs/sessionId/${sessionData.id}`),
          api.get(`/apps/${sessionData.app_id}`),
        ])

        // 3. Transform & store session events
        const fetchedEvents: SessionEvent[] = eventsRes.data.map((item: SessionEventResponse) => ({
          id: item.id,
          session_id: item.session_id,
          peer_id: item.peer_id,
          event: item.event,
          created_at: item.created_at,
          recent_blob_pull: item.recent_blob_pull,
        }))
        setSessionEvents(fetchedEvents)

        // 4. Transform & store interactions
        const fetchedInteractions: Interaction[] = interactionsRes.data.map((item: InteractionResponse) => ({
          id: item.id,
          session_id: item.session_id,
          peer_id: item.peer_id,
          body: item.body,
          created_at: item.created_at,
          recent_blob_pull: item.recent_blob_pull,
        }))
        setInteractions(fetchedInteractions)

        // 5. Transform & store ZK proofs
        const fetchedProofs: ZkProof[] = proofsRes.data.map((item: ZkProofResponse) => ({
          id: item.id,
          peer_id: item.peer_id,
          proof: item.proof,
          verification_key: item.verification_key,
          recent_blob_pull: item.recent_blob_pull,
        }))
        setZkProofs(fetchedProofs)

        // 6. Transform & store game data
        const fetchedGame: Game = {
          id: gameRes.data.id,
          name: gameRes.data.name,
          description: gameRes.data.description,
          domain_name: gameRes.data.domain_name,
          game_id: gameRes.data.game_id,
          verification_key: gameRes.data.verification_key,
          session_count: gameRes.data.session_count,
          interaction_count: gameRes.data.interaction_count,
          slug: gameRes.data.slug,
          created_at: gameRes.data.created_at,
          updated_at: gameRes.data.updated_at,
          recent_blob_pull: gameRes.data.recent_blob_pull,
        }
        setGame(fetchedGame)
      } catch (error: unknown) {
        const err = error as ErrorResponse;
        console.error('Error fetching session data:', err.message);
      } finally {
        setLoading(false)
      }
    }

    // Call our async function
    fetchData(sessionId)
  }, [params.id])

  // If still loading or no session found yet
  if (loading || !session) {
    return <div className="p-8">Loading...</div>
  }

  // Pagination logic
  const indexOfLastAction = currentPage * actionsPerPage
  const indexOfFirstAction = indexOfLastAction - actionsPerPage
  const currentInteractions = interactions.slice(indexOfFirstAction, indexOfLastAction)
  const totalPages = Math.ceil(interactions.length / actionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Container className="text-stone-600 bg-stone-100 p-4 sm:p-8 max-w-[1000px]">
      <BackButton href={game ? `/game/${game.slug}` : '/'} className="mb-4">
        Back to {game?.name || "game"}
      </BackButton>

      <h1 className="text-3xl font-bold mb-6">Session {session.id} Details</h1>

      <div className="space-y-8">
        <SessionTimeline events={sessionEvents} />
        <SessionActionsList
          allActions={interactions}
          actions={currentInteractions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
        <ZKProofSection proofs={zkProofs} />
      </div>
    </Container>
  )
}