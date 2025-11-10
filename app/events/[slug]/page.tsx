import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookEvent from "@/components/BookEvent"
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? (() => { throw new Error('NEXT_PUBLIC_BASE_URL is required in production') })()
    : 'http://localhost:3000')


const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems } : { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({tags} : { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>{tag}</div>
      ))}
  </div>
)

const EventDetailsPage = async ({ params }: {params: Promise<{ slug: string }>}) => {
  "use cache"
  cacheLife('hours')
  const { slug } = await params
  try {
    const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return notFound()
      }
      throw new Error(`Failed to fetch event: ${response.status}`)
    }
    
    const { data: event } = await response.json()
    
    if (!event) return notFound()
    
    const { description, image, overview, date, time, agenda, location, mode, audience, tags, organizer } = event

    const bookings = 10;

    const similarEvents = await getSimilarEventsBySlug(slug)

  return (
    <section id="event"> 
      <div className="header">
          <h1>Event Description</h1>
          <p>{description}</p>
      </div>

      <div className="details">
          {/* Left side - Event Container */}   
            <div className="content">
              <Image src={image} alt="Event Banner" width={800} height={800} className="banner"/>
              <section className="flex-col-gap-2">
                <h2>Overview</h2>
                <p>{overview}</p>
              </section>

              <section className="flex-col-gap-2">
                <h2>Event Details</h2>
                <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
              </section>

              <EventAgenda agendaItems={agenda}  />

              <section className="flex-col-gap-2">
                <h2>About Organizer</h2>
                <p>{organizer}</p>
              </section>

              <EventTags tags={tags} />


            </div>
          {/* Right Side - Booking Form */}
          <aside className="booking">
              <div className="signup-card">
                <h2>Book Your Spot</h2>
                {bookings > 0 ? (
                  <p className="text-sm">
                    Join {bookings} people who have already book their spot!
                  </p>
                ) : (
                  <p className="text-sm">Be the first to book your !spot</p>
                )}

                <BookEvent eventId={event._id} slug={event.slug} />
              </div>
          </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
            <h2>Similar Events</h2>
            <div className="events">
                {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                  <EventCard key={similarEvent._id.toString()} {...similarEvent} />
                ))}
            </div>
      </div>
    </section>
  )
  } catch (error) {
    console.error('Error fetching event:', error)
    throw error
  }
}

export default EventDetailsPage