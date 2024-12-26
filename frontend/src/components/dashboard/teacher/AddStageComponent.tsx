import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AddStageForm } from './AddStageForm';
import { StageList } from './StageList';
import { Toast } from './Toast';
import axios from 'axios';
import BASE_URL from '../../../utils/constants';

interface Stage {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export const AddStageComponent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [stages, setStages] = useState<Stage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [deleteStageId, setDeleteStageId] = useState<string | null>(null);

  const handleAddStage = async (stageData: { title: string; description: string }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/stage/create`, { courseId, ...stageData }, {
        headers: {token }
      });
      setStages((prevStages) => [...prevStages, response.data.stage]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.response?.data?.message || 'Failed to add stage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStage = (stageId: string) => {
    setDeleteStageId(stageId);
  };

  const confirmDeleteStage = async () => {
    if (deleteStageId) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/api/stage/delete/${deleteStageId}`, {
          headers: { token}
        });
        setStages((prevStages) => prevStages.filter((stage) => stage.id !== deleteStageId));
        setDeleteStageId(null);
      } catch (error) {
        setIsError(true);
        setErrorMessage(error.response?.data?.message || 'Failed to delete stage');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Stage to Course</h1>
      <AddStageForm onSubmit={handleAddStage} isLoading={isLoading} />
      {isError && (
        <p className="text-red-500 mt-2">{errorMessage}</p>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Course Stages</h2>
        <StageList stages={stages} onDeleteStage={handleDeleteStage} />
      </div>
      <AnimatePresence>
        {showToast && (
          <Toast message="Stage added successfully!" onClose={() => setShowToast(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

