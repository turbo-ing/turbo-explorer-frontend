interface StatsBarProps {
    gamesCount: number
    sessionsCount: number
    interactionsCount: number
  }
  
  export default function StatsBar({ gamesCount, sessionsCount, interactionsCount }: StatsBarProps) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Games:</span>
            <span className="font-medium">{gamesCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(gamesCount / 10) * 100}%` }}></div>
          </div>
          <div className="flex justify-between">
            <span>Sessions:</span>
            <span className="font-medium">{sessionsCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(sessionsCount / 1000) * 100}%` }}></div>
          </div>
          <div className="flex justify-between">
            <span>Interactions:</span>
            <span className="font-medium">{interactionsCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${(interactionsCount / 5000) * 100}%` }}></div>
          </div>
        </div>
      </div>
    )
  }
  
  