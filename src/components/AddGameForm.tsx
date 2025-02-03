'use client'

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Game } from './turbo-explorer';
import { Input } from './ui/input';
import { Button } from './ui/button';
import api from '@/util/api';

export default function AddGameForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Game>>()
  const router = useRouter()

  const onSubmit = async (data: Partial<Game>) => {
    // Here you would typically send the data to your backend

    try {
      // Validate Input data and ensure required fields are non-undefined
      const name = data.name ?? '';
      const description = data.description ?? '';
      const domain_name = data.domain_name ?? '';
      const game_id = data.game_id ?? '';
      const verification_key = data.verification_key ?? '';

      if (!name || !description || !domain_name || !game_id || !verification_key) {
        throw new Error('All fields are required.');
      }

      // Construct query string using URLSearchParams
      const params = new URLSearchParams({ name, description, domain_name, game_id, verification_key });

      // Send API request
      const response = await api.post(`/apps/addApp?${params.toString()}`);
      console.log('Submitted data:', data);
      console.log('Response data:', response.data);

      await router.push(`/game/${name}`);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="sm:bg-white shadow-none sm:shadow-md rounded-lg p-5 sm:p-6 w-full sm:w-[30rem]
">
        <h1 className="text-3xl text-stone-700 font-bold mb-5 mt-1">Add New Game</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700">Name</label>
            <Input
              {...register('name', { required: 'Game name is required' })}
              type="text"
              id="name"
              className="mt-1 block w-full text-stone-600 rounded-md border-stone-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
            <Input
              {...register('description', { required: 'Description is required' })}
              type="text"
              id="description"
              className="mt-1 block w-full text-stone-600 rounded-md border-stone-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          <div>
            <label htmlFor="domain_name" className="block text-sm font-medium text-stone-700">Domain Name</label>
            <Input
              {...register('domain_name', { required: 'Domain name is required' })}
              type="text"
              id="domain_name"
              className="mt-1 block w-full text-stone-600 rounded-md border-stone-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
            />
            {errors.domain_name && <p className="mt-1 text-sm text-red-600">{errors.domain_name.message}</p>}
          </div>
          <div>
            <label htmlFor="game_id" className="block text-sm font-medium text-stone-700">Game ID / Slug</label>
            <Input
              {...register('game_id', { required: 'Game ID / Slug is required' })}
              type="text"
              id="game_id"
              className="mt-1 block w-full text-stone-600 rounded-md border-stone-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
            />
            {errors.game_id && <p className="mt-1 text-sm text-red-600">{errors.game_id.message}</p>}
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>
          <div>
            <label htmlFor="verification_key" className="block text-sm font-medium text-stone-700">Verification key</label>
            <Input
              {...register('verification_key', { required: 'Verification key is required' })}
              type="text"
              id="game_id"
              className="mt-1 block w-full text-stone-600 rounded-md border-stone-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
            />
            {errors.verification_key && <p className="mt-1 text-sm text-red-600">{errors.verification_key.message}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-stone-900 text-white border border-transparent py-2 px-4 rounded-md hover:bg-white hover:text-stone-900 border-stone-900"
          >
            Add Game
          </Button>
        </div>
      </form>
  )
}

