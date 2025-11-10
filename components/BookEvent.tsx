"use client"
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react"

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = await createBooking({ eventId, slug, email })

    if(success) {
      setSubmitted(true)
      posthog.capture('Event Booked', { eventId, slug, email })
    } else {
      console.error("Booking creation failed")
      posthog.captureException('')
    }

    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000)
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for Signing Up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Enter your email address"
            />

            <button type="submit" className="button-submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default BookEvent