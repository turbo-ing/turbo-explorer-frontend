import { Interaction } from '@/types'
import CeleniumBadge from '../CeleniumBadge'
import NotFoundElement from '../NotFoundElement'
import PaginationControls from '../PaginationControls'
import { SessionDetailsChildrenProps } from '.'
export default function SessionInteractionsList({ data, onQueryChange, query }: SessionDetailsChildrenProps<Interaction>) {

  const handleNextPrev = (num: number) => {
    let oldPage = data.currentPage
    if(typeof num === 'string'){
      oldPage = Number(oldPage)
    }
    const newPage = oldPage + num
    const guardedPage = handleWithinBounds(newPage)
    onQueryChange({ ...query, page: guardedPage})
  }

  const handleWithinBounds = (num: number) => {
    return num < 1 ? 1 : num > data.totalPages ? data.totalPages : num
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-1"> Session Interactions</h2>
      {data.data.length === 0 ? (
        <NotFoundElement message="No interactions found" />
      ) : (
        <>
          <p className='text-sm mb-3'>{data.total} Interactions</p>
          <div className="">
            {data.data.map((action) => (
              <div key={action.id} className=" border-y py-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{JSON.parse(action.body).data.type}</span>
                  <span className="text-sm text-stone-500">{new Date(Number(action.recent_blob_pull)).toLocaleString()}</span>
                </div>
                <pre className="bg-stone-100 text-stone-600 p-2 rounded text-sm overflow-x-auto mb-2">
                  {JSON.stringify(JSON.parse(action.body).data.payload, null, 2)}
                </pre>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-stone-600 truncate mr-2">By {action.peer_id}</span>
                  <CeleniumBadge namespaceString={JSON.parse(action.body).ns} />
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <PaginationControls
            className="border-t-0 mt-2"
            pageCount={data.totalPages}
            pageIndex={data.currentPage}
            pageSize={query.limit || 10}
            setPageIndex={(num: number) => onQueryChange({ ...query, page: handleWithinBounds(num) })}
            setPageSize={(num: number) => onQueryChange({ ...query, limit: num })}
            nextPage={() => handleNextPrev(1)}
            previousPage={() => handleNextPrev(-1)} />
        </>
      )}
    </div>
  )
}