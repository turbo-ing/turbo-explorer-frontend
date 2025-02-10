import api from '@/util/api'
import BackButton from '@/components/BackButton'
import Container from '@/components/Container'
import SessionDetails from '@/components/SessionDetails'
import { SessionDetails as SessionDetailsType } from '@/types'

export const dynamic = 'force-dynamic'

const getSessionDetails = async (sessionId: string, gameSlug: string) => {
  try {
    const res = await api().get<SessionDetailsType>(`sessions/app/${gameSlug}/session-details/${sessionId}`)
    return res.data
  } catch (error) {
    console.error(error)
    return {
      events: [],
      interactions: [],
      proofs: [],
      appData: {
        name: "game",
      },
      session: {
        id: sessionId,
        appId: gameSlug,
        dateTime: new Date().toISOString(),
        interactionCount: 0,
      }
    }
  }
}

export default async function SessionPage({
  params
}: {
  params: Promise<{ gameId: string; sessionId: string }>;
}) {

  const { gameId, sessionId } = await params;
  const sessionDetails = await getSessionDetails(sessionId, gameId)

  return (
    <Container className="text-stone-600 bg-stone-100 p-4 sm:p-8 max-w-[1000px]">
      <BackButton href={gameId ? `/game/${gameId}` : '/'} className="mb-4">
        Back to {sessionDetails.appData.name || "game"}
      </BackButton>

      <SessionDetails sessionId={sessionId} events={sessionDetails.events || []} interactions={sessionDetails.interactions || []} proofs={sessionDetails.proofs || []} />
    </Container>
  )
}