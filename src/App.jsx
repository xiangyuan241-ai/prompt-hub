import React, { useState } from 'react';
import { 
  Search, Copy, CheckCircle2, LayoutTemplate, 
  ShoppingCart, Bot, Image as ImageIcon, Megaphone, 
  BookOpen, Sparkles, Menu, X, Command
} from 'lucide-react';

// --- 深度扩充的数据源：基于 Paul J Lipsky 知识库 ---
const promptData = [
  {
    id: 'ecommerce',
    name: '跨境电商与代发货 (Dropshipping)',
    icon: <ShoppingCart size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '生成高权重 eBay 商品标题 (Zik Analytics)',
        description: '利用提取的核心关键词，生成符合 eBay 80个字符限制的 SEO 标题。',
        cn: '我正在销售一款 [具体产品，如：5英尺可折叠木质餐桌]。请帮我生成一个 SEO 优化的 eBay 商品标题，必须包含以下关键词：[关键词1, 关键词2, 关键词3]。请将最重要的描述性词语放在开头，总长度严格限制在80个字符以内，不要使用标点符号。',
        en: 'I am selling a [Specific Product, e.g., 5-foot foldable wooden dining table]. Please help me generate an SEO-optimized eBay product title that must include the following keywords: [Keyword 1, Keyword 2, Keyword 3]. Place the most descriptive words at the beginning. The total length must be strictly under 80 characters without punctuation.'
      },
      {
        title: '重写产品描述提升转化率',
        description: '将速卖通 (AliExpress) 或亚马逊上生硬的参数转化为吸引人的销售文案。',
        cn: '请帮我重写以下产品描述，使其对买家更具吸引力。请突出产品的耐用性、易用性和核心痛点解决方案，采用具有说服力、专业且热情的销售语调，并以要点 (Bullet points) 的形式呈现功能。原描述：\n[在此处粘贴原始产品描述/规格]',
        en: 'Please rewrite the following product description to make it more appealing to buyers. Highlight the product\'s durability, ease of use, and how it solves core pain points. Use a persuasive, professional, and enthusiastic sales tone, and present the features using bullet points. Original description:\n[Paste original specs here]'
      },
      {
        title: '处理物流延误的专业客服回复',
        description: '专业且礼貌地安抚因为恶劣天气或供应商原因未能及时收到货的买家。',
        cn: '一位买家向我发送了这个问题："[在此处输入买家问题]"。由于恶劣天气导致物流延误，物品今天才会发出。请帮我起草一封礼貌、专业的安抚邮件。暂时不要提供物流单号，但要保证尽快发货并表达歉意。',
        en: 'A buyer sent me this question: "[Insert buyer question here]". Due to severe weather causing shipping delays, the item will only be shipped out today. Please draft a polite and professional appeasement email. Do not provide a tracking number yet, but assure them it will ship ASAP and apologize for the inconvenience.'
      },
      {
        title: '分析竞品并提取痛点 (ChatGPT)',
        description: '分析特定产品的常见客户抱怨，并生成应对策略（可用于选品或客服）。',
        cn: '我想开始销售 [产品名称，如：便携式汽车吸尘器]。请帮我分析目前市场上买家对这类产品最常见的抱怨和痛点是什么？并为我列出对应的解决方案（这些解决方案将成为我选择供应商产品的标准）。',
        en: 'I want to start selling [Product Name, e.g., portable car vacuums]. Please analyze the most common complaints and pain points buyers have regarding this type of product in the current market. Also, list corresponding solutions for me (these solutions will become my criteria for choosing a supplier\'s product).'
      }
    ]
  },
  {
    id: 'agents',
    name: 'AI 代理与应用开发 (AI Agents)',
    icon: <Bot size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '构建带支付功能的单页网站 (Deep Agent)',
        description: '指示 AI 代理直接构建可接受付款的落地页。',
        cn: '请为我的 [业务类型，如：AI 代理线下工作坊] 构建一个现代且具有视觉吸引力的单页面网站。需要包含：引人注目的标题、课程大纲部分、讲师介绍，以及集成了 Stripe 支付功能的定价选项卡。网站需要具备响应式设计。',
        en: 'Please build a modern and visually engaging single-page website for my [Business Type, e.g., in-person AI Agent Workshop]. It needs to include: a compelling headline, a course outline section, an instructor bio, and a pricing tab integrated with Stripe for accepting payments. The website must be fully responsive.'
      },
      {
        title: '无需代码开发 SaaS 习惯追踪应用 (Base44)',
        description: '给出详细的功能需求，让 AI 应用构建器生成带数据库的完整 Web App。',
        cn: '构建一个习惯追踪 Web 应用。功能需求：包含用户身份验证(登录/注册)，用户可以添加日常习惯，标记每天是否完成，并能在仪表板上看到他们随时间的进度图表。保持 UI 极简且具有现代感，类似苹果的风格。',
        en: 'Build a habit-tracking web application. Features required: include user authentication (login/signup), allow users to add daily habits, check off whether they completed them each day, and see a progress chart over time on a dashboard. Keep the UI minimalist, modern, and Apple-like.'
      },
      {
        title: '设置自动化线索挖掘工作流 (Zapier)',
        description: '定义自动执行的业务逻辑，供 AI 工作流工具参考。',
        cn: '创建一个自动化流程：每天在谷歌上搜索我所在地区（[地区名]）的[目标业务，如：当地牙医诊所]，检查他们的网站是否针对移动端进行了优化。如果未优化，请提取他们的联系邮箱，并起草一封个性化的推销邮件，说明移动端优化的重要性及我的服务。',
        en: 'Create an automated workflow: Every day, search Google for [Target Business, e.g., local dental clinics] in my area ([Area Name]). Check if their websites are mobile-optimized. If not, extract their contact email and draft a personalized pitch email explaining the importance of mobile optimization and offering my services.'
      },
      {
        title: '定制化 AI 助手系统指令 (Claude Co-work)',
        description: '为特定角色的本地 AI 代理（如邮件处理助手）设定系统级行为准则。',
        cn: '你现在是我的[职位角色，如：首席邮件执行官]。你需要模仿我的语气。你的任务是根据我提供的简短思路，起草专业的回复邮件。在输出内容之前，请先分析并学习该文件夹中我以往的邮件回复风格。不要使用过于正式的商业套话。',
        en: 'You are now my [Role, e.g., Chief Email Executive]. You need to mimic my tone. Your task is to draft professional email replies based on brief ideas I provide. Before outputting, please analyze and learn from my past email reply styles in this folder. Do not use overly formal corporate jargon.'
      }
    ]
  },
  {
    id: 'research',
    name: '深度研究与 NotebookLM',
    icon: <BookOpen size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '提炼核心并生成信息图 (Infographic) 提示词',
        description: '让 NotebookLM 分析资料后，给出适用于图片生成的具体场景排版要求。',
        cn: '总结我上传的这些资料的核心观点，并为我生成一个提示词，用于创建 16x9 尺寸、[风格，如：日本漫画/极简矢量]风格的信息图表（Infographic）。图表需要涵盖以下关键部分：[重点1]、[重点2]。请包含图表上的具体排版文字建议。',
        en: 'Summarize the core concepts of the materials I uploaded, and generate a prompt for me to create a 16x9 [Style, e.g., Japanese manga / clean vector] style infographic. The infographic must cover the following key parts: [Key point 1], [Key point 2]. Please include specific text typography suggestions for the graphic.'
      },
      {
        title: '生成高度风格化的演示文稿 (Slide Deck)',
        description: '覆盖 NotebookLM 默认幻灯片格式，强制其输出特定风格的演示大纲。',
        cn: '根据这些材料，为我整理一个 5-7 页的演示文稿 (Slide Deck)。演示主题是“[主题名称]”。我希望幻灯片是[风格，如：复古动漫/赛博朋克]风格的插图。每一页必须包含：主标题、3个核心要点 (Bullet points) 以及详细的演讲者备注 (Speaker Notes)。',
        en: 'Based on these materials, put together a 5-7 page Slide Deck for me. The presentation topic is "[Topic Name]". I want the slide illustrations to be in a [Style, e.g., retro anime / cyberpunk] style. Each slide must contain: a main title, 3 core bullet points, and detailed Speaker Notes.'
      },
      {
        title: '全网深度行业研究 (Perplexity)',
        description: '利用搜索引擎 AI 进行深度竞品和趋势挖掘。',
        cn: '请进行深度网络搜索，分析目前 YouTube 上最赚钱且适合新手的 5 个细分市场（Niches）。请提供搜索趋势数据、潜在的受众规模，以及每个细分市场的具体内容示例。请引用最新的数据来源。',
        en: 'Please conduct a deep web search and analyze the top 5 most profitable and beginner-friendly niches on YouTube right now. Provide search trend data, potential audience size, and specific content examples for each niche. Please cite the latest data sources.'
      }
    ]
  },
  {
    id: 'social',
    name: '内容创作与批量营销',
    icon: <Megaphone size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '批量生成社交媒体内容矩阵 (Canva Bulk Create)',
        description: '一次性生成数十条结构化帖子数据，供 Canva 批量创建功能读取。',
        cn: '请为一家本地的 [店铺类型，如：自行车店/咖啡馆] 生成 [数量，如：10] 个具有创意的 Instagram 帖子方案，用于吸引顾客进店。请严格以 CSV 表格格式输出，必须包含以下四列：1. Post Name 2. Image Description (供生图使用的英文描述) 3. Headline (图片上的大标题) 4. Copy (带Hashtags的帖子正文)。',
        en: 'Please generate [Number, e.g., 10] creative Instagram post ideas for a local [Shop Type, e.g., bike shop/cafe] to attract customers. Strictly output in a CSV table format. It must include these four columns: 1. Post Name, 2. Image Description (English prompt for image gen), 3. Headline (text overlay on image), 4. Copy (post caption with hashtags).'
      },
      {
        title: '撰写竞品对比测评博客 (Affiliate)',
        description: '生成可以插入亚马逊联盟链接、经过 SEO 优化的对比测评文章。',
        cn: '写一篇经过深度 SEO 优化的博客文章，客观比较这两款产品的优缺点：[产品A] 和 [产品B]。文章结构需包含：引言、核心功能对比、优缺点列表、适用人群分析以及最终推荐。语气要像一位经验丰富的专业评测人员，文章中请留出插入亚马逊联盟链接的占位符。',
        en: 'Write a deeply SEO-optimized blog post objectively comparing the pros and cons of these two products: [Product A] and [Product B]. The structure should include: Introduction, Core Feature Comparison, Pros & Cons List, Target Audience Analysis, and a Final Recommendation. Use the tone of an experienced professional reviewer and leave placeholders for Amazon affiliate links.'
      },
      {
        title: '利用 YouTube 视频提取短视频切片方案 (Zeemo)',
        description: '分析长视频脚本并提取适合短视频的黄金片段。',
        cn: '分析我提供的这段 YouTube 视频文字稿。请从中提取出 3 个最具病毒传播潜力的 60 秒短视频（Shorts）片段。对于每个片段，标出起始时间点、核心金句，并建议在屏幕上应添加什么样风格的 B-roll（空镜）或字幕动画来吸引观众。',
        en: 'Analyze the provided YouTube video transcript. Extract 3 of the most viral-potential 60-second shorts segments. For each segment, indicate the start/end point, the core hook quote, and suggest what style of B-roll or animated captions should be added on screen to retain viewer retention.'
      }
    ]
  },
  {
    id: 'image',
    name: '图像与视频生成',
    icon: <ImageIcon size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '生成电商高级产品摄影图 (Midjourney / Nano Banana)',
        description: '为产品生成具有高级光影和真实质感的展示背景图。',
        cn: '[产品名称，如：高级咖啡袋] 的产品摄影照片，放在质朴的木桌上，温暖的自然光从侧面打来，模糊的背景中有一杯冒着热气的咖啡，高分辨率，8k，极致真实感。 --ar 16:9',
        en: 'Product photography of a [Product Name, e.g., premium coffee bag] placed on a rustic wooden table, warm natural lighting hitting from the side, steam rising from a coffee cup in the blurred background, high resolution, 8k, photorealistic. --ar 16:9'
      },
      {
        title: '模特换装与场景替换 (Image-to-Image)',
        description: '保持服装/产品不变，替换模特特征或所处环境。',
        cn: '将这件 [具体服装，如：红色夏季连衣裙] 穿在一位27岁、深色头发的女性模特身上。背景是时尚T台，专业的影棚灯光，商业杂志摄影风格，细节极其丰富。',
        en: 'Put this [Specific Clothing, e.g., red summer dress] on a 27-year-old female model with dark hair. The setting is on a fashion runway, professional studio lighting, editorial photography, highly detailed.'
      },
      {
        title: '将单张图片转化为连贯视频广告 (Veo / Runway)',
        description: '通过图像到视频模型，为静态产品图增加物理动态效果。',
        cn: '电影级平移运镜，拍摄 [描述图片中产品，如：徒步小径上的这款水壶]。摄像机缓慢向前推进，自然阳光透过树叶缝隙洒落，空气中灰尘微粒在光线中飞舞，极度真实，4k分辨率。',
        en: 'Cinematic video panning shot of [Describe the product in the image, e.g., this water bottle on the hiking trail]. The camera slowly pushes forward, natural sunlight filtering through the trees, dust particles dancing in the air, highly realistic, 4k resolution.'
      }
    ]
  }
];

const App = () => {
  const [activeCategory, setActiveCategory] = useState(promptData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalLang, setGlobalLang] = useState('cn');

  // 终极防拦截复制方案
  const handleCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try { textArea.setSelectionRange(0, 99999); } catch (e) {}

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setToast(globalLang === 'cn' ? '已成功拷贝！' : 'Successfully Copied!');
        setTimeout(() => setToast(null), 2500);
      }
    } catch (err) {
      console.error('Copy Error:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const getFilteredPrompts = () => {
    let filtered = [];
    if (searchQuery.trim() === '') {
      const category = promptData.find(c => c.id === activeCategory);
      return category ? category.prompts : [];
    }

    promptData.forEach(category => {
      const matchedPrompts = category.prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.cn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filtered = [...filtered, ...matchedPrompts];
    });
    return filtered;
  };

  const currentPrompts = getFilteredPrompts();

  // 苹果风格高亮占位符：采用深色模式下的高亮青蓝色 (#5AC8FA)，提供极佳对比度
  const highlightPlaceholders = (text) => {
    return text.split(/(\[.*?\])/g).map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} className="text-[#5AC8FA] bg-[#5AC8FA]/15 px-1.5 py-0.5 rounded-md font-medium mx-0.5 border border-[#5AC8FA]/20">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      
      {/* 移动端菜单遮罩 (iOS Style Blur) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 侧边栏 (macOS Sidebar Style) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#F5F5F7]/95 backdrop-blur-xl border-r border-gray-200/60 transform transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
        md:relative md:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="pt-10 pb-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Command size={22} className="text-[#1D1D1F]" strokeWidth={1.5} />
            <h1 className="text-[19px] font-semibold tracking-tight text-[#1D1D1F]">
              Prompt Hub
            </h1>
          </div>
          <button className="md:hidden text-gray-500 hover:bg-gray-200/50 p-1.5 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2 ml-3 mt-4">
            Library
          </p>
          <nav className="space-y-0.5">
            {promptData.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchQuery('');
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-[10px] text-[14px] transition-all duration-200
                  ${activeCategory === category.id && searchQuery === ''
                    ? 'bg-gray-200/70 text-[#1D1D1F] font-medium' 
                    : 'text-gray-600 hover:bg-gray-200/40 font-normal'}
                `}
              >
                <span className={`${activeCategory === category.id && searchQuery === '' ? 'text-[#0071E3]' : 'text-gray-500'}`}>
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 底部信息块 */}
        <div className="p-4 mb-2 mx-3">
          <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-200/50 transition-colors cursor-default">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center shadow-inner overflow-hidden border border-white/50">
              <span className="text-gray-600 text-xs font-semibold">PH</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-[#1D1D1F] leading-tight">Prompt Hub</p>
              <p className="text-gray-500 text-[11px]">Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white rounded-l-[2.5rem] shadow-[-10px_0_30px_rgba(0,0,0,0.03)] border-l border-white/50">
        
        {/* 顶部搜索栏 & 分段控制器 (iOS Header Style) */}
        <header className="bg-white/80 backdrop-blur-2xl z-10 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 sticky top-0">
          <div className="flex items-center flex-1 max-w-2xl">
            <button 
              className="md:hidden mr-4 text-gray-500 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search prompts, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 bg-gray-100/80 border-transparent rounded-full text-[15px] placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0071E3]/15 focus:border-[#0071E3] transition-all"
              />
            </div>
          </div>

          {/* 苹果分段控制器 (Segmented Control) */}
          <div className="hidden sm:flex bg-gray-100/80 p-1 rounded-full items-center self-start sm:self-auto">
            <button
              onClick={() => setGlobalLang('cn')}
              className={`px-5 py-1.5 text-[13px] rounded-full transition-all duration-300 ${globalLang === 'cn' ? 'bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08)]' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              中文
            </button>
            <button
              onClick={() => setGlobalLang('en')}
              className={`px-5 py-1.5 text-[13px] rounded-full transition-all duration-300 ${globalLang === 'en' ? 'bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08)]' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              English
            </button>
          </div>
        </header>

        {/* 提示词列表 */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 md:py-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto pb-24">
            
            <div className="mb-10 pl-2">
              <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1D1D1F] tracking-tight">
                {searchQuery ? 'Search Results' : promptData.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-500 mt-1 text-[15px]">
                {searchQuery 
                  ? `Found ${currentPrompts.length} prompts matching "${searchQuery}"` 
                  : 'Select your preferred language to generate the perfect context for your AI models.'}
              </p>
              
              {/* 移动端语言提示 */}
              <div className="sm:hidden mt-4 inline-flex bg-gray-100/80 p-1 rounded-full items-center">
                <button onClick={() => setGlobalLang('cn')} className={`px-4 py-1 text-xs rounded-full ${globalLang === 'cn' ? 'bg-white shadow-sm font-semibold' : 'text-gray-500'}`}>中文</button>
                <button onClick={() => setGlobalLang('en')} className={`px-4 py-1 text-xs rounded-full ${globalLang === 'en' ? 'bg-white shadow-sm font-semibold' : 'text-gray-500'}`}>EN</button>
              </div>
            </div>

            {currentPrompts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {currentPrompts.map((prompt, index) => (
                  <div 
                    key={index} 
                    className="bg-[#fbfbfd] rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden"
                  >
                    <div className="p-7 sm:p-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div className="flex-1">
                          <h3 className="text-[19px] font-semibold text-[#1D1D1F] tracking-tight mb-1.5">
                            {prompt.title}
                          </h3>
                          <p className="text-[15px] text-gray-500 leading-relaxed">{prompt.description}</p>
                        </div>
                        
                        {/* 超大醒目的蓝色复制按钮，位于白色背景右侧 */}
                        <button
                          onClick={() => handleCopy(globalLang === 'cn' ? prompt.cn : prompt.en)}
                          className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full transition-all duration-200 active:scale-95 shadow-[0_4px_14px_rgba(0,113,227,0.3)]"
                          title="Copy Prompt"
                        >
                          <Copy size={16} strokeWidth={2.5} />
                          <span className="text-[14px] font-semibold tracking-wide">
                            {globalLang === 'cn' ? '一键拷贝' : 'Copy Prompt'}
                          </span>
                        </button>
                      </div>
                      
                      {/* macOS 风格终端代码区 */}
                      <div className="bg-[#1D1D1F] rounded-2xl overflow-hidden shadow-lg border border-gray-800/60 mt-2">
                        {/* 顶部控制条 */}
                        <div className="bg-[#2D2D2F]/50 px-5 py-3 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10"></div>
                          </div>
                          
                          {/* 装饰性文字 */}
                          <div className="text-[11px] text-gray-500 font-medium tracking-widest uppercase">
                            Terminal
                          </div>
                        </div>
                        {/* 正文内容 */}
                        <div className="p-6 font-mono text-[14px] leading-relaxed text-[#F5F5F7] whitespace-pre-wrap">
                           {globalLang === 'cn' 
                              ? highlightPlaceholders(prompt.cn)
                              : highlightPlaceholders(prompt.en)
                           }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-[#fbfbfd] rounded-[2.5rem] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                   <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1D1D1F]">No Prompts Found</h3>
                <p className="text-gray-500 mt-2 text-[14px]">Try searching with different keywords.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 动态岛风格的 Toast 提示 (Dynamic Island Style) */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-black/85 backdrop-blur-xl text-white px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10 flex items-center space-x-2.5">
            <CheckCircle2 size={18} className="text-[#34C759]" strokeWidth={2.5} />
            <span className="font-medium text-[14px] tracking-wide">{toast}</span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default App;
