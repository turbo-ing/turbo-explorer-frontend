// SessionInteractionsList.tsx
import { Interaction } from '@/types'
import CeleniumBadge from '../CeleniumBadge'
import { SessionDetailsChildrenProps } from '.'
import PaginatedSection from './PaginatedSection'

export default function SessionInteractionsList({ data, onQueryChange, query }: SessionDetailsChildrenProps<Interaction>) {
  return (
    <PaginatedSection
      title="Session Interactions"
      total={data.total}
      totalPages={data.totalPages}
      currentPage={data.currentPage}
      limit={query.limit || 10}
      notFoundMessage="No interactions found"
      countLabel="Interactions"
      onPageChange={(page) => onQueryChange({ ...query, page })}
      onLimitChange={(limit) => onQueryChange({ ...query, limit })}
    >
      <>
        <div>
          {data.data.map((action) => {
            const parsedBody = JSON.parse(action.body)
            return (
              <div key={action.id} className={`py-4 ${data.data.indexOf(action) === data.data.length - 1 ? 'border-t border-b' : 'border-t'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{parsedBody.data.type}</span>
                  <span className="text-sm text-stone-500">
                    {new Date(Number(action.recent_blob_pull)).toLocaleString()}
                  </span>
                </div>
                <pre className="bg-stone-100 text-stone-600 p-2 rounded text-sm overflow-x-auto mb-2">
                  {JSON.stringify(parsedBody.data.payload, null, 2)}
                </pre>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-stone-600 truncate mr-2">By {action.peer_id}</span>
                  <CeleniumBadge namespaceString={parsedBody.ns} />
                </div>
              </div>
            )
          })}
        </div>
      </>
    </PaginatedSection>
  )
}
