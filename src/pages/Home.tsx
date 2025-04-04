import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Brain, ChevronRight, Timer } from 'lucide-react';

const assessmentTypes = [
  {
    type: 'simple',
    title: '简易版评估',
    description: '10个简单直观的是/否选择题，适合快速了解职业倾向',
    duration: '1分钟',
    icon: Clock,
    features: ['快速评估职业兴趣', '基础RIASEC分析', '职业方向建议'],
  },
  {
    type: 'standard',
    title: '标准版评估',
    description: '60个详细的量表评估题，提供完整的霍兰德代码分析',
    duration: '6分钟',
    icon: Users,
    features: ['深入职业兴趣分析', '完整霍兰德代码解读', '匹配度职业推荐', '职业发展建议'],
  },
  {
    type: 'professional',
    title: '专业版评估',
    description: '180个专业评估题目，深入的个性特征分析和职业发展建议',
    duration: '18分钟',
    icon: Brain,
    features: ['全面职业性格测评', '详细个性特征分析', '职业倾向深度报告', '具体职业规划建议', '发展路径推荐'],
  },
];

const features = [
  {
    title: '科学的评估体系',
    description: '基于霍兰德RIASEC理论，准确分析职业兴趣类型',
  },
  {
    title: '个性化分析报告',
    description: '深入解读个人特征，提供针对性的职业建议',
  },
  {
    title: '全面的职业推荐',
    description: '匹配最适合的职业选择，助力职业规划决策',
  },
  {
    title: '便捷的测评体验',
    description: '简单易用的界面设计，清晰的测评引导',
  },
];

export function Home() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          霍兰德职业兴趣测评
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          通过科学的评估方法，了解您的职业兴趣类型，获取个性化的职业发展建议
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {assessmentTypes.map((assessment) => (
          <div
            key={assessment.type}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <assessment.icon className="h-12 w-12 text-[#1677ff] mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {assessment.title}
              </h2>
              <p className="text-gray-600 mb-4">{assessment.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>预计用时：{assessment.duration}</span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">包含功能：</h3>
              <ul className="space-y-2">
                {assessment.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <ChevronRight className="h-4 w-4 text-[#1677ff] mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <Link
                to={`/assessment/${assessment.type}`}
                className="bg-[#1677ff] text-white w-full py-3 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center text-base font-medium"
              >
                <Timer className="h-5 w-5 mr-2" />
                开始测试
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          了解自己，规划未来
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          霍兰德职业兴趣测评帮助你发现独特的职业倾向，为你的职业发展提供科学的指导。现在开始测评，探索最适合你的职业道路。
        </p>
      </div>
    </div>
  );
}