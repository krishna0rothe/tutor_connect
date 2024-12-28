import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import BASE_URL from '../../../utils/constants';

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

interface AddEventFormData {
  title: string;
  thumbnail: string;
  description: string;
  date: string;
  time: string;
}

export function AddEventComponent() {
  const { register, handleSubmit, formState: { errors } } = useForm<AddEventFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const onSubmit = async (data: AddEventFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/event/create`, data, {
        headers: { token }
      });

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Failed to add event');
      }

      setMessage({ text: 'Event added successfully', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.response?.data?.message || 'Failed to add event. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <span className={`block mb-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </span>
      )}
      <div>
        <label htmlFor="title" className="block mb-1">Event Title</label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full p-2 border rounded"
          placeholder="Enter event title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="thumbnail" className="block mb-1">Thumbnail URL</label>
        <input
          type="url"
          id="thumbnail"
          {...register('thumbnail', { required: 'Thumbnail URL is required' })}
          className="w-full p-2 border rounded"
          placeholder="http://example.com/image.jpg"
        />
        {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          className="w-full p-2 border rounded"
          placeholder="Describe your event"
          rows={3}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block mb-1">Event Date</label>
        <input
          type="date"
          id="date"
          {...register('date', { required: 'Date is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="time" className="block mb-1">Event Time</label>
        <input
          type="time"
          id="time"
          {...register('time', { required: 'Time is required' })}
          className="w-full p-2 border rounded"
        />
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isSubmitting ? 'Adding Event...' : 'Add Event'}
      </button>
    </form>
  );
}

