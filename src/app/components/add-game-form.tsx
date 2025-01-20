'use client'

import { useForm } from 'react-hook-form'
import { Game } from './turbo-explorer'

interface AddGameFormProps {
  onAddGame: (game: Omit<Game, 'id'>) => void
}

export default function AddGameForm({ onAddGame }: AddGameFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Game, 'id'>>()

  const onSubmit = (data: Omit<Game, 'id'>) => {
    onAddGame(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Game</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Game Name</label>
          <input
            {...register('name', { required: 'Game name is required' })}
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="sessions" className="block text-sm font-medium text-gray-700">Sessions</label>
          <input
            {...register('sessions', { required: 'Sessions count is required', valueAsNumber: true })}
            type="number"
            id="sessions"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.sessions && <p className="mt-1 text-sm text-red-600">{errors.sessions.message}</p>}
        </div>
        <div>
          <label htmlFor="interactions" className="block text-sm font-medium text-gray-700">Interactions</label>
          <input
            {...register('interactions', { required: 'Interactions count is required', valueAsNumber: true })}
            type="number"
            id="interactions"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.interactions && <p className="mt-1 text-sm text-red-600">{errors.interactions.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Game
        </button>
      </div>
    </form>
  )
}

