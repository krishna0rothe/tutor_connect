'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, Clock, Users } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import BASE_URL from '@/utils/constants';

interface Event {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  date: string;
  time: string;
  attendees: string[];
  createdBy: string;
}

export function EventListComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/event/upcoming`, {
          headers: {token}
        });
        setEvents(response.data.upcomingEvents);
      } catch (err) {
        setError('Error loading events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAttend = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/event/register/${eventId}`, {}, {
        headers: {token }
      });

      if (response.status === 200) {
        if (token) {
          setEvents(prevEvents =>
            prevEvents.map(event =>
              event._id === eventId ? { ...event, attendees: [...event.attendees, token] } : event
            )
          );
        } else {
          throw new Error('Token is null');
        }
        setMessage({ text: 'Successfully registered for the event', type: 'success' });
      } else {
        throw new Error(response.data.message || 'Failed to register for the event');
      }
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Error registering for the event. Please try again later.', type: 'error' });
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      {message && (
        <span className={`block mb-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </span>
      )}
      <div className="flex items-center space-x-2">
        <Search className="text-gray-400" />
        <Input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="w-full">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <img src={event.thumbnail} alt={event.title} className="w-full md:w-48 h-48 object-cover rounded-md mb-4 md:mb-0 md:mr-4" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees.length} attendees</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAttend(event._id)}
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Attend
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No events available.</div>
      )}
    </div>
  );
}

