import { UserPlus, UserMinus } from 'lucide-react'

interface SessionEvent {
  id: string
  type: 'join' | 'leave'
  user: string
  timestamp: string
}

interface SessionTimelineProps {
  events: SessionEvent[]
}

export default function SessionTimeline({ events }: SessionTimelineProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Session Timeline</h2>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200" />
        {events.map((event, index) => (
          <div key={event.id} className="mb-4 flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
              event.type === 'join' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {event.type === 'join' ? (
                <UserPlus className="w-4 h-4 text-white" />
              ) : (
                <UserMinus className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="ml-4 flex-grow">
              <p className="font-medium">
                {event.user} {event.type === 'join' ? 'joined' : 'left'} the session
              </p>
              <p className="text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

