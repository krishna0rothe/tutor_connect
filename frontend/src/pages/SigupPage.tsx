import React, { useState } from 'react';

const SignupPage: React.FC = () => {
  const [role, setRole] = useState<'student' | 'parent' | 'teacher'>('student');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block mb-1">Mobile</label>
            <input
              type="tel"
              id="mobile"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          {role === 'teacher' && (
            <>
              <div>
                <label htmlFor="specialization" className="block mb-1">Specialization</label>
                <select
                  id="specialization"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                </select>
              </div>
              <div>
                <label htmlFor="qualification" className="block mb-1">Qualification</label>
                <select
                  id="qualification"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                </select>
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

