import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/constants';

const SignupPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'parent' | 'teacher'>('student');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const nevigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      let endpoint = '';
      if (role === 'student') endpoint = '/registerstudent';
      if (role === 'parent') endpoint = '/registerparent';
      if (role === 'teacher') endpoint = '/registerteacher';

      const response = await axios.post(`${BASE_URL}/api/auth${endpoint}`, data);
      setMessage({ text: response.data.message, type: response.data.status === 'success' ? 'success' : 'error' });

      if (response.data.status === 'success') {
          nevigate('/login');
      }
    } catch (error) {
      setMessage({ text: 'Error submitting form', type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex mb-4">
          {['student', 'parent', 'teacher'].map((r) => (
            <button
              key={r}
              className={`flex-1 py-2 ${role === r ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setRole(r as 'student' | 'parent' | 'teacher')}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        {message && (
          <div className={`mb-4 p-2 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="mobile" className="block mb-1">Mobile</label>
            <input
              type="tel"
              id="mobile"
              {...register('mobile', { required: 'Mobile number is required' })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.mobile && <p className="text-red-600">{errors.mobile.message}</p>}
          </div>
          {role === 'parent' && (
            <div>
              <label htmlFor="studentEmail" className="block mb-1">Student Email</label>
              <input
                type="email"
                id="studentEmail"
                {...register('studentEmail', { required: 'Student Email is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.studentEmail && <p className="text-red-600">{errors.studentEmail.message}</p>}
            </div>
          )}
          {role === 'teacher' && (
            <>
              <div>
                <label htmlFor="specialization" className="block mb-1">Specialization</label>
                <select
                  id="specialization"
                  {...register('specialization', { required: 'Specialization is required' })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select specialization</option>
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                </select>
                {errors.specialization && <p className="text-red-600">{errors.specialization.message}</p>}
              </div>
              <div>
                <label htmlFor="qualification" className="block mb-1">Qualification</label>
                <select
                  id="qualification"
                  {...register('qualification', { required: 'Qualification is required' })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select qualification</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                </select>
                {errors.qualification && <p className="text-red-600">{errors.qualification.message}</p>}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
