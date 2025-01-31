import AddGameForm from '@/components/AddGameForm'
import BackButton from '@/components/BackButton'

export default function AddGamePage() {
  return (
    <div className="sm:bg-stone-100 bg-white h-full flex flex-col sm:p-8">
      <BackButton href={'/'} className=' pl-4 sm:pl-0'>
        Back to Games List
      </BackButton>
      <div className='grow flex align-middle items-center justify-center'>
      <AddGameForm />
      </div>
    </div>
  )
}

