// SessionTimeline.tsx
"use client"
import { UserPlus, UserMinus } from 'lucide-react'
import { SessionEvent } from '@/types'
import { SessionDetailsChildrenProps } from "."
import PaginatedSection from './PaginatedSection'

export default function SessionTimeline({ data, onQueryChange, query }: SessionDetailsChildrenProps<SessionEvent>) {
  return (
    <PaginatedSection
      title="Session Timeline"
      total={data.total}
      totalPages={data.totalPages}
      currentPage={data.currentPage}
      limit={query.limit || 10}
      notFoundMessage="No events found"
      countLabel="Events"
      onPageChange={(page) => onQueryChange({ ...query, page })}
      onLimitChange={(limit) => onQueryChange({ ...query, limit })}
    >
      <>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-stone-300">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-2 rounded-full bg-white border-2 border-stone-300" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-white border-2 border-stone-300" />
          </div>
          {data.data.map((event) => (
            <div key={event.id} className="pb-3 flex items-center overflow-clip">
              <div
                className={`w-8 h-8 min-w-8 min-h-8 rounded-full flex items-center justify-center z-10 ${
                  event.event === 'JOIN' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {event.event === 'JOIN' ? (
                  <UserPlus className="w-4 h-4 text-white" />
                ) : (
                  <UserMinus className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="ml-4 flex-grow">
                <p className="font-medium max-w-[95%]">
                  <span className="truncate">{event.peer_id}</span>{" "}
                  {event.event === 'JOIN' ? 'joined' : 'left'} the session
                </p>
                <p className="text-sm text-stone-500">
                  {new Date(Number(event.recent_blob_pull)).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    </PaginatedSection>
  )
}
