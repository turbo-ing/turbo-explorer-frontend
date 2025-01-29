import { ZkProof } from '@/app/session/[id]/page'
import { Download, CheckCircle } from 'lucide-react'


interface ZkProofSectionProps {
  proofs: ZkProof[]
}

export default function ZKProofSection({ proofs }: ZkProofSectionProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">ZK Proof</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Verify
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download Verification Key
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {proofs.map((proof) => (
          <div key={proof.id} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Proof {"("}ID: {proof.id}{")"}</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto mb-4">
              {JSON.stringify(JSON.parse(proof.proof), null, 1)}
            </pre>
            <div className="flex justify-end space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify proof {"("}ID: {proof.id}{")"}
              </button>
              <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center text-sm">
                <Download className="w-4 h-4 mr-2" />
                Download Proof
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

