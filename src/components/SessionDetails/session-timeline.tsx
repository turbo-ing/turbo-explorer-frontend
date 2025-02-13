"use client"
import { UserPlus, UserMinus } from 'lucide-react'
import { SessionEvent } from '@/types'
import { SessionDetailsChildrenProps } from ".";
import PaginationControls from '../PaginationControls';
import NotFoundElement from '../NotFoundElement';
export default function SessionTimeline({ data, onQueryChange, query }: SessionDetailsChildrenProps<SessionEvent>) {

  const handleNextPrev = (num: number) => {
    const oldPage = Number(data.currentPage)
    const newPage = oldPage + num
    const guardedPage = handleWithinBounds(newPage)
    onQueryChange({ ...query, page: guardedPage})
  }

  const handleWithinBounds = (num: number) => {
    return num < 1 ? 1 : num > data.totalPages ? data.totalPages : num
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-8">
      <h2 className="text-xl font-semibold mb-5">Session Timeline</h2>
      {data.total === 0 ? (
        <NotFoundElement message="No events found" />
      ) : (
        <div>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-stone-300">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-2 rounded-full bg-white border-2 border-stone-300" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-white border-2 border-stone-300" />
        </div>
        
        {data.data.map((event) => (
          <div key={event.id} className="pb-3 flex items-center overflow-clip">
            <div className={`w-8 h-8 min-w-8 min-h-8 rounded-full flex items-center justify-center z-10 ${event.event === 'JOIN' ? 'bg-green-500' : 'bg-red-500'
              }`}>
              {event.event === 'JOIN' ? (
                <UserPlus className="w-4 h-4 text-white" />
              ) : (
                <UserMinus className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="ml-4 flex-grow">
              <p className="font-medium max-w-[95%]">
                <span className='truncate'>{event.peer_id}</span> {event.event === 'JOIN' ? 'joined' : 'left'} the session
              </p>
              <p className="text-sm text-stone-500">
                {new Date(Number(event.recent_blob_pull)).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
        <PaginationControls
          className="mt-4 border-t-0"
          pageCount={data.totalPages}
          pageIndex={data.currentPage}
          pageSize={query.limit || 10}
          setPageIndex={(num: number) => onQueryChange({ ...query, page: handleWithinBounds(num) })}
          setPageSize={(num: number) => onQueryChange({ ...query, limit: num })}    
          nextPage={() => handleNextPrev(1)}
          previousPage={() => handleNextPrev(-1)} />
        </div>
      )}
    </div>
  )
}

