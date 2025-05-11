import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../store';
import type { Question, AssessmentType, HollandCode, QuestionResponse, AssessmentResult } from '../types';
import { calculateResults } from '../utils/calculateResults';

const questions: Record<string, Question[]> = {
  simple: [
    { id: 1, text: '我喜欢动手制作或修理物品', type: 'R' },
    { id: 2, text: '我喜欢研究和分析问题', type: 'I' },
    { id: 3, text: '我喜欢创作艺术作品或音乐', type: 'A' },
    { id: 4, text: '我喜欢帮助和指导他人', type: 'S' },
    { id: 5, text: '我喜欢领导和说服他人', type: 'E' },
    { id: 6, text: '我喜欢按计划和规则做事', type: 'C' },
    { id: 7, text: '我喜欢户外和体力活动', type: 'R' },
    { id: 8, text: '我喜欢探索新的想法和理论', type: 'I' },
    { id: 9, text: '我喜欢与人交往和沟通', type: 'S' },
    { id: 10, text: '我喜欢组织和管理事务', type: 'E' }
  ],
  standard: [
    // 现实型(R)
    { id: 1, text: '我喜欢使用工具和机械设备', type: 'R' },
    { id: 2, text: '我喜欢户外工作', type: 'R' },
    { id: 3, text: '我喜欢动手组装或修理东西', type: 'R' },
    { id: 4, text: '我喜欢参与体育运动', type: 'R' },
    { id: 5, text: '我喜欢处理具体的事物', type: 'R' },
    { id: 6, text: '我喜欢制作手工艺品', type: 'R' },
    { id: 7, text: '我喜欢操作机器设备', type: 'R' },
    { id: 8, text: '我喜欢从事需要体力的工作', type: 'R' },
    { id: 9, text: '我喜欢解决实际的问题', type: 'R' },
    { id: 10, text: '我喜欢亲手完成项目', type: 'R' },
    // 研究型(I)
    { id: 11, text: '我喜欢解决复杂的问题', type: 'I' },
    { id: 12, text: '我喜欢进行科学研究', type: 'I' },
    { id: 13, text: '我喜欢分析数据和信息', type: 'I' },
    { id: 14, text: '我喜欢探索新的理论', type: 'I' },
    { id: 15, text: '我喜欢进行实验', type: 'I' },
    { id: 16, text: '我喜欢思考抽象的概念', type: 'I' },
    { id: 17, text: '我喜欢阅读科技文章', type: 'I' },
    { id: 18, text: '我喜欢独立思考问题', type: 'I' },
    { id: 19, text: '我喜欢研究事物的原理', type: 'I' },
    { id: 20, text: '我喜欢学习新的知识', type: 'I' },
    // 艺术型(A)
    { id: 21, text: '我喜欢创作艺术作品', type: 'A' },
    { id: 22, text: '我喜欢表达自己的想法', type: 'A' },
    { id: 23, text: '我喜欢音乐表演', type: 'A' },
    { id: 24, text: '我喜欢设计新的事物', type: 'A' },
    { id: 25, text: '我喜欢写作或创作', type: 'A' },
    { id: 26, text: '我喜欢参与艺术活动', type: 'A' },
    { id: 27, text: '我喜欢尝试新的创意', type: 'A' },
    { id: 28, text: '我喜欢欣赏艺术作品', type: 'A' },
    { id: 29, text: '我喜欢独特的表达方式', type: 'A' },
    { id: 30, text: '我喜欢创新和想象', type: 'A' },
    // 社会型(S)
    { id: 31, text: '我喜欢帮助他人解决问题', type: 'S' },
    { id: 32, text: '我喜欢教导和培训他人', type: 'S' },
    { id: 33, text: '我喜欢与人合作', type: 'S' },
    { id: 34, text: '我喜欢参与社交活动', type: 'S' },
    { id: 35, text: '我喜欢关心他人的需求', type: 'S' },
    { id: 36, text: '我喜欢提供建议和指导', type: 'S' },
    { id: 37, text: '我喜欢参与志愿服务', type: 'S' },
    { id: 38, text: '我喜欢照顾他人', type: 'S' },
    { id: 39, text: '我喜欢促进团队合作', type: 'S' },
    { id: 40, text: '我喜欢解决人际关系问题', type: 'S' },
    // 企业型(E)
    { id: 41, text: '我喜欢领导团队', type: 'E' },
    { id: 42, text: '我喜欢制定目标和计划', type: 'E' },
    { id: 43, text: '我喜欢说服他人', type: 'E' },
    { id: 44, text: '我喜欢做决策', type: 'E' },
    { id: 45, text: '我喜欢组织活动', type: 'E' },
    { id: 46, text: '我喜欢竞争和挑战', type: 'E' },
    { id: 47, text: '我喜欢管理项目', type: 'E' },
    { id: 48, text: '我喜欢影响他人', type: 'E' },
    { id: 49, text: '我喜欢承担责任', type: 'E' },
    { id: 50, text: '我喜欢开拓新的业务', type: 'E' },
    // 常规型(C)
    { id: 51, text: '我喜欢按规则办事', type: 'C' },
    { id: 52, text: '我喜欢整理和归类信息', type: 'C' },
    { id: 53, text: '我喜欢处理细节', type: 'C' },
    { id: 54, text: '我喜欢保持秩序', type: 'C' },
    { id: 55, text: '我喜欢遵循程序', type: 'C' },
    { id: 56, text: '我喜欢系统化工作', type: 'C' },
    { id: 57, text: '我喜欢精确的工作', type: 'C' },
    { id: 58, text: '我喜欢检查和核实', type: 'C' },
    { id: 59, text: '我喜欢有条理的环境', type: 'C' },
    { id: 60, text: '我喜欢按计划完成任务', type: 'C' }
  ],
  professional: [
    // 现实型(R) - 30题
    { id: 1, text: '我喜欢使用工具和机械设备', type: 'R' },
    { id: 2, text: '我喜欢户外工作', type: 'R' },
    { id: 3, text: '我喜欢动手组装或修理东西', type: 'R' },
    { id: 4, text: '我喜欢参与体育运动', type: 'R' },
    { id: 5, text: '我喜欢处理具体的事物', type: 'R' },
    { id: 6, text: '我喜欢制作手工艺品', type: 'R' },
    { id: 7, text: '我喜欢操作机器设备', type: 'R' },
    { id: 8, text: '我喜欢从事需要体力的工作', type: 'R' },
    { id: 9, text: '我喜欢解决实际的问题', type: 'R' },
    { id: 10, text: '我喜欢亲手完成项目', type: 'R' },
    { id: 11, text: '我喜欢修理电子设备', type: 'R' },
    { id: 12, text: '我喜欢园艺和种植', type: 'R' },
    { id: 13, text: '我喜欢驾驶或操控交通工具', type: 'R' },
    { id: 14, text: '我喜欢建造或装配物品', type: 'R' },
    { id: 15, text: '我喜欢使用精密仪器', type: 'R' },
    { id: 16, text: '我喜欢野外探险活动', type: 'R' },
    { id: 17, text: '我喜欢处理机械问题', type: 'R' },
    { id: 18, text: '我喜欢制作模型', type: 'R' },
    { id: 19, text: '我喜欢户外运动', type: 'R' },
    { id: 20, text: '我喜欢维护和保养设备', type: 'R' },
    { id: 21, text: '我喜欢木工或金属加工', type: 'R' },
    { id: 22, text: '我喜欢测量和计算', type: 'R' },
    { id: 23, text: '我喜欢制作家具', type: 'R' },
    { id: 24, text: '我喜欢户外探索', type: 'R' },
    { id: 25, text: '我喜欢操作重型设备', type: 'R' },
    { id: 26, text: '我喜欢制作工艺品', type: 'R' },
    { id: 27, text: '我喜欢维修家用电器', type: 'R' },
    { id: 28, text: '我喜欢户外生存技能', type: 'R' },
    { id: 29, text: '我喜欢动手制作礼物', type: 'R' },
    { id: 30, text: '我喜欢修整园林景观', type: 'R' },
    // 研究型(I) - 30题
    { id: 31, text: '我喜欢解决复杂的问题', type: 'I' },
    { id: 32, text: '我喜欢进行科学研究', type: 'I' },
    { id: 33, text: '我喜欢分析数据和信息', type: 'I' },
    { id: 34, text: '我喜欢探索新的理论', type: 'I' },
    { id: 35, text: '我喜欢进行实验', type: 'I' },
    { id: 36, text: '我喜欢思考抽象的概念', type: 'I' },
    { id: 37, text: '我喜欢阅读科技文章', type: 'I' },
    { id: 38, text: '我喜欢独立思考问题', type: 'I' },
    { id: 39, text: '我喜欢研究事物的原理', type: 'I' },
    { id: 40, text: '我喜欢学习新的知识', type: 'I' },
    { id: 41, text: '我喜欢进行数学计算', type: 'I' },
    { id: 42, text: '我喜欢研究科学现象', type: 'I' },
    { id: 43, text: '我喜欢解决技术难题', type: 'I' },
    { id: 44, text: '我喜欢进行逻辑推理', type: 'I' },
    { id: 45, text: '我喜欢研究生物现象', type: 'I' },
    { id: 46, text: '我喜欢探索未知领域', type: 'I' },
    { id: 47, text: '我喜欢分析化学反应', type: 'I' },
    { id: 48, text: '我喜欢研究物理定律', type: 'I' },
    { id: 49, text: '我喜欢进行统计分析', type: 'I' },
    { id: 50, text: '我喜欢研究天文现象', type: 'I' },
    { id: 51, text: '我喜欢探索地质变化', type: 'I' },
    { id: 52, text: '我喜欢研究气象变化', type: 'I' },
    { id: 53, text: '我喜欢分析社会现象', type: 'I' },
    { id: 54, text: '我喜欢研究历史演变', type: 'I' },
    { id: 55, text: '我喜欢探索心理现象', type: 'I' },
    { id: 56, text: '我喜欢研究经济规律', type: 'I' },
    { id: 57, text: '我喜欢分析市场趋势', type: 'I' },
    { id: 58, text: '我喜欢研究文化差异', type: 'I' },
    { id: 59, text: '我喜欢探索哲学问题', type: 'I' },
    { id: 60, text: '我喜欢研究环境变化', type: 'I' },
    // 艺术型(A) - 30题
    { id: 61, text: '我喜欢创作艺术作品', type: 'A' },
    { id: 62, text: '我喜欢表达自己的想法', type: 'A' },
    { id: 63, text: '我喜欢音乐表演', type: 'A' },
    { id: 64, text: '我喜欢设计新的事物', type: 'A' },
    { id: 65, text: '我喜欢写作或创作', type: 'A' },
    { id: 66, text: '我喜欢参与艺术活动', type: 'A' },
    { id: 67, text: '我喜欢尝试新的创意', type: 'A' },
    { id: 68, text: '我喜欢欣赏艺术作品', type: 'A' },
    { id: 69, text: '我喜欢独特的表达方式', type: 'A' },
    { id: 70, text: '我喜欢创新和想象', type: 'A' },
    { id: 71, text: '我喜欢绘画创作', type: 'A' },
    { id: 72, text: '我喜欢舞蹈表演', type: 'A' },
    { id: 73, text: '我喜欢戏剧表演', type: 'A' },
    { id: 74, text: '我喜欢摄影艺术', type: 'A' },
    { id: 75, text: '我喜欢服装设计', type: 'A' },
    { id: 76, text: '我喜欢室内设计', type: 'A' },
    { id: 77, text: '我喜欢景观设计', type: 'A' },
    { id: 78, text: '我喜欢工业设计', type: 'A' },
    { id: 79, text: '我喜欢平面设计', type: 'A' },
    { id: 80, text: '我喜欢多媒体创作', type: 'A' },
    { id: 81, text: '我喜欢创作诗歌', type: 'A' },
    { id: 82, text: '我喜欢创作小说', type: 'A' },
    { id: 83, text: '我喜欢创作剧本', type: 'A' },
    { id: 84, text: '我喜欢创作歌词', type: 'A' },
    { id: 85, text: '我喜欢创作音乐', type: 'A' },
    { id: 86, text: '我喜欢艺术装置', type: 'A' },
    { id: 87, text: '我喜欢艺术策展', type: 'A' },
    { id: 88, text: '我喜欢艺术评论', type: 'A' },
    { id: 89, text: '我喜欢艺术教育', type: 'A' },
    { id: 90, text: '我喜欢艺术修复', type: 'A' },
    // 社会型(S) - 30题
    { id: 91, text: '我喜欢帮助他人解决问题', type: 'S' },
    { id: 92, text: '我喜欢教导和培训他人', type: 'S' },
    { id: 93, text: '我喜欢与人合作', type: 'S' },
    { id: 94, text: '我喜欢参与社交活动', type: 'S' },
    { id: 95, text: '我喜欢关心他人的需求', type: 'S' },
    { id: 96, text: '我喜欢提供建议和指导', type: 'S' },
    { id: 97, text: '我喜欢参与志愿服务', type: 'S' },
    { id: 98, text: '我喜欢照顾他人', type: 'S' },
    { id: 99, text: '我喜欢促进团队合作', type: 'S' },
  ],
};

export function Assessment() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { addResponse, responses, setCurrentAssessment, addResultToHistory, setLatestResult } = useAssessmentStore();

  const assessmentQuestions = questions[type as keyof typeof questions] || [];
  
  useEffect(() => {
    // 设置当前测评信息
    if (type) {
      console.log('设置测评类型:', type);
      setCurrentAssessment({
        type: type as AssessmentType,
        title: `${type === 'simple' ? '简易版' : type === 'standard' ? '标准版' : '专业版'}霍兰德测评`,
        description: '霍兰德职业兴趣测评'
      });
    }
  }, [type, setCurrentAssessment]);

  const handleAnswer = (answer: boolean) => {
    // 添加回答
    const response: QuestionResponse = {
      questionId: assessmentQuestions[currentQuestion].id,
      answer,
      questionType: assessmentQuestions[currentQuestion].type as HollandCode
    };
    
    addResponse(response);
    
    // 如果是最后一个问题，计算结果并跳转
    if (currentQuestion === assessmentQuestions.length - 1) {
      const calculatedResults = calculateResults(
        [...responses, response], 
        type as AssessmentType
      );
      console.log('Assessment页面计算的结果:', calculatedResults);
      console.log('测评类型设置为:', type);
      const finalResult: AssessmentResult = { // Ensure calculatedResults matches AssessmentResult structure
        ...calculatedResults,
        // id and userId are now set within calculateResults
        // responses in AssessmentResult is UserResponse[], ensure calculatedResults provides this or transform here
      };
      addResultToHistory(finalResult);
      // setLatestResult(finalResult); // setLatestResult is available if needed to specifically update only the latest
      navigate('/results');
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            问题 {currentQuestion + 1} / {assessmentQuestions.length}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {assessmentQuestions[currentQuestion]?.text}
          </h2>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            是
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
          >
            否
          </button>
        </div>
      </div>
    </div>
  );
}