import { Game } from './turbo-explorer'

interface GamesListProps {
  games: Game[]
}

export default function GamesList({ games }: GamesListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Games List</h2>
      <ul className="space-y-4">
        {games.map((game) => (
          <li key={game.id} className="border-b pb-2">
            <h3 className="font-medium">{game.name}</h3>
            <p className="text-sm text-gray-600">
              Sessions: {game.sessions} | Interactions: {game.interactions}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

