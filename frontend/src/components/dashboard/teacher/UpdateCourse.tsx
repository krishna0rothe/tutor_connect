import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import BASE_URL from '../../../utils/constants';

interface CourseData {
  id: string;
  name: string;
  description: string;
  specialization: string;
  total_stages: number;
  thumbnail: string;
}

const specializations = ['Mathematics', 'Science', 'Literature', 'History', 'Computer Science'];

interface UpdateCourseComponentProps {
  courseId: string;
  onCancel: () => void;
  onUpdateSuccess: () => void;
}

export const UpdateCourse: React.FC<UpdateCourseComponentProps> = ({ courseId, onCancel, onUpdateSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<CourseData>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<CourseData | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsError(true);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/course/${courseId}`, {
          headers: { token}
        });
        const data: CourseData = response.data.course;
        setFormData(data);
        reset(data);
        setValue('specialization', data.specialization); // Set specialization value
      } catch (error) {
        console.error('Error fetching course data:', error);
        setIsError(true);
      }
    };

    fetchCourseData();
  }, [courseId, reset, setValue]);

  const onSubmit: SubmitHandler<CourseData> = async (data) => {
    setShowConfirmModal(true);
    setFormData(data);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsError(true);
        return;
      }

      await axios.put(`${BASE_URL}/api/course/update/${courseId}`, formData, {
        headers: {token }
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onUpdateSuccess();
      }, 3000);
    } catch (error) {
      console.error('Error updating course:', error);
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Edit Course: {formData.name}</h1>
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
              defaultValue={formData.specialization} // Set default value
            >
              <option value={specializations}>Select Specialization</option>
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
                max: { value: 50, message: "Total stages must be 50 or less" }
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-md transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Save className="mr-2" size={20} />
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold mb-4">Confirm Update</h2>
              <p>Are you sure you want to save these changes?</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in-up">
            <CheckCircle className="mr-2" size={20} />
            <p>Course updated successfully!</p>
          </div>
        )}

        {isError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in-up">
            <AlertCircle className="mr-2" size={20} />
            <p>Unable to update course. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

