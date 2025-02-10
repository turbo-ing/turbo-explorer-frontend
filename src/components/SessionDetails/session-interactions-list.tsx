import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Interaction } from '@/types'
import CeleniumBadge from '../CeleniumBadge'
import NotFoundElement from '../NotFoundElement'
import { Button } from '../ui/button'

interface interactionsListProps {
  allActions: Interaction[]
  actions: Interaction[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function SessionInteractionsList({ allActions, actions, currentPage, totalPages, onPageChange }: interactionsListProps) {

  // Pagination logic
  // const indexOfLastAction = currentPage * actionsPerPage
  // const indexOfFirstAction = indexOfLastAction - actionsPerPage
  // const currentInteractions = interactions.slice(indexOfFirstAction, indexOfLastAction)
  // const totalPages = Math.ceil(interactions.length / actionsPerPage)

  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-1"> Session Interactions</h2>
      {actions && actions.length === 0 ? (
        <NotFoundElement message="No interactions found" />
      ) : (
        <>
          <p className='text-sm mb-3'>{allActions.length} Interactions</p>
          <div className="">
            {actions.map((action) => (
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
                  {/* <a
                href={formatNamespaceURL(JSON.parse(action.body).ns)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline text-sm"
              >
                View on Celenium
                <ExternalLink className="w-4 h-4 ml-1" />
              </a> */}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-2 px-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of{" "}
                {totalPages}
              </div>

              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

