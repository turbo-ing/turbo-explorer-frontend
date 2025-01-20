import TurboExplorer from '@/components/turbo-explorer'
import { config } from 'dotenv';

config();

export default function Home() {
  return (
    <main className="min-h-screen text-gray-600 bg-gray-100">
      <TurboExplorer />
    </main>
  )
}

