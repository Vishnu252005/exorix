import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface Event {
  id: string;
  title: string;
  game: string;
  date: Timestamp;
  prize: string | number;
  registrationFee?: string | number;
  location: string;
  currentParticipants: number;
  capacity: number;
  status: string;
  image?: string;
}

// Initialize with null to indicate not yet loaded
let cachedEvents: Event[] | null = null;
let isInitialized = false;

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && cachedEvents) {
      console.log('Using cached events:', cachedEvents);
      setEvents(cachedEvents);
      setLoading(false);
      return;
    }

    console.log('Setting up events listener...'); // Debug log
    
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const newEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        
        console.log('Received events from Firestore:', newEvents); // Debug log
        setEvents(newEvents);
        cachedEvents = newEvents; // Update cache
        isInitialized = true;
        console.log('Updated cached events:', cachedEvents); // Debug log
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching events:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      // Don't reset cache on unmount
    };
  }, []);

  return { events, loading, error };
};

// Function to get cached events (for use outside React components)
export const getCachedEvents = () => {
  console.log('Getting cached events, current cache:', cachedEvents);
  if (!isInitialized) {
    console.log('Events not yet initialized');
  }
  return cachedEvents || [];
}; 