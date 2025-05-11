import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, User, BarChart } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ClipboardList className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                <span className="ml-2 text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                  霍兰德职业测评
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <BarChart className="h-5 w-5 mr-1" />
                测评记录
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>霍兰德职业兴趣测评系统 - 科学的职业性格测试与职业规划工具</p>
            <p className="mt-2">基于RIASEC理论，助你找到最适合的职业方向</p>
          </div>
        </div>
      </footer>
    </div>
  );
}