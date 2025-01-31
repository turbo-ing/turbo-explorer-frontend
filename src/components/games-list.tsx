import Link from 'next/link'
import { Game } from './turbo-explorer'
import { Circle } from 'lucide-react'
import Image from 'next/image'

interface GamesListProps {
  games: Game[]
}

export default function GamesList({ games }: GamesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Link href={`/game/${game.slug}`} key={game.id} className="block">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center mb-4">
              {game.icon ?
                <Image src={game.icon} width={10} height={10} alt={game.name + "icon"} />
                :
                <Circle className="w-10 h-10 text-turbo-red mr-4" />
              }
              <h3 className="text-xl font-semibold">{game.name}</h3>
              <p className='text-muted'>{game.id}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Sessions: {game.session_count}</p>
              <p>Interactions: {game.interaction_count}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

