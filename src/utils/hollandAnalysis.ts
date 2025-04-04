import { HollandCode } from '../types';

type PersonalityTrait = {
  title: string;
  description: string;
  characteristics: string[];
};

type CareerSuggestion = {
  fields: string[];
  careers: string[];
  development: string[];
};

export const hollandTraits: Record<HollandCode, PersonalityTrait> = {
  R: {
    title: '实际型 (Realistic)',
    description: '偏好于操作工具、机器，喜欢具体而实际的工作',
    characteristics: [
      '擅长使用工具和机械设备',
      '喜欢动手操作和实践',
      '注重实际效果',
      '做事踏实认真'
    ]
  },
  I: {
    title: '研究型 (Investigative)',
    description: '偏好于思考和研究，喜欢分析问题和探索新知识',
    characteristics: [
      '具有较强的分析能力',
      '喜欢探索和研究',
      '追求知识的深度',
      '善于独立思考'
    ]
  },
  A: {
    title: '艺术型 (Artistic)',
    description: '偏好于创造性的艺术表现，追求独特和创新',
    characteristics: [
      '富有创造力和想象力',
      '追求艺术表现',
      '重视个性化表达',
      '感性且富有同理心'
    ]
  },
  S: {
    title: '社会型 (Social)',
    description: '偏好于与人交往，热衷于帮助、教导他人',
    characteristics: [
      '善于人际交往',
      '乐于助人',
      '有教导他人的意愿',
      '富有同情心'
    ]
  },
  E: {
    title: '企业型 (Enterprising)',
    description: '偏好于管理和说服他人，具有领导才能',
    characteristics: [
      '具有领导能力',
      '善于组织管理',
      '有说服力',
      '追求成就感'
    ]
  },
  C: {
    title: '常规型 (Conventional)',
    description: '偏好于按规则办事，善于处理数据和细节',
    characteristics: [
      '做事有条理',
      '注重细节',
      '遵守规则',
      '处事稳重'
    ]
  }
};

type HollandCodeCombination = {
  description: string;
  suggestion: CareerSuggestion;
};

export const hollandCombinations: Record<string, HollandCodeCombination> = {
  'RI': {
    description: '您具有实践能力和分析思维的结合，适合从事需要动手操作且要求一定技术分析的工作。',
    suggestion: {
      fields: ['工程技术', '研发制造', '质量控制'],
      careers: ['机械工程师', '电子工程师', '质量检测员', '技术研究员'],
      development: [
        '建议进一步提升专业技术能力',
        '可以考虑参与更多实践性项目',
        '关注新技术发展动态'
      ]
    }
  },
  'IA': {
    description: '您兼具研究精神和创造力，适合从事需要创新思维和专业知识的工作。',
    suggestion: {
      fields: ['科研创新', '产品设计', '教育培训'],
      careers: ['研究员', '产品设计师', '教育工作者', '艺术治疗师'],
      development: [
        '可以尝试跨领域学习和研究',
        '培养创新思维能力',
        '建立专业知识体系'
      ]
    }
  },
  'AS': {
    description: '您既有艺术天赋又善于与人交往，适合从事创意性和服务性的工作。',
    suggestion: {
      fields: ['艺术教育', '文化传播', '设计服务'],
      careers: ['艺术教师', '文化工作者', '平面设计师', '活动策划师'],
      development: [
        '可以尝试艺术教育方向',
        '培养艺术表达能力',
        '拓展人际交往技巧'
      ]
    }
  },
  'SE': {
    description: '您具有良好的社交能力和领导才能，适合从事需要团队合作和管理的工作。',
    suggestion: {
      fields: ['人力资源', '市场营销', '教育管理'],
      careers: ['人力资源经理', '市场经理', '培训讲师', '社工主管'],
      development: [
        '提升团队管理能力',
        '培养领导才能',
        '加强沟通技巧'
      ]
    }
  },
  'EC': {
    description: '您既有企业家精神又善于处理细节，适合从事商业管理类工作。',
    suggestion: {
      fields: ['企业管理', '金融投资', '商务咨询'],
      careers: ['企业经理', '金融分析师', '商务顾问', '项目经理'],
      development: [
        '加强商业分析能力',
        '提升决策判断能力',
        '注重细节管理'
      ]
    }
  },
  'CR': {
    description: '您既重视规则又具有实践能力，适合从事需要严谨和技术的工作。',
    suggestion: {
      fields: ['技术管理', '品质控制', '数据分析'],
      careers: ['技术主管', '质量经理', '数据分析师', '系统管理员'],
      development: [
        '提升专业技术水平',
        '加强规范化管理能力',
        '培养问题解决能力'
      ]
    }
  }
};

// 获取两个最高分的Holland代码组合
export const getTopTwoHollandCodes = (scores: Record<HollandCode, number>): string => {
  const sortedCodes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([code]) => code);
  return sortedCodes.join('');
};

// 获取组合分析结果
export const getCombinationAnalysis = (combination: string) => {
  // 确保代码组合存在于预设中
  const normalizedCombination = combination in hollandCombinations ? 
    combination : 
    combination.split('').reverse().join('');
  
  // 获取基本分析结果
  const baseAnalysis = hollandCombinations[normalizedCombination] || {
    description: '您的职业兴趣组合显示了多元化的能力和潜力。',
    suggestion: {
      fields: ['多元化领域', '跨学科领域', '创新型行业'],
      careers: ['项目经理', '创新顾问', '自由职业者', '创业者'],
      development: [
        '发挥多元化优势',
        '寻找跨领域机会',
        '培养适应性和灵活性'
      ]
    }
  };
  
  // 根据霍兰德代码组合设置特定的强项
  let strengths = [];
  let environments = [];
  let teamworkStyle = "";
  let careerPath = { entry: "", growth: "", established: "" };
  
  // 根据霍兰德代码组合设置特定的强项
  switch(normalizedCombination) {
    case 'RI':
      strengths = [
        "擅长解决实际技术问题",
        "善于分析机械和工程系统",
        "注重实践和理论相结合",
        "良好的逻辑思维能力",
        "对细节的关注和精确性"
      ];
      environments = [
        "技术导向的工作环境",
        "研发实验室",
        "工程设计部门",
        "质量控制部门",
        "技术支持团队"
      ];
      teamworkStyle = "您在团队中倾向于成为技术专家和问题解决者，善于处理具体实际的挑战。您注重数据和事实，能够提供基于实践经验的解决方案。";
      break;
    case 'IA':
      strengths = [
        "创新思维能力强",
        "善于分析复杂问题",
        "具有艺术和科学的双重思维",
        "独立研究能力出色",
        "对新概念有敏锐的洞察力"
      ];
      environments = [
        "研究机构",
        "创意工作室",
        "高等教育机构",
        "科技创新企业",
        "独立研究环境"
      ];
      teamworkStyle = "您在团队中倾向于成为创新思想的提供者，善于从不同角度思考问题，并提出独特的解决方案。您喜欢有一定自主空间的协作环境。";
      break;
    case 'IC':
      strengths = [
        "数据分析能力强",
        "系统性思维出色",
        "善于解决复杂问题",
        "注重精确性和细节",
        "良好的组织和规划能力"
      ];
      environments = [
        "研究机构",
        "数据分析部门",
        "IT企业",
        "金融机构",
        "科研实验室"
      ];
      teamworkStyle = "您在团队中倾向于成为数据分析专家，善于处理复杂信息并提供基于事实的见解。您注重逻辑和系统性，能够帮助团队做出更明智的决策。";
      break;
    // 添加更多组合的数据...
    default:
      strengths = [
        "擅长解决实际问题",
        "善于分析复杂信息",
        "创新思维能力强",
        "优秀的沟通能力",
        "良好的组织和管理技能"
      ];
      environments = [
        "创新开放的工作环境",
        "团队协作的项目制工作",
        "允许自主决策的环境",
        "有明确结构的组织",
        "提供持续学习机会的单位"
      ];
      teamworkStyle = "您在团队中倾向于成为思想贡献者和问题解决者，善于从不同角度思考问题，并提出创新性解决方案。您注重团队协作，但同时也能独立完成任务。";
  }
  
  // 确保 careerPath 对象始终存在
  careerPath = {
    entry: "可从助理或初级专业人员开始，积累行业经验和专业知识。",
    growth: "随着经验积累，可向专业领域深入发展，或开始承担团队领导职责。",
    established: "可成为领域专家或高级管理者，或选择创业、咨询等更具自主性的职业道路。"
  };
  
  // 确保所有属性都有默认值，特别是 careers 数组
  return {
    ...baseAnalysis,
    strengths: strengths || [],
    environments: environments || [],
    teamworkStyle: teamworkStyle || "您在团队中倾向于成为思想贡献者和问题解决者，善于从不同角度思考问题。",
    careerPath: careerPath || {
      entry: "可从助理或初级专业人员开始，积累行业经验和专业知识。",
      growth: "随着经验积累，可向专业领域深入发展，或开始承担团队领导职责。",
      established: "可成为领域专家或高级管理者，或选择创业、咨询等更具自主性的职业道路。"
    },
    suggestion: {
      fields: baseAnalysis.suggestion?.fields || ['多元化领域', '跨学科领域', '创新型行业'],
      careers: baseAnalysis.suggestion?.careers || ['项目经理', '创新顾问', '自由职业者', '创业者'],
      development: baseAnalysis.suggestion?.development || [
        '发挥多元化优势',
        '寻找跨领域机会',
        '培养适应性和灵活性'
      ]
    }
  };
};