import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PiUser, PiEnvelope, PiPhone, PiGraduationCap, PiCertificate, PiCaretDown } from 'react-icons/pi';

interface TeacherProfile {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
}

const specializations = ['Mathematics', 'Science', 'Literature', 'History', 'Computer Science']

const qualifications = [
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Ph.D.',
  'Postdoctoral Fellowship',
  'Professional Certification',
];

const TeacherProfileEditForm: React.FC = () => {
  const [profile, setProfile] = useState<TeacherProfile>({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Mathematics',
    qualification: 'Ph.D.',
  });

  const [errors, setErrors] = useState<Partial<TeacherProfile>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof TeacherProfile]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TeacherProfile> = {};
    if (!profile.name.trim()) newErrors.name = 'Name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) newErrors.email = 'Invalid email format';
    if (!profile.phone.trim()) newErrors.phone = 'Phone is required';
    if (!profile.specialization) newErrors.specialization = 'Specialization is required';
    if (!profile.qualification) newErrors.qualification = 'Qualification is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', profile);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Teacher Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PiEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                value={profile.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PiPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PiGraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="specialization"
                id="specialization"
                className={`block w-full pl-10 pr-10 py-2 border ${errors.specialization ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                value={profile.specialization}
                onChange={handleChange}
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <PiCaretDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
          </div>

          <div>
            <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Qualification</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PiCertificate className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="qualification"
                id="qualification"
                className={`block w-full pl-10 pr-10 py-2 border ${errors.qualification ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none`}
                value={profile.qualification}
                onChange={handleChange}
              >
                <option value="">Select Qualification</option>
                {qualifications.map((qual) => (
                  <option key={qual} value={qual}>{qual}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <PiCaretDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
          </div>
        </div>

        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Profile
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default TeacherProfileEditForm;

