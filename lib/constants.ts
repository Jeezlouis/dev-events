export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "June 13-17, 2025",
    time: "9:00 AM - 6:00 PM CEST"
  },
  {
    title: "Google I/O 2025",
    image: "/images/event2.png",
    slug: "google-io-2025",
    location: "Mountain View, CA",
    date: "May 14-15, 2025",
    time: "10:00 AM - 5:00 PM PST"
  },
  {
    title: "AWS re:Invent 2025",
    image: "/images/event3.png",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, NV",
    date: "November 30 - December 4, 2025",
    time: "8:00 AM - 8:00 PM PST"
  },
  {
    title: "GitHub Universe 2025",
    image: "/images/event4.png",
    slug: "github-universe-2025",
    location: "San Francisco, CA",
    date: "October 29-30, 2025",
    time: "9:00 AM - 6:00 PM PST"
  },
  {
    title: "PyCon US 2025",
    image: "/images/event5.png",
    slug: "pycon-us-2025",
    location: "Pittsburgh, PA",
    date: "May 14-22, 2025",
    time: "9:00 AM - 5:00 PM EST"
  },
  {
    title: "KubeCon + CloudNativeCon",
    image: "/images/event6.png",
    slug: "kubecon-2025",
    location: "London, UK",
    date: "April 1-4, 2025",
    time: "9:00 AM - 6:00 PM BST"
  },
];
