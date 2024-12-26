import React, { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle, CheckCircle } from 'lucide-react';
import BASE_URL from '../../../utils/constants';

interface CourseData {
  name: string;
  description: string;
  specialization: string;
  total_stages: number;
  thumbnail: string;
}

const specializations = ['Mathematics', 'Science', 'Literature', 'History', 'Computer Science'];

export const CreateCourse: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CourseData>();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const onSubmit: SubmitHandler<CourseData> = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ text: 'User not authenticated', type: 'error' });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/course/create`, data, {
        headers: { token }
      });
      setMessage({ text: response.data.message, type: 'success' });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage({ text: error.response.data.message, type: 'error' });
      } else {
        setMessage({ text: 'Error creating course', type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Create a New Course</h1>
        {message && (
          <div className={`mb-4 p-2 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required", maxLength: { value: 100, message: "Name must be 100 characters or less" } })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              {...register("description", { required: "Description is required", maxLength: { value: 500, message: "Description must be 500 characters or less" } })}
              rows={4}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-invalid={errors.description ? "true" : "false"}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <select
              id="specialization"
              {...register("specialization", { required: "Please select a specialization" })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-invalid={errors.specialization ? "true" : "false"}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>}
          </div>

          <div>
            <label htmlFor="total_stages" className="block text-sm font-medium text-gray-700 mb-1">Total Stages</label>
            <input
              type="number"
              id="total_stages"
              {...register("total_stages", { 
                required: "Total stages is required", 
                min: { value: 1, message: "Total stages must be at least 1" },
                max: { value: 10, message: "Total stages must be 50 or less" }
              })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-invalid={errors.total_stages ? "true" : "false"}
            />
            {errors.total_stages && <p className="mt-1 text-sm text-red-600">{errors.total_stages.message}</p>}
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Path</label>
            <input
              type="text"
              id="thumbnail"
              {...register("thumbnail", { required: "Thumbnail path is required" })}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-invalid={errors.thumbnail ? "true" : "false"}
              placeholder="/path/to/thumbnail.jpg"
            />
            {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-md transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <PlusCircle className="mr-2" size={20} />
            )}
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </form>
        {isSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-4 animate-fade-in-up">
              <CheckCircle className="text-green-500" size={24} />
              <p className="text-lg font-semibold">Course created successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

