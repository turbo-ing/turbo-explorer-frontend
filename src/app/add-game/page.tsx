import AddGameForm from '@/components/add-game-form'

export default function AddGamePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Game</h1>
      <AddGameForm />
    </div>
  )
}

