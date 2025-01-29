'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SessionTimeline from '@/components/session-timeline'
import SessionActionsList from '@/components/session-actions-list'
import ZKProofSection from '@/components/zk-proof-section'
import axios from 'axios'
import { Session, SessionEvent, Interaction,/*zkProof*/ 
Game} from '@/components/turbo-explorer'

/*interface SessionEvent {
  id: string
  type: 'join' | 'leave'
  user: string
  timestamp: string
}*/

/*interface SessionAction {
  id: string
  type: string
  data: any
  timestamp: string
  user: string
}*/

interface ZKProof {
  id: string
  gameState: object
}

export default function SessionPage() {
  const params = useParams();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [zkProofs, setZkProofs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const actionsPerPage = 5;

  useEffect(() => {
    console.log(params.id);
    if(!loaded){
      setLoaded(true);
      console.log("Grabbing session with ID "+params.id+" from API backend...")
      //grab the session at correct url (session by id)

      //TODO  write backend gfunction to let me do this call
      let url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!+'/sessions/id/'+params.id;
      axios.get(url, {headers: {"Access-Control-Allow-Origin": "*"}}).then((r) => {
        console.log(r.data);
        const newSession : Session = {
          id: r.data.id,
          app_id: r.data.app_id,
          session_id: r.data.session_id,
          topic: r.data.topic,
          interactions: r.data.interaction_count,
          created_at: r.data.created_at,
          updated_at: r.data.updated_at,
        }
        setSession(newSession);
        //pull sessionEvents from our session ID
        let url2 = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!+'/session-events/sessionId/'+r.data.id;
        axios.get(url2, {headers: {"Access-Control-Allow-Origin": "*"}}).then((r2) => {
          let newSessionEvents : SessionEvent[] = [];
          for(let i=0; i<r2.data.length; i++){
            const newSessionEvent : SessionEvent = {
              id: r2.data[i].id,
              session_id: r2.data[i].session_id,
              peer_id: r2.data[i].peer_id,
              event: r2.data[i].event,
              created_at: r2.data[i].created_at,
            }
            newSessionEvents.push(newSessionEvent);
          }
          setSessionEvents(newSessionEvents);

          //pull interactions from our session ID
          let url3 = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!+'/interactions/sessionId/'+r.data.id;
          axios.get(url3, {headers: {"Access-Control-Allow-Origin": "*"}}).then((r3) => {
            let newInteractions : Interaction[] = [];
            for(let j=0; j<r3.data.length; j++){
              const newInteraction : Interaction = {
                id: r3.data[j].id,
                session_id: r3.data[j].session_id,
                peer_id: r3.data[j].peer_id,
                body: r3.data[j].body,
                created_at: r3.data[j].created_at,
              }
              newInteractions.push(newInteraction);
            }
            setInteractions(newInteractions);

            //Lastly, just grab the app again so we have the slug for "back".
            let url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!+'/apps/'+r.data.app_id;
            axios.get(url, {headers: {"Access-Control-Allow-Origin": "*"}}).then((r4) => {
              console.log(r4.data);
              const newGame : Game = {
                id: r4.data.id,
                name: r4.data.name,
                description: r4.data.description,
                domain_name: r4.data.domain_name,
                game_id: r4.data.game_id,
                sessions: r4.data.session_count,
                interactions: r4.data.interaction_count,
                slug: r4.data.slug,
                created_at: r4.data.created_at,
                updated_at: r4.data.updated_at,
              }
              setGame(newGame);
            })
          })
        })
      })
    }
  }, [params.id])

  if (!session) {
    return <div className="p-8">Loading...</div>
  }

  const indexOfLastAction = currentPage * actionsPerPage
  const indexOfFirstAction = indexOfLastAction - actionsPerPage
  const currentInteractions = interactions.slice(indexOfFirstAction, indexOfLastAction)
  const totalPages = Math.ceil(interactions.length / actionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen text-gray-600 bg-gray-100 p-8">
      <Link href={(game !== undefined) ? ("/game/" + game.slug) : "/"} className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Game
      </Link>
      <h1 className="text-3xl font-bold mb-6">Session Details: {session.id}</h1>
      
      <div className="space-y-8">
        <SessionTimeline events={sessionEvents} />
        <ZKProofSection proofs={zkProofs} />
        <SessionActionsList 
          allActions={interactions}
          actions={currentInteractions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  )
}

