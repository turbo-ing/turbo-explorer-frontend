import { ZkProof } from '@/types'
import { Download, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { SessionDetailsChildrenProps } from '.'
import PaginatedSection from './PaginatedSection'

export default function ZKProofSection({ data, onQueryChange, query }: SessionDetailsChildrenProps<ZkProof>) {
  return (
    <PaginatedSection
      title="ZK Proofs"
      total={data.total}
      totalPages={data.totalPages}
      currentPage={data.currentPage}
      limit={query.limit || 10}
      notFoundMessage="No proofs found"
      countLabel="Proofs"
      onPageChange={(page: number) => onQueryChange({ ...query, page })}
      onLimitChange={(limit: number) => onQueryChange({ ...query, limit })}
    >
      {data.data.map((proof) => (
        <div key={proof.id} className={`py-4 ${data.data.indexOf(proof) === data.data.length - 1 ? 'border-t border-b' : 'border-t'}`}>          <div className="flex justify-between items-start mb-2">
          <span className="font-medium">Proof {proof.id}</span>
          <span className="text-sm text-stone-500">
            {new Date(Number(proof.recent_blob_pull)).toLocaleString()}
          </span>
        </div>
          <pre className="bg-stone-100 p-2 rounded text-sm overflow-x-auto mb-4">
            {JSON.stringify(JSON.parse(proof.proof), null, 1)}
          </pre>
          <div className="flex justify-end space-x-2">
            <Button>
              <Check className="w-4 h-4" />
              Verify proof
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4" />
              Download Proof
            </Button>
          </div>
        </div>
      ))}
    </PaginatedSection>
  )
}
