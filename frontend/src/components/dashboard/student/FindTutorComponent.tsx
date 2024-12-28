import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { PiMagnifyingGlass, PiStar, PiGraduationCap } from 'react-icons/pi';
import axios from 'axios';
import BASE_URL from '../../../utils/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Types
interface Tutor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  specialization: string;
  qualification: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// SearchBar Component
interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = debounce((q: string) => onSearch(q), 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for tutors..."
        className="w-full py-3 px-6 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
      >
        <PiMagnifyingGlass size={24} />
      </button>
    </form>
  );
};

// TutorCard Component
interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{tutor.name}</h2>
          <div className="flex items-center">
            <PiStar className="text-yellow-400" size={20} />
            <span className="ml-1 text-gray-600">4.5/5</span>
          </div>
        </div>
        <div className="flex items-center">
          <PiGraduationCap className="text-blue-500 mr-2" size={20} />
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            {tutor.specialization}
          </span>
        </div>
        <p className="text-gray-600">
          {tutor.qualification} qualified tutor specializing in {tutor.specialization}.
        </p>    
      </div>
    </motion.div>
  );
};

// TutorList Component
interface TutorListProps {
  tutors: Tutor[];
}

const TutorList: React.FC<TutorListProps> = ({ tutors }) => {
  if (tutors.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No tutors found. Try a different search query.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tutors.map((tutor, index) => (
        <motion.div
          key={tutor._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <TutorCard tutor={tutor} />
        </motion.div>
      ))}
    </div>
  );
};

// Main FindTutorComponent
export const FindTutorComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/tutor/all`, {
          headers: { token }
        });
        setTutors(response.data.tutors);
        setFilteredTutors(response.data.tutors);
      } catch (error) {
        toast.error('Error fetching tutors. Please try again later.');
      }
    };

    fetchTutors();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = tutors.filter(tutor =>
      tutor.name.toLowerCase().includes(query.toLowerCase()) ||
      tutor.specialization.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTutors(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Find a Tutor</h1>
        <motion.div
          initial={false}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TutorList tutors={filteredTutors} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

