import TurboExplorer from '@/components/turbo-explorer'
import { config } from 'dotenv';

config();

export default function Home() {
  return (
      <TurboExplorer />
  )
}

