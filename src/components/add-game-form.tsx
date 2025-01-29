'use client'

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Game } from './turbo-explorer';
import api from '@/util/api';

export default function AddGameForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Game>>()
  const router = useRouter()

  const onSubmit = async (data: Partial<Game>) => {
    // Here you would typically send the data to your backend

    try {
      // Validate input data and ensure required fields are non-undefined
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

      await router.push('/');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div>
      <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games List
      </Link>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name', { required: 'Game name is required' })}
              type="text"
              id="name"
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              {...register('description', { required: 'Description is required' })}
              type="text"
              id="description"
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.sessions && <p className="mt-1 text-sm text-red-600">{errors.sessions.message}</p>}
          </div>
          <div>
            <label htmlFor="domain_name" className="block text-sm font-medium text-gray-700">Domain Name</label>
            <input
              {...register('domain_name', { required: 'Domain name is required' })}
              type="text"
              id="domain_name"
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.sessions && <p className="mt-1 text-sm text-red-600">{errors.sessions.message}</p>}
          </div>
          <div>
            <label htmlFor="game_id" className="block text-sm font-medium text-gray-700">Game ID / Slug</label>
            <input
              {...register('game_id', { required: 'Game ID / Slug is required' })}
              type="text"
              id="game_id"
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.interactions && <p className="mt-1 text-sm text-red-600">{errors.interactions.message}</p>}
          </div>
          <div>
            <label htmlFor="verification_key" className="block text-sm font-medium text-gray-700">Verification key</label>
            <input
              {...register('verification_key', { required: 'Verification key is required' })}
              type="text"
              id="game_id"
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
    </div>
  )
}

