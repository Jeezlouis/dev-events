import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('NEXT_PUBLIC_BASE_URL is required in production') })()
    : 'http://localhost:3000')

const page = async () => {
  "use cache"
  cacheLife('hours')
  let events: IEvent[] = []
  
  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`)
    }
    
    const data = await response.json()
    events = data.events || []
  } catch (error) {
    console.error('Error fetching events:', error)
    // Return empty array as fallback - page will still render
  }

  return (
    <section>
      <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className='mt-10 space-y-7'>
        <h2>Fetured Events</h2>

        <ul className='events'>
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className='list-none'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page