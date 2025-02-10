// import SessionTimeline from '@/components/session-timeline'
// import SessionActionsList from '@/components/session-interactions-list'
// import ZKProofSection from '@/components/zk-proof-section'
import {
  Session,
  SessionEvent,
  Interaction,
  Game,
} from '@/components/turbo-explorer'
import api from '@/util/api'
import BackButton from '@/components/BackButton'
import Container from '@/components/Container'
import SessionDetails from '@/components/SessionDetails'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

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

export const dynamic = 'force-dynamic'

const getSessionDetails = async (sessionId: string, gameSlug: string) => {
  const res = await api().get(`sessions/app/${gameSlug}/session-details/${sessionId}`)
  return res.data
}

export default async function SessionPage({
  params
}: {
  params: Promise<{ gameId: string; sessionId: string }>;
}) {

  const { gameId, sessionId } = await params;
  const sessionDetails = await getSessionDetails(sessionId, gameId)


  // Pagination logic
  // const indexOfLastAction = currentPage * actionsPerPage
  // const indexOfFirstAction = indexOfLastAction - actionsPerPage
  // const currentInteractions = interactions.slice(indexOfFirstAction, indexOfLastAction)
  // const totalPages = Math.ceil(interactions.length / actionsPerPage)

  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <Container className="text-stone-600 bg-stone-100 p-4 sm:p-8 max-w-[1000px]">
      <BackButton href={gameId ? `/game/${gameId}` : '/'} className="mb-4">
        Back to {gameId || "game"}
      </BackButton>

      <SessionDetails sessionId={sessionId} sessionEvents={sessionDetails.events || []} interactions={sessionDetails.interactions || []} zkProofs={sessionDetails.zk_proofs || []} />
    </Container>
  )
}