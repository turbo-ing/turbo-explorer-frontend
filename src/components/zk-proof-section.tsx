import { ZkProof } from '@/app/session/[id]/page'
import { Download, CheckCircle, Verified, Check } from 'lucide-react'
import { FileQuestion } from 'lucide-react'
import NotFoundElement from './NotFoundElement'
import { Button } from './ui/button'

interface ZkProofSectionProps {
  proofs: ZkProof[]
}

export default function ZKProofSection({ proofs }: ZkProofSectionProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">ZK Proofs</h2>
        <div className="flex space-x-2">
        </div>
      </div>
      <div className="space-y-4">
        {proofs && proofs.length === 0 ? (
          <NotFoundElement message="No proofs found" />
        ) : (
          proofs.map((proof) => (
            <div key={proof.id} className="border-b py-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">Proof {"("}ID: {proof.id}{")"}</span>
                <span className="text-sm text-stone-500">{new Date(Number(proof.recent_blob_pull)).toLocaleString()}</span>
              </div>
              <pre className="bg-stone-100 p-2 rounded text-sm overflow-x-auto mb-4">
                {JSON.stringify(JSON.parse(proof.proof), null, 1)}
              </pre>
              <div className="flex justify-end space-x-2">
                <Button className="">
                  <Check className="w-4 h-4" />
                  Verify proof
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Download Proof
                </Button>
                {/* <Button className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Verify proof {"("}ID: {proof.id}{")"}
                </Button>
                <Button variant="outline" className=" bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center text-sm">
                  <Download className="w-4 h-4" />
                  Download Proof
                </Button> */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

