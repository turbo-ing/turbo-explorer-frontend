import api from '@/util/api'
import BackButton from '@/components/BackButton'
import Container from '@/components/Container'
import SessionDetails from '@/components/SessionDetails'
import { SessionUpdates } from '@/types'

export const dynamic = 'force-dynamic'

const getSessionDetails = async (sessionId: string) => {
  try {
    const res = await api().get<SessionUpdates>(`sessions/details/${sessionId}`)
    return res.data
  } catch (error) {
    console.error(error)
    const emptyPaginationResult = {
      data: [],
      total: 0,
      currentPage: 1,
      totalPages: 1
    }
    return {
      events: emptyPaginationResult,
      interactions: emptyPaginationResult,
      proofs: emptyPaginationResult,
    }
  }
}

export default async function SessionPage({
  params
}: {
  params: Promise<{ gameId: string; sessionId: string }>;
}) {

  const { gameId, sessionId } = await params;
  const sessionDetails = await getSessionDetails(sessionId)

  return (
    <Container className="text-stone-600 bg-stone-100 p-4 sm:p-8 max-w-[1000px]">
      <BackButton href={gameId ? `/game/${gameId}` : '/'} className="mb-4">
        Back to {"game"}
        {/* Back to {sessionDetails.appData.name || "game"} */}
      </BackButton>

      <SessionDetails sessionId={sessionId} events={sessionDetails.events} interactions={sessionDetails.interactions} proofs={sessionDetails.proofs} />
    </Container>
  )
}