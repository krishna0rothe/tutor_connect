import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import BASE_URL from '../utils/constants';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const nevigate = useNavigate();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, data);
      setMessage({ text: response.data.message, type: response.data.status === 'success' ? 'success' : 'error' });

      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        nevigate("/dashboard");
      }
    } catch (error) {
      setMessage({ text: 'Error logging in', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {message && (
          <div className={`mb-4 p-2 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2"
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

