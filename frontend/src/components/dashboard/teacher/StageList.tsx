import React from 'react';
import { motion } from 'framer-motion';
import { PiTrash } from 'react-icons/pi';

interface Stage {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface StageListProps {
  stages: Stage[];
  onDeleteStage: (stageId: string) => void;
}

export const StageList: React.FC<StageListProps> = ({ stages, onDeleteStage }) => {
  if (stages.length === 0) {
    return <p className="text-gray-500 text-center">No stages added yet.</p>;
  }

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Added on {new Date(stage.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDeleteStage(stage.id)}
              className="text-red-500 hover:text-red-600 transition-colors duration-300"
              aria-label="Delete stage"
            >
              <PiTrash size={20} />
            </button>
          </div>
          <p className="text-gray-700 mt-2">{stage.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

