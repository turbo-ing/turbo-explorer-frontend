import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Interaction } from './turbo-explorer'
import CeleniumBadge from './CeleniumBadge'

interface interactionsListProps {
  allActions: Interaction[]
  actions: Interaction[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function SessionActionsList({ allActions, actions, currentPage, totalPages, onPageChange }: interactionsListProps) {

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <p>INTERACTION COUNT: {allActions.length}</p>
      <h2 className="text-xl font-semibold mb-4">Session Interactions</h2>
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">{JSON.parse(action.body).data.type}</span>
              <span className="text-sm text-stone-500">{new Date(Number(action.recent_blob_pull)).toLocaleString()}</span>
            </div>
            <pre className="bg-stone-100 p-2 rounded text-sm overflow-x-auto mb-2">
              {JSON.stringify(JSON.parse(action.body).data.payload, null, 2)}
            </pre>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-stone-600">By {action.peer_id}</span>
              <CeleniumBadge namespaceString={JSON.parse(action.body).ns}/>
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
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-stone-700">
              Showing <span className="font-medium">{(currentPage - 1) * 5 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 5, allActions.length)}</span> of{' '}
              <span className="font-medium">{allActions.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-stone-300 bg-white text-sm font-medium text-stone-500 hover:bg-stone-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-stone-300 text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-stone-300 bg-white text-sm font-medium text-stone-500 hover:bg-stone-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

