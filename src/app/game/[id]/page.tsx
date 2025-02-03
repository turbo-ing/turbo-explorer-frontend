import { columns } from '@/components/GameSessionsTable/columns'
import GameSessionsTable from '@/components/GameSessionsTable'
import { Game } from '@/components/turbo-explorer'
import { Session } from '@/components/turbo-explorer'
import api from '@/util/api'
// import useIframeMessageHandler from '@/hook/useIframeErrorHandler'
import IsNotIframe from '@/components/IsNotIframe'
import BackButton from '@/components/BackButton'
import CeleniumBadge from '@/components/CeleniumBadge'
import Container from '@/components/Container'

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
  const { id } = await params

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
    <div className="lg:container mx-auto text-stone-600 bg-stone-100 max-w-[100vw]">
      <Container className='p-4 sm:p-8 '>
        <div className=' flex justify-between'>
          <IsNotIframe>
            <BackButton href={"/"} className='mb-2'>
              Back to Games List
            </BackButton>
          </IsNotIframe>

          <CeleniumBadge
            namespaceString={"turbo.game#" + game.domain_name + "#" + game.game_id} />
        </div>
        <div>
          {/* Would be nice to have logo here */}
          <h1 className="text-3xl font-bold my-2">{game.name}</h1>
          <p className="font-medium mb-2">
            {game.description}
          </p>
        </div>
      </Container>

      <GameSessionsTable columns={columns} data={sessions} />
    </div>
  );
}