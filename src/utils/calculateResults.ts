import { HollandCode, UserResponse, AssessmentResult, AssessmentType } from '../types';
import { getTopTwoHollandCodes } from './hollandAnalysis';

// 计算霍兰德测试结果
export function calculateResults(responses: Response[], assessmentType: AssessmentType): AssessmentResult {
  // 简化版本，使用随机数据
  const scores: Record<HollandCode, number> = {
    R: Math.floor(Math.random() * 10),
    I: Math.floor(Math.random() * 10),
    A: Math.floor(Math.random() * 10),
    S: Math.floor(Math.random() * 10),
    E: Math.floor(Math.random() * 10),
    C: Math.floor(Math.random() * 10)
  };
  
  const hollandCode = getTopTwoHollandCodes(scores);
  
  return {
    scores,
    hollandCode,
    assessmentType,
    timestamp: new Date().toISOString()
  };
}

// 根据问题ID获取问题类型
const getQuestionType = (
  questionId: number,
  assessmentType: 'simple' | 'standard' | 'professional'
): HollandCode | null => {
  // 简易版测评
  if (assessmentType === 'simple') {
    if (questionId >= 1 && questionId <= 2) return 'R';
    if (questionId >= 3 && questionId <= 4) return 'I';
    if (questionId >= 5 && questionId <= 6) return 'A';
    if (questionId >= 7 && questionId <= 8) return 'S';
    if (questionId >= 9 && questionId <= 10) return 'E';
  }
  // 标准版测评
  else if (assessmentType === 'standard') {
    if (questionId >= 1 && questionId <= 10) return 'R';
    if (questionId >= 11 && questionId <= 20) return 'I';
    if (questionId >= 21 && questionId <= 30) return 'A';
    if (questionId >= 31 && questionId <= 40) return 'S';
    if (questionId >= 41 && questionId <= 50) return 'E';
    if (questionId >= 51 && questionId <= 60) return 'C';
  }
  // 专业版测评
  else if (assessmentType === 'professional') {
    if (questionId >= 1 && questionId <= 30) return 'R';
    if (questionId >= 31 && questionId <= 60) return 'I';
    if (questionId >= 61 && questionId <= 90) return 'A';
    if (questionId >= 91 && questionId <= 120) return 'S';
    if (questionId >= 121 && questionId <= 150) return 'E';
    if (questionId >= 151 && questionId <= 180) return 'C';
  }
  
  return null;
};

// 生成唯一ID
const generateId = (): string => {
  return 'result-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};