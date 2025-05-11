import React from 'react';
import { Link } from 'react-router-dom';
import { useAssessmentStore } from '../store';
import type { AssessmentResult } from '../types'; // Import AssessmentResult type

export function Dashboard() {
  const { assessmentHistory } = useAssessmentStore();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">个人测评记录</h1>
      
      {assessmentHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">暂无测评记录。</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            开始新的测评
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {assessmentHistory.map((result: AssessmentResult, index: number) => (
            <div key={result.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-indigo-700">
                  {result.assessmentType === 'simple' ? '简易版' : result.assessmentType === 'standard' ? '标准版' : '专业版'}测评
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(result.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-1"><strong>霍兰德代码:</strong> {result.hollandCode}</p>
              {/* You might want to display a summary or a link to full results */}
              {/* Example: Link to a detailed result page, assuming a route like /results/:id */}
              <Link
                to={`/results?resultId=${result.id}`} // Assuming results page can take resultId as query param or part of path
                className="text-indigo-600 hover:text-indigo-800 font-medium mt-3 inline-block"
              >
                查看详情 &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for statistics, can be developed later */}
      {/*
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">统计分析</h2>
        <p className="text-gray-600 text-center">此部分功能正在开发中。</p>
      </div>
      */}
    </div>
  );
}