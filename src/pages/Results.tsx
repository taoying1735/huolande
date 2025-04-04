import { useEffect, useState, useRef } from 'react';
import { useAssessmentStore } from '../store';
import { hollandTraits, getTopTwoHollandCodes, getCombinationAnalysis } from '../utils/hollandAnalysis';
import { HollandCode, HollandAnalysis } from '../types';
import html2canvas from 'html2canvas';

export function Results() {
  const { results } = useAssessmentStore();
  const [analysis, setAnalysis] = useState<HollandAnalysis | null>(null);
  const [error, setError] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (results) {
        const combination = getTopTwoHollandCodes(results.scores);
        const analysisResult = getCombinationAnalysis(combination);
        setAnalysis(analysisResult);
      }
    } catch (err) {
      console.error('分析结果时出错:', err);
      setError(true);
    }
  }, [results]);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    
    try {
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
      loadingToast.textContent = '正在生成报告...';
      document.body.appendChild(loadingToast);
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = image;
      link.download = `霍兰德职业兴趣测评报告_${results.hollandCode}_${new Date().toLocaleDateString()}.png`;
      link.click();
      
      document.body.removeChild(loadingToast);
      
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      successToast.textContent = '报告已下载';
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 3000);
    } catch (err) {
      console.error('下载报告时出错:', err);
      alert('下载报告时出错，请重试');
    }
  };

  const handleShare = async (platform: 'wechat' | 'weibo' | 'copy') => {
    const shareTitle = `我的霍兰德职业兴趣测评结果: ${results.hollandCode}`;
    const shareUrl = window.location.href;
    const shareDesc = `${analysis?.description.slice(0, 50)}...`;
    
    switch (platform) {
      case 'wechat':
        setShowShareOptions(false);
        alert('请截图保存，然后在微信中分享');
        break;
      case 'weibo':
        const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&pic=&appkey=`;
        window.open(weiboUrl, '_blank');
        setShowShareOptions(false);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('链接已复制到剪贴板');
        } catch (err) {
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('链接已复制到剪贴板');
        }
        setShowShareOptions(false);
        break;
    }
  };

  if (!results) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-xl mb-4">出错了</div>
        <div className="text-sm text-gray-500 mb-4">
          应用遇到了问题，请尝试刷新页面
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          刷新页面
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">分析结果中...</div>
      </div>
    );
  }

  const isStandard = results.assessmentType === 'standard';
  const isProfessional = results.assessmentType === 'professional';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div ref={reportRef} className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          您的霍兰德职业兴趣测评结果
        </h1>

        {isProfessional && (
          <div className="mb-8 sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-3">包含功能:</h3>
            <div className="flex flex-wrap gap-2">
              <a href="#personality" className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-full">
                全面职业性格测评
              </a>
              <a href="#analysis" className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-full">
                详细个性特征分析
              </a>
              <a href="#report" className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-full">
                职业倾向深度报告
              </a>
              <a href="#suggestion" className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-full">
                具体职业发展建议
              </a>
              <a href="#path" className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-full">
                发展路径推荐
              </a>
            </div>
          </div>
        )}

        <div id="personality" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">霍兰德代码</h2>
          <div className="text-4xl font-bold text-indigo-600">
            {results.hollandCode || '未知'}
          </div>
          
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <p className="font-medium mb-2">您的霍兰德代码解释：</p>
            <div className="space-y-2">
              {results.hollandCode.includes('R') && (
                <p><span className="font-semibold">R (现实型):</span> 喜欢具体、实际的工作，善于使用工具和机械设备。</p>
              )}
              {results.hollandCode.includes('I') && (
                <p><span className="font-semibold">I (研究型):</span> 喜欢分析和解决复杂问题，善于思考和研究。</p>
              )}
              {results.hollandCode.includes('A') && (
                <p><span className="font-semibold">A (艺术型):</span> 具有创造力和想象力，喜欢表达自我和创新。</p>
              )}
              {results.hollandCode.includes('S') && (
                <p><span className="font-semibold">S (社会型):</span> 喜欢与人交往和帮助他人，善于沟通和合作。</p>
              )}
              {results.hollandCode.includes('E') && (
                <p><span className="font-semibold">E (企业型):</span> 具有领导能力和说服力，喜欢组织和管理。</p>
              )}
              {results.hollandCode.includes('C') && (
                <p><span className="font-semibold">C (常规型):</span> 喜欢有序和规范的工作，善于处理细节和数据。</p>
              )}
            </div>
          </div>
        </div>

        <div id="analysis" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">个性特征分析</h2>
          <div className="space-y-4">
            <p className="text-lg">{analysis.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">推荐职业</h2>
          <div className="grid grid-cols-2 gap-4">
            {analysis.suggestion && analysis.suggestion.careers && analysis.suggestion.careers.length > 0 ? (
              analysis.suggestion.careers.map((career, index) => (
                <div key={index} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-lg font-medium text-gray-900">{career}</div>
                </div>
              ))
            ) : (
              <>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-lg font-medium text-gray-900">项目经理</div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-lg font-medium text-gray-900">创新顾问</div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-lg font-medium text-gray-900">自由职业者</div>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="text-lg font-medium text-gray-900">创业者</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">职业倾向</h2>
          <div className="p-5 bg-blue-50 rounded-lg">
            <p className="text-gray-800 mb-4">根据您的霍兰德代码，您可能具有以下职业倾向：</p>
            <div className="space-y-3">
              {results.hollandCode.charAt(0) === 'R' && (
                <p>您倾向于从事需要动手能力和技术技能的工作，喜欢解决具体问题。</p>
              )}
              {results.hollandCode.charAt(0) === 'I' && (
                <p>您倾向于从事需要分析思考和研究的工作，喜欢解决复杂问题。</p>
              )}
              {results.hollandCode.charAt(0) === 'A' && (
                <p>您倾向于从事需要创造力和艺术表达的工作，喜欢创新和自我表达。</p>
              )}
              {results.hollandCode.charAt(0) === 'S' && (
                <p>您倾向于从事需要人际交往和帮助他人的工作，喜欢团队合作。</p>
              )}
              {results.hollandCode.charAt(0) === 'E' && (
                <p>您倾向于从事需要领导能力和决策能力的工作，喜欢管理和影响他人。</p>
              )}
              {results.hollandCode.charAt(0) === 'C' && (
                <p>您倾向于从事需要条理性和细节关注的工作，喜欢有序和规范。</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">适合的工作环境</h2>
          <div className="p-5 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.hollandCode.charAt(0) === 'R' && (
                <>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>技术导向的工作环境</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>允许独立工作的环境</p>
                  </div>
                </>
              )}
              {results.hollandCode.charAt(0) === 'I' && (
                <>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>研究机构或实验室</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>允许深入思考的环境</p>
                  </div>
                </>
              )}
              {results.hollandCode.charAt(0) === 'A' && (
                <>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>创意工作室或设计部门</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>鼓励创新的环境</p>
                  </div>
                </>
              )}
              {results.hollandCode.charAt(0) === 'S' && (
                <>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>教育或社会服务机构</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>团队合作的环境</p>
                  </div>
                </>
              )}
              {results.hollandCode.charAt(0) === 'E' && (
                <>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>商业或管理环境</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>竞争性的工作氛围</p>
                  </div>
                </>
              )}
              {results.hollandCode.charAt(0) === 'C' && (
                <>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>结构化的办公环境</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>有明确规则和程序的组织</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">发展建议</h2>
          <div className="p-5 bg-green-50 rounded-lg">
            <p className="text-gray-800 mb-4">根据您的霍兰德代码，以下是一些职业发展建议：</p>
            <div className="space-y-3">
              {analysis.suggestion?.development ? (
                analysis.suggestion.development.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-1 text-green-600 font-bold">✓</div>
                    <p>{tip}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-600 font-bold">✓</div>
                    <p>持续学习和提升专业技能，关注行业发展趋势。</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-600 font-bold">✓</div>
                    <p>寻找能够发挥您优势的工作机会，避免与您的兴趣不符的职业。</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-600 font-bold">✓</div>
                    <p>与行业内的专业人士建立联系，扩展您的职业网络。</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {(isStandard || isProfessional) && analysis.strengths && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">个人优势与潜能</h2>
              <div className="p-5 bg-indigo-50 rounded-lg">
                <p className="text-gray-800 mb-4">基于您的霍兰德代码 <span className="font-semibold">{results.hollandCode}</span>，您的核心优势可能包括：</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-1 text-indigo-600">•</div>
                      <p>{strength}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 italic">发挥这些优势，将助您在职业发展中脱颖而出。</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">最适工作环境</h2>
              <div className="p-5 border border-gray-200 rounded-lg">
                <p className="text-gray-800 mb-4">您适合在以下环境中工作：</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.environments && analysis.environments.length > 0 ? (
                    analysis.environments.map((environment, index) => (
                      <div key={index} className="bg-white p-3 rounded shadow-sm">
                        <p>{environment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p>创新开放的工作环境</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">团队协作风格</h2>
              <div className="p-5 bg-blue-50 rounded-lg">
                <p className="text-gray-800">{analysis.teamworkStyle || "您在团队中倾向于成为思想贡献者和问题解决者，善于从不同角度思考问题。"}</p>
              </div>
            </div>
          </>
        )}

        {isProfessional && analysis.careerPath && (
          <div id="path" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">长期职业发展路径</h2>
            <div className="space-y-5">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg">
                <h3 className="font-medium text-lg text-blue-800 mb-2">入门阶段</h3>
                <p className="text-gray-700">{analysis.careerPath.entry || "可从助理或初级专业人员开始，积累行业经验和专业知识。"}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg">
                <h3 className="font-medium text-lg text-indigo-800 mb-2">成长阶段</h3>
                <p className="text-gray-700">{analysis.careerPath.growth || "随着经验积累，可向专业领域深入发展，或开始承担团队领导职责。"}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg">
                <h3 className="font-medium text-lg text-purple-800 mb-2">成熟阶段</h3>
                <p className="text-gray-700">{analysis.careerPath.established || "可成为领域专家或高级管理者，或选择创业、咨询等更具自主性的职业道路。"}</p>
              </div>
            </div>
          </div>
        )}

        {isProfessional && (
          <>
            <div id="report" className="mb-8">
              <h2 className="text-xl font-semibold mb-4">职业倾向深度报告</h2>
              <div className="p-5 bg-yellow-50 rounded-lg">
                <p className="text-gray-800 mb-4">基于您的霍兰德代码 <span className="font-semibold">{results.hollandCode}</span>，我们对您的职业倾向进行了深入分析：</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg text-yellow-800 mb-2">主导特质</h3>
                    <p className="text-gray-700">
                      {results.hollandCode.charAt(0) === 'R' && "您的主导特质是现实型(R)，表现为喜欢具体、实际的工作，善于使用工具和机械设备，注重实际成果。"}
                      {results.hollandCode.charAt(0) === 'I' && "您的主导特质是研究型(I)，表现为喜欢分析和解决复杂问题，善于思考和研究，注重知识和理论。"}
                      {results.hollandCode.charAt(0) === 'A' && "您的主导特质是艺术型(A)，表现为具有创造力和想象力，喜欢表达自我，注重美感和创新。"}
                      {results.hollandCode.charAt(0) === 'S' && "您的主导特质是社会型(S)，表现为喜欢与人交往和帮助他人，善于沟通和合作，注重人际关系。"}
                      {results.hollandCode.charAt(0) === 'E' && "您的主导特质是企业型(E)，表现为具有领导能力和说服力，喜欢组织和管理，注重成就和影响力。"}
                      {results.hollandCode.charAt(0) === 'C' && "您的主导特质是常规型(C)，表现为喜欢有序和规范的工作，善于处理细节和数据，注重精确和可靠。"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg text-yellow-800 mb-2">辅助特质</h3>
                    <p className="text-gray-700">
                      {results.hollandCode.charAt(1) === 'R' && "您的辅助特质是现实型(R)，增强了您处理实际问题的能力，使您在工作中更加注重实用性和效率。"}
                      {results.hollandCode.charAt(1) === 'I' && "您的辅助特质是研究型(I)，增强了您的分析能力，使您在工作中更加注重逻辑思考和问题解决。"}
                      {results.hollandCode.charAt(1) === 'A' && "您的辅助特质是艺术型(A)，增强了您的创造力，使您在工作中更加注重创新和个性化表达。"}
                      {results.hollandCode.charAt(1) === 'S' && "您的辅助特质是社会型(S)，增强了您的人际交往能力，使您在工作中更加注重团队合作和人际关系。"}
                      {results.hollandCode.charAt(1) === 'E' && "您的辅助特质是企业型(E)，增强了您的领导能力，使您在工作中更加注重目标达成和影响力。"}
                      {results.hollandCode.charAt(1) === 'C' && "您的辅助特质是常规型(C)，增强了您的组织能力，使您在工作中更加注重秩序和细节。"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg text-yellow-800 mb-2">特质组合优势</h3>
                    <p className="text-gray-700">
                      {analysis.description}
                      这种组合使您在职业发展中具有独特的竞争优势，能够在特定领域脱颖而出。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">职业适应性分析</h2>
              <div className="p-5 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg text-blue-800 mb-2">高适应性职业领域</h3>
                    <div className="space-y-2">
                      {analysis.suggestion?.fields ? (
                        analysis.suggestion.fields.map((field, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-1 text-green-600">✓</div>
                            <p>{field}</p>
                          </div>
                        ))
                      ) : (
                        <p>数据加载中...</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg text-red-800 mb-2">低适应性职业领域</h3>
                    <div className="space-y-2">
                      {results.hollandCode.charAt(0) === 'R' && (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>需要高度社交互动的服务行业</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>缺乏结构化的创意工作</p>
                          </div>
                        </>
                      )}
                      {results.hollandCode.charAt(0) === 'I' && (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>高度重复性的常规工作</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>需要频繁社交的销售岗位</p>
                          </div>
                        </>
                      )}
                      {results.hollandCode.charAt(0) === 'A' && (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>高度结构化的数据处理工作</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>需要严格遵循规程的技术岗位</p>
                          </div>
                        </>
                      )}
                      {results.hollandCode.charAt(0) === 'S' && (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>长期独立工作的技术岗位</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>高度竞争性的销售环境</p>
                          </div>
                        </>
                      )}
                      {results.hollandCode.charAt(0) === 'E' && (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>需要长期独立研究的学术岗位</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>高度精细的技术操作工作</p>
                          </div>
                        </>
                      )}
                      {results.hollandCode.charAt(0) === 'C' && (
                        <>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>需要高度创新的艺术工作</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-1 text-red-600">✗</div>
                            <p>缺乏明确结构的创业环境</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">职业成功要素</h2>
              <div className="p-5 bg-purple-50 rounded-lg">
                <p className="text-gray-800 mb-4">根据您的霍兰德代码，以下是您在职业发展中应重点关注的成功要素：</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg text-purple-800 mb-2">核心能力</h3>
                    <div className="space-y-2">
                      {results.hollandCode.includes('R') && (
                        <div className="flex items-start gap-2">
                          <div className="mt-1 text-purple-600 font-bold">•</div>
                          <p>技术操作与实践能力</p>
                        </div>
                      )}
                      {results.hollandCode.includes('I') && (
                        <div className="flex items-start gap-2">
                          <div className="mt-1 text-purple-600 font-bold">•</div>
                          <p>分析思考与问题解决能力</p>
                        </div>
                      )}
                      {results.hollandCode.includes('A') && (
                        <div className="flex items-start gap-2">
                          <div className="mt-1 text-purple-600 font-bold">•</div>
                          <p>创造力与艺术表达能力</p>
                        </div>
                      )}
                      {results.hollandCode.includes('S') && (
                        <div className="flex items-start gap-2">
                          <div className="mt-1 text-purple-600 font-bold">•</div>
                          <p>人际沟通与协作能力</p>
                        </div>
                      )}
                      {results.hollandCode.includes('E') && (
                        <div className="flex items-start gap-2">
                          <div className="mt-1 text-purple-600 font-bold">•</div>
                          <p>领导力与决策能力</p>
                        </div>
                      )}
                      {results.hollandCode.includes('C') && (
                        <div className="flex items-start gap-2">
                          <div className="mt-1 text-purple-600 font-bold">•</div>
                          <p>组织规划与执行能力</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-lg text-purple-800 mb-2">发展重点</h3>
                    <div className="space-y-2">
                      {analysis.suggestion?.development ? (
                        analysis.suggestion.development.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-1 text-purple-600 font-bold">•</div>
                            <p>{tip}</p>
                          </div>
                        ))
                      ) : (
                        <p>持续学习和提升专业技能，关注行业发展趋势。</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-4 items-center mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={handleDownloadReport}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            下载报告
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              分享给朋友
            </button>
            
            {showShareOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button 
                    onClick={() => handleShare('wechat')} 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-green-500">●</span> 微信分享
                  </button>
                  <button 
                    onClick={() => handleShare('weibo')} 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-red-500">●</span> 微博分享
                  </button>
                  <button 
                    onClick={() => handleShare('copy')} 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-blue-500">●</span> 复制链接
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <a
              href="https://ko-fi.com/boy1735"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              请开发者喝咖啡
            </a>
          </div>
          
          <a 
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            返回首页
          </a>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 霍兰德职业兴趣测评 | 本测评仅供参考，不构成职业指导建议</p>
        </div>
      </div>
    </div>
  );
}