import React from 'react';
import { useForm } from 'react-hook-form';
import { PiPlus } from 'react-icons/pi';

interface AddStageFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
  isLoading: boolean;
}

export const AddStageForm: React.FC<AddStageFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ title: string; description: string }>();

  const onSubmitForm = (data: { title: string; description: string }) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Title must be 100 characters or less' } })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter stage title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required', maxLength: { value: 500, message: 'Description must be 500 characters or less' } })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter stage description"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          <>
            <PiPlus className="mr-2" />
            Add Stage
          </>
        )}
      </button>
    </form>
  );
};

