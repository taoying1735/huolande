import React from 'react';
import { useAssessmentStore } from '../store';

export function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">个人测评记录</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">历史测评</h2>
          {/* Add assessment history list */}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">统计分析</h2>
          {/* Add assessment statistics */}
        </div>
      </div>
    </div>
  );
}