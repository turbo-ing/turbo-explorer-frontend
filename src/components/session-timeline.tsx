import { UserPlus, UserMinus } from 'lucide-react'
import { SessionEvent } from './turbo-explorer'

interface SessionTimelineProps {
  events: SessionEvent[]
}

export default function SessionTimeline({ events }: SessionTimelineProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Session Timeline</h2>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-stone-200" />
        {events.map((event) => (
          <div key={event.id} className="mb-4 flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
              event.event === 'JOIN' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {event.event === 'JOIN' ? (
                <UserPlus className="w-4 h-4 text-white" />
              ) : (
                <UserMinus className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="ml-4 flex-grow">
              <p className="font-medium">
                {event.peer_id} {event.event === 'JOIN' ? 'joined' : 'left'} the session
              </p>
              <p className="text-sm text-stone-500">
                {new Date(Number(event.recent_blob_pull)).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

