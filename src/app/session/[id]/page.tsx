'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SessionTimeline from '@/components/session-timeline'
import SessionActionsList from '@/components/session-actions-list'
import ZKProofSection from '@/components/zk-proof-section'
import {
  Session, SessionEvent, Interaction,/*zkProof*/
  Game
} from '@/components/turbo-explorer'
import api from '@/util/api'
import BackButton from '@/components/BackButton'

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

export interface ZkProof {
  id: string,
  peer_id: string,
  proof: string,
  verification_key: string,
  recent_blob_pull: bigint,
}

export default function SessionPage() {
  const params = useParams();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [zkProofs, setZkProofs] = useState<ZkProof[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const actionsPerPage = 5;

  useEffect(() => {
    setZkProofs([])
    console.log(params.id);
    if (!loaded) {
      setLoaded(true);
      console.log("Grabbing session with ID " + params.id + " from API backend...")
      //grab the session at correct url (session by id)

      //TODO  write backend gfunction to let me do this call
      api.get('/sessions/id/' + params.id).then((r) => {
        console.log(r.data);
        const newSession: Session = {
          id: r.data.id,
          app_id: r.data.app_id,
          session_id: r.data.session_id,
          topic: r.data.topic,
          interaction_count: r.data.interaction_count,
          created_at: r.data.created_at,
          updated_at: r.data.updated_at,
          recent_blob_pull: r.data.recent_blob_pull,
        }
        setSession(newSession);
        //pull sessionEvents from our session ID
        api.get('/session-events/sessionId/' + r.data.id).then((r2) => {
          const newSessionEvents: SessionEvent[] = [];
          for (let i = 0; i < r2.data.length; i++) {
            const newSessionEvent: SessionEvent = {
              id: r2.data[i].id,
              session_id: r2.data[i].session_id,
              peer_id: r2.data[i].peer_id,
              event: r2.data[i].event,
              created_at: r2.data[i].created_at,
              recent_blob_pull: r2.data[i].recent_blob_pull,
            }
            newSessionEvents.push(newSessionEvent);
          }
          setSessionEvents(newSessionEvents);

          //pull interactions from our session ID
          api.get('/interactions/sessionId/' + r.data.id).then((r3) => {
            const newInteractions: Interaction[] = [];
            for (let j = 0; j < r3.data.length; j++) {
              const newInteraction: Interaction = {
                id: r3.data[j].id,
                session_id: r3.data[j].session_id,
                peer_id: r3.data[j].peer_id,
                body: r3.data[j].body,
                created_at: r3.data[j].created_at,
                recent_blob_pull: r3.data[j].recent_blob_pull,
              }
              newInteractions.push(newInteraction);
            }
            setInteractions(newInteractions);

            //pull zkProofs from our session ID
            api.get('/zkProofs/sessionId/' + r.data.id).then((r4) => {
              console.log(r4);
              const newZks: ZkProof[] = [];
              for (let k = 0; k < r4.data.length; k++) {
                const newZk: ZkProof = {
                  id: r4.data[k].id,
                  peer_id: r4.data[k].peer_id,
                  proof: r4.data[k].proof,
                  verification_key: r4.data[k].verification_key,
                  recent_blob_pull: r4.data[k].recent_blob_pull,
                }
                newZks.push(newZk);
              }
              setZkProofs(newZks);
              console.log(zkProofs);

              //Lastly, just grab the app again so we have the slug for "back".
              api.get('/apps/' + r.data.app_id).then((r5) => {
                console.log(r5.data);
                const newGame: Game = {
                  id: r5.data.id,
                  name: r5.data.name,
                  description: r5.data.description,
                  domain_name: r5.data.domain_name,
                  game_id: r5.data.game_id,
                  verification_key: r5.data.verification_key,
                  session_count: r5.data.session_count,
                  interaction_count: r5.data.interaction_count,
                  slug: r5.data.slug,
                  created_at: r5.data.created_at,
                  updated_at: r5.data.updated_at,
                  recent_blob_pull: r5.data.recent_blob_pull,
                }
                setGame(newGame);
              })
            })
          })
        })
      })
    }
  }, [params.id, loaded])

  if (!session) {
    return <div className="p-8">Loading...</div>
  }

  const indexOfLastAction = currentPage * actionsPerPage
  const indexOfFirstAction = indexOfLastAction - actionsPerPage
  const currentInteractions = interactions.slice(indexOfFirstAction, indexOfLastAction)
  const totalPages = Math.ceil(interactions.length / actionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen text-stone-600 bg-stone-100 p-8">
      
      <BackButton href={(game !== undefined) ? ("/game/" + game.slug) : "/"}>
        Back to Game
      </BackButton>

      <h1 className="text-3xl font-bold mb-6">Session Details: {session.id}</h1>

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
    </div>
  )
}

