import React, { useState, useEffect } from 'react';
import { 
  Search, Copy, CheckCircle2, ShoppingCart, Bot, 
  Image as ImageIcon, Megaphone, BookOpen, Sparkles, 
  Menu, X, Command, Code, Headphones, MessageSquareText, 
  Edit3, Star, Layers, Zap
} from 'lucide-react';

// --- 终极提炼数据源：100% 覆盖 Paul J Lipsky 知识库 ---
const promptData = [
  {
    id: 'ecommerce',
    name: '🛒 选品与代发货 (Dropshipping)',
    icon: <ShoppingCart size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '分析高销量竞品痛点 (选品利器)',
        description: '在决定卖某款产品前，让 AI 分析市场抱怨，寻找产品差异化卖点。',
        tool: 'ChatGPT / Gemini',
        cn: '我想开始在 eBay/Shopify 上销售 [产品名称，如：便携式汽车吸尘器]。请帮我深度分析目前市场上买家对这类产品最常见的 5 个抱怨和核心痛点。并针对每一个痛点，列出我在寻找供应商时应该关注的产品功能或解决方案。',
        en: 'I want to start dropshipping [Product Name, e.g., portable car vacuums] on eBay/Shopify. Please deeply analyze the top 5 most common buyer complaints and core pain points for this product currently on the market. For each pain point, list the specific features or solutions I should look for when sourcing from a supplier.'
      },
      {
        title: '生成 eBay 80字符极限标题',
        description: '基于从 Zik Analytics 获取的核心关键词，生成符合 eBay 规则的高权重标题。',
        tool: 'Zik Analytics / AutoDS',
        cn: '我正在 eBay 销售一款产品。以下是我从工具中找到的高搜索量关键词：[关键词列表，如：5 foot, fold in half, table, plastic, heavy duty, gray]。请帮我将这些词组合成一个连贯的 SEO 标题。要求：最描述性的词放最前面，禁止使用逗号等标点符号，总长度严格限制在 80 个字符以内。',
        en: 'I am selling a product on eBay. Here are the high-volume keywords I found: [Keyword List, e.g., 5 foot, fold in half, table, plastic, heavy duty, gray]. Please combine these into a coherent SEO title. Requirements: put the most descriptive words first, DO NOT use punctuation like commas, and strictly limit the total length to exactly or just under 80 characters.'
      },
      {
        title: '重写干瘪的速卖通/亚马逊描述',
        description: '将供应商生硬的参数转化为有说服力、有温度的销售文案。',
        tool: 'ChatGPT / Claude',
        cn: '请帮我重写以下产品描述，使其对买家更具吸引力，适合 Shopify 或 eBay。请突出产品的耐用性、解决的实际问题，并采用专业、热情的销售语调。请先写一段引人入胜的介绍，然后将核心规格用带 Emoji 的要点 (Bullet points) 呈现。原描述：\n[在此处粘贴原始产品规格]',
        en: 'Please rewrite the following product description to make it highly appealing to buyers for Shopify or eBay. Highlight durability, practical problems solved, and use a professional, enthusiastic sales tone. Start with an engaging intro paragraph, followed by core specs presented as bullet points with relevant emojis. Original description:\n[Paste original specs here]'
      },
      {
        title: '处理恶劣天气/断货物流延误',
        description: '专业且礼貌地安抚未收到货的买家，降低退款率和差评率。',
        tool: 'Gmail / Fillow',
        cn: '一位买家在我的网店留言：“[在此处输入买家抱怨，如：我一周前买的东西怎么还没到？]”。实际上由于 [原因，如：恶劣天气/供应商缺货]，物品今天才刚刚发出。请帮我起草一封礼貌、专业的安抚邮件。暂时无法提供物流单号，但要向他们保证已加急处理并诚恳表达歉意。',
        en: 'A buyer messaged my store: "[Insert buyer complaint]". In reality, due to [Reason, e.g., severe weather / supplier out of stock], the item just shipped today. Please draft a polite and professional appeasement email. Do not provide a tracking number yet, but assure them it has been expedited and sincerely apologize for the inconvenience.'
      }
    ]
  },
  {
    id: 'ai-agents',
    name: '🤖 AI 代理与浏览器自动化',
    icon: <Bot size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '设置自动化线索挖掘工作流',
        description: '提供给工作流工具的自然语言指令，用于自动寻找潜在 B2B 客户。',
        tool: 'Zapier Agents / n8n',
        cn: '创建一个每天自动运行的工作流：在谷歌地图上搜索 [地区名，如：丹佛] 的 [目标客户，如：本地牙医诊所]。抓取他们的网站，并使用 AI 检查网站是否未针对移动端优化。如果未优化，提取他们的联系邮箱，并起草一封包含截图的个性化冷邮件，推销我的网站重设计服务。',
        en: 'Create a daily automated workflow: Search Google Maps for [Target Client, e.g., local dental clinics] in [Location, e.g., Denver]. Scrape their websites and use AI to check if they are mobile-optimized. If not optimized, extract their contact email and draft a personalized cold email (mentioning the mobile issue) pitching my web redesign services.'
      },
      {
        title: '多模型智能体全网深度研究',
        description: '利用全能模型平台执行复杂的跨平台搜集与分析任务。',
        tool: 'i10X / Perplexity Computer',
        cn: '你的任务是：1. 在 YouTube 上搜索关于 [主题，如：2025年 AI 工具] 的最新热门视频。2. 提取前 5 个视频中提到的所有未重复的工具名称。3. 去官网查询这些工具的价格。4. 将最终结果整理成一个 Markdown 表格，包含工具名、主要功能和起步价格。',
        en: 'Your task: 1. Search YouTube for the latest trending videos about [Topic, e.g., AI tools in 2025]. 2. Extract all unique tool names mentioned across the top 5 videos. 3. Browse their official websites to find their starting pricing. 4. Compile the final results into a Markdown table with Tool Name, Core Feature, and Starting Price.'
      },
      {
        title: '命令 AI 浏览器代为购物/搜集',
        description: '使用 AI 浏览器让其自动在网页上点击、挑选和加购。',
        tool: 'Comet Browser (Auto-browse)',
        cn: '请自动访问 Etsy。搜索与 [风格描述，如：复古胡桃木] 风格相似的 [产品，如：咖啡桌] 家具。浏览前两页结果，挑选 3 件评价超过 4 星且价格低于 [预算] 的商品，直接将它们添加到我的购物车中。执行过程中请自主决策，不要每一步都询问我权限。',
        en: 'Please auto-browse to Etsy. Search for [Product, e.g., coffee tables] with a [Style Description, e.g., vintage walnut] aesthetic. Browse the first two pages, pick 3 highly-rated items (4+ stars) under [Budget], and add them directly to my cart. Work autonomously and do not ask me for permission at every step.'
      },
      {
        title: 'Claude 专属邮件助手指令',
        description: '在本地 AI 中设立一个具备您说话风格的“首席邮件执行官”代理。',
        tool: 'Claude Co-work OS',
        cn: '【系统指令】你现在是我的“首席邮件执行官”。你需要完全模仿我日常的说话语气。你的任务是根据我提供的简短、口语化的思路，起草专业但平易近人的回复邮件。在输出任何内容之前，请先分析并学习该文件夹中我以往的已发邮件。严禁使用诸如“I hope this email finds you well”这类陈词滥调。',
        en: '[System Prompt] You are now my "Chief Email Executive". You must perfectly mimic my natural tone of voice. Your task is to draft professional yet approachable email replies based on my brief, casual notes. Before outputting anything, analyze and learn from my past sent emails in this folder. Strictly NO corporate cliches like "I hope this email finds you well".'
      }
    ]
  },
  {
    id: 'nocode-apps',
    name: '💻 零代码 App & 网站开发',
    icon: <Code size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '开发完整全栈 SaaS 应用',
        description: '向智能应用构建器提供清晰的架构和数据库需求，包含后端。',
        tool: 'Crayo / Base44',
        cn: '构建一个基于 Web 的习惯追踪与问责应用 (SaaS)。功能需求：1. 完整的用户注册/登录认证系统。2. 真实的后端数据库能存储用户创建的每日习惯。3. 用户可以打卡，系统会在前端显示随时间变化的连胜进度条 (Streak chart)。4. UI 风格参考 Apple 的极简玻璃拟物化 (Glassmorphism) 风格。',
        en: 'Build a full-stack web-based habit tracking and accountability app (SaaS). Features: 1. Complete user authentication (signup/login). 2. A real backend database to store custom daily habits. 3. Users can check off habits, and the frontend displays a visual streak progress chart over time. 4. UI style should be Apple-inspired minimalist glassmorphism.'
      },
      {
        title: '多智能体团队开发指令',
        description: '让 MGX 这种多智能体团队同时工作，打造复杂的定制工具。',
        tool: 'MGX Agent Team',
        cn: '请带领你的智能体开发团队，为我构建一个能够抓取 Facebook Marketplace 数据的仪表板应用。应用需要每天清晨自动抓取本地被低估的 [产品类别，如：实木家具]，并以列表形式展示价格、链接和图片。我要利用这个工具捡漏并在 eBay 上翻新出售。',
        en: 'Please lead your AI agent team to build a dashboard application that scrapes Facebook Marketplace data. The app needs to automatically scrape undervalued [Product Category, e.g., solid wood furniture] locally every morning, displaying the price, link, and images in a list format. I will use this tool for retail arbitrage to flip on eBay.'
      },
      {
        title: '构建带 Stripe 支付的落地页',
        description: '让 AI 代理直接生成一个可接单的专业商业销售页面。',
        tool: 'Abacus Deep Agent / YouWare',
        cn: '请为我的 [业务类型，如：本地健身房私教训练营] 构建一个现代、视觉冲击力强的单页面网站。需要包含：1. 引人注目的 Hero 标题。2. 详细的课程安排板块。3. 教练介绍。4. 集成了 Stripe 支付模块的定价选项卡。网站必须具备极简的暗黑模式响应式设计。',
        en: 'Please build a modern, visually striking single-page website for my [Business Type, e.g., Local Gym Personal Training Bootcamp]. It must include: 1. A compelling Hero headline. 2. A detailed schedule section. 3. Trainer bio. 4. A pricing tab fully integrated with a Stripe payment module. The site must be fully responsive with a sleek dark mode design.'
      }
    ]
  },
  {
    id: 'notebooklm',
    name: '🧠 深度研究与 NotebookLM',
    icon: <BookOpen size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '强制生成特定风格演示文稿 (Slide Deck)',
        description: '跳过默认幻灯片，用提示词定制精美的插画风格和详细备注。',
        tool: 'NotebookLM / UMind',
        cn: '基于我在笔记本中上传的所有来源，为我整理一个 5-7 页的演示文稿 (Slide Deck)。主题是：“[你的演示主题]”。我要求所有幻灯片的视觉插图必须是 [指定风格，如：复古动漫/赛博朋克/极简商务] 风格。每一页必须明确包含：主标题、3个精炼的要点，以及供我阅读的详细演讲者备注 (Speaker Notes)。',
        en: 'Based on all sources uploaded in this notebook, create a 5-7 page Slide Deck. The topic is: "[Your Topic]". I mandate that the visual illustrations for all slides must be in a [Specific Style, e.g., Retro Anime / Cyberpunk / Clean Corporate] style. Each slide must include: a main title, 3 concise bullet points, and detailed Speaker Notes for me to read.'
      },
      {
        title: '提炼知识并生成信息图 (Infographic)',
        description: '让 AI 将复杂的长文章或视频文字稿总结为一张逻辑图表的提示词。',
        tool: 'NotebookLM (Custom Style)',
        cn: '总结当前笔记本中关于 [具体细节，如：黑洞如何形成] 的核心机制。然后，为我生成一个提示词，用于创建一张 16x9 尺寸、[风格，如：日本漫画] 风格的步骤信息图表（Infographic）。请详细指明图表上应该出现的具体排版文字和流程图箭头指向。',
        en: 'Summarize the core mechanisms about [Specific Detail, e.g., how black holes form] from this notebook. Then, generate a prompt for me to create a 16x9, [Style, e.g., Japanese manga] style step-by-step infographic. Please explicitly detail the exact typography text and flowchart arrows that should appear on the graphic.'
      },
      {
        title: '将手写杂乱笔记结构化为项目大纲',
        description: '处理手机拍摄的手写头脑风暴，转化为可执行的数字文档。',
        tool: 'NotebookLM / Gemini',
        cn: '请分析我上传的这张手写头脑风暴图片。提取其中的关键创意和零散想法，帮我将它们重组为一个逻辑严密的 [输出格式，如：YouTube 视频脚本大纲 / 商业计划书]。请剔除不相关的涂鸦，并在逻辑断层的地方用你的专业知识进行补充。',
        en: 'Please analyze the uploaded image of my handwritten brainstorm notes. Extract the key creative concepts and scattered ideas, and restructure them into a highly logical [Output Format, e.g., YouTube video script outline / Business Plan]. Filter out irrelevant doodles and use your expertise to fill in any logical gaps.'
      },
      {
        title: '利用 Cortex 插件建立知识图谱',
        description: '梳理多源资料，提取深层联系。',
        tool: 'Cortex Extension',
        cn: '请检索我通过 Cortex 导入的关于 [主题] 的所有最新网页和 YouTube 视频。帮我梳理出一个思维导图（Mind Map）结构，展示各方观点的核心分歧点和共识点，并标注对应的来源链接。',
        en: 'Please retrieve all the recent webpages and YouTube videos about [Topic] that I imported via Cortex. Help me structure a Mind Map showing the core disagreements and consensus points among the different perspectives, and tag them with their source links.'
      }
    ]
  },
  {
    id: 'social-marketing',
    name: '📢 批量社媒与内容营销',
    icon: <Megaphone size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '生成 Canva 批量创建数据矩阵 (CSV)',
        description: '一次性生成数十个格式完美的社媒帖子数据，无缝导入 Canva。',
        tool: 'ChatGPT / Canva Bulk Create',
        cn: '请为一家 [你的业务，如：提供在线心理咨询的诊所] 生成 [数量，如：15] 个具有同理心和传播力的 Instagram 轮播帖 (Carousel) 内容方案。请严格以 CSV 表格格式输出，绝对不要包含任何额外的对话文本。表格必须包含这 4 列：1. Post Name, 2. Image Prompt (供AI生图用的画面描述), 3. Headline (图片上的加粗大标题), 4. Copy (带相关热门Hashtags的帖子正文)。',
        en: 'Please generate [Number, e.g., 15] empathetic and highly shareable Instagram Carousel post ideas for a [Your Business, e.g., online therapy clinic]. Strictly output ONLY in a CSV table format with no conversational text. The table MUST contain these 4 columns: 1. Post Name, 2. Image Prompt (for AI image gen), 3. Headline (bold text on the image), 4. Copy (post caption with trending hashtags).'
      },
      {
        title: '自动化生成深度 SEO 博客文章',
        description: '创建能带来自然流量和联盟佣金 (Affiliate) 的高质量博客。',
        tool: 'RankPilot / Claude',
        cn: '作为一位资深评测专家，写一篇深度 SEO 优化的博客文章，客观比较这两款产品的优缺点：[产品A] 和 [产品B]。文章结构需包含：引人入胜的引言、核心功能对比表、优缺点列表、适用人群分析，以及最终购买推荐。文章中请明确留出插入“点击查看最新价格”的亚马逊联盟链接占位符。',
        en: 'As a veteran reviewer, write a deeply SEO-optimized blog post objectively comparing the pros and cons of these two products: [Product A] and [Product B]. Structure: engaging introduction, core feature comparison, pros & cons list, target audience analysis, and a final purchase recommendation. Clearly leave placeholders for "Check latest price" Amazon affiliate links.'
      },
      {
        title: '提取长视频打造病毒式 Shorts',
        description: '分析长视频文字稿，提取最具吸引力的 60 秒黄金片段。',
        tool: 'Zeemo AI',
        cn: '分析我提供的这段 YouTube 播客长视频的文字稿。请从中提取出 3 个最具争议性或最吸引人的 60 秒短视频（Shorts/Reels）切片片段。对于每个片段，请标出：起始/结束时间点、核心“金句”，并建议屏幕上应添加什么风格的背景素材 (B-roll) 和字幕动画来维持观众的完播率。',
        en: 'Analyze the provided transcript from a long-form YouTube podcast. Extract the 3 most controversial or highly engaging 60-second segments perfect for Shorts/Reels. For each segment, indicate: the start/end timestamps, the core "hook quote", and suggest the style of B-roll footage and animated captions to add on screen to maximize viewer retention.'
      }
    ]
  },
  {
    id: 'media-generation',
    name: '🎬 商业图像与视频生成',
    icon: <ImageIcon size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '生成包含正确文字的高级信息图',
        description: '利用顶尖模型（如 Google 的 Imagen 3/Nano Banana Pro）渲染完美文字排版。',
        tool: 'Nano Banana Pro',
        cn: '制作一张关于 [具体主题，如：如何冲泡完美的意式浓缩] 的步骤说明信息图（Infographic）。要求：必须包含清晰的排版文字，大标题为“[主标题名称]”，并配有简短的步骤说明和对应的现代矢量插画。极简、专业的设计排版。',
        en: 'Make an infographic that shows step by step how to make a [Specific Topic, e.g., perfect espresso shot]. Include clear typography with the main title "[Main Title]" and short steps with corresponding modern vector illustrations. Clean, minimalist, and professional layout.'
      },
      {
        title: '生成高级电商摄影背景图',
        description: '无需昂贵影棚，生成绝佳光影的商品展示底图。',
        tool: 'Midjourney / Nano Banana',
        cn: '[产品名称，如：哑光黑色的高级咖啡豆包装袋] 的商业摄影照片，放置在质朴的胡桃木桌面上，温暖的自然晨光从画面左侧洒下，散景（虚化）的背景中有一杯冒着热气的美式咖啡。专业影棚布光，极度逼真细节，8k分辨率。 --ar 16:9',
        en: 'Commercial product photography of a [Product Name, e.g., matte black premium coffee bean bag] placed on a rustic walnut table. Warm natural morning daylight hitting from the left side, steam rising from a cup of black coffee in the beautifully blurred bokeh background. Professional studio lighting, photorealistic details, 8k resolution. --ar 16:9'
      },
      {
        title: 'UGC 视频广告脚本生成 (爆款钩子)',
        description: '专为 Facebook 和 TikTok 广告设计的真实用户体验风格视频脚本。',
        tool: 'Bandy AI / ChatGPT',
        cn: '为这款 [产品名称] 写一个 15-30 秒的 TikTok UGC（用户生成内容）风格的视频广告脚本。开头必须有一个能够“打破滑动惯性 (Scroll-stopping)”的强烈视觉钩子。中间通过第一人称视角展示该产品如何解决 [具体痛点]，结尾包含强有力的行动号召（CTA）。提供具体的画面拍摄建议。',
        en: 'Write a 15-30 second TikTok UGC style video ad script for [Product Name]. The hook must be a "scroll-stopping" visual or audio cue. The middle should show, via a first-person perspective, exactly how the product solves [Specific Pain Point]. End with a strong Call To Action (CTA). Provide specific shot direction suggestions.'
      },
      {
        title: '静态商品图转视频广告运镜',
        description: '为静态图片增加物理运动效果，适合社交媒体视频流。',
        tool: 'Veo 3 / Runway / Sora',
        cn: '【上传商品图片后使用】电影级的缓慢平移运镜（Panning shot），拍摄画面中的这款 [描述图片中的产品，如：放置在徒步小径岩石上的不锈钢水壶]。摄像机慢慢向前和向右推进，阳光穿过树叶间的缝隙闪烁，空气中能看到飞舞的细小灰尘微粒。物理规律绝对真实，4k分辨率。',
        en: '[Use with uploaded product image] Cinematic slow panning shot of [Describe the product, e.g., this stainless steel water bottle resting on a rocky hiking trail]. The camera slowly pushes forward and to the right, sunlight flickering through the leaves, tiny dust particles dancing in the air. Physically accurate, photorealistic, 4k resolution.'
      },
      {
        title: '创建一致角色的连贯动画',
        description: '保持角色特征不变，生成有故事情节的短片。',
        tool: 'Domo AI / Hedra',
        cn: '创建一个 5 秒的动画视频。主角是：[角色描述，如：一只戴着红色围巾的赛博朋克风格狐狸]。场景设定在 [场景，如：下着霓虹雨的东京街头]。角色正在 [动作，如：喝着一杯热腾腾的拉面汤]。保持与原始参考图像完全一致的角色特征。',
        en: 'Create a 5-second animated video. The main character is: [Character Desc, e.g., a cyberpunk fox wearing a red scarf]. The setting is [Setting, e.g., Tokyo streets in neon rain]. The character is [Action, e.g., drinking from a steaming bowl of ramen]. Maintain absolute character consistency with the reference image.'
      }
    ]
  },
  {
    id: 'productivity',
    name: '⚡ 语音听写与极致提效',
    icon: <Headphones size={18} strokeWidth={1.5} />,
    prompts: [
      {
        title: '高精度语音头脑风暴润色',
        description: '将口述的、结巴的、发散的杂乱语音，秒变条理清晰的执行清单。',
        tool: 'Wispr Flow / Super Whisper',
        cn: '以下是我刚才散步时口述的一段杂乱语音转录。请帮我将其转化为一个结构清晰的项目待办清单（To-do list）。要求：1. 去除所有“嗯”、“啊”等语气词和重复废话。2. 修正发音导致的拼写错误。3. 将任务按照紧急/重要程度排序。4. 为每个任务分配极其明确的下一步行动。',
        en: 'Here is a messy, rambling voice transcript I just recorded while walking. Please transform it into a highly structured project To-do list. Requirements: 1. Remove all filler words (ums, ahs) and repetitive rambling. 2. Correct phonetical spelling errors. 3. Order tasks by apparent urgency/importance. 4. Assign extremely clear next-action steps for each task.'
      },
      {
        title: '超长会议录音提炼与复盘',
        description: '快速掌握动辄一小时的无聊会议重点。',
        tool: 'TicNote Cloud / Recall',
        cn: '请深入分析这份长达 1 小时的客户沟通会议记录文本。我不需要寒暄部分，请直接提取：1. 客户方提出的 3 个最核心的不满或诉求。2. 会议中我方承诺的具体的“下一步行动计划（Next steps）”及负责人。3. 将这些干货浓缩为一个可以用于团队内部汇报的 Markdown 大纲结构。',
        en: 'Deeply analyze this 1-hour client meeting transcript. Skip the small talk and directly extract: 1. The top 3 core complaints or demands raised by the client. 2. The specific "Next steps" we committed to during the meeting, along with the assigned owner. 3. Condense this actionable info into a Markdown outline structure perfect for an internal team debrief.'
      },
      {
        title: '基于遗忘曲线生成测验挑战',
        description: '利用 AI 将学习材料转化为 Quiz，帮助加深记忆。',
        tool: 'Recall (Quiz 2.0)',
        cn: '请根据我刚才保存的这篇文章的内容，生成 5 个具有挑战性的单选题。不要只考表面的死记硬背，要考察对概念深层逻辑的理解。请将正确答案和详细的解释附在最后。',
        en: 'Based on the article I just saved, generate 5 challenging multiple-choice questions. Do not just test rote memorization; test the deep logical understanding of the concepts. Please provide the correct answers and detailed explanations at the end.'
      }
    ]
  }
];

const App = () => {
  // --- 状态管理 ---
  const [activeCategory, setActiveCategory] = useState(promptData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalLang, setGlobalLang] = useState('cn');
  
  // 收藏夹状态 (存储 title 作为唯一标识)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('prompt_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('prompt_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (title) => {
    setFavorites(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // --- 功能：防拦截复制 ---
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
        setToast(globalLang === 'cn' ? '✅ 已成功拷贝至剪贴板！' : '✅ Successfully Copied!');
        setTimeout(() => setToast(null), 2500);
      }
    } catch (err) {
      console.error('Copy Error:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // --- 功能：数据过滤 ---
  const getFilteredPrompts = () => {
    let filtered = [];
    
    // 如果当前选中的是“收藏夹”
    if (activeCategory === 'favorites') {
      promptData.forEach(category => {
        const favPrompts = category.prompts.filter(prompt => favorites.includes(prompt.title));
        filtered = [...filtered, ...favPrompts];
      });
      // 可以在收藏夹内继续搜索
      if (searchQuery.trim() !== '') {
         filtered = filtered.filter(prompt => 
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tool.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return filtered;
    }

    // 正常分类的逻辑
    if (searchQuery.trim() === '') {
      const category = promptData.find(c => c.id === activeCategory);
      return category ? category.prompts : [];
    }

    // 搜索逻辑 (全局搜索)
    promptData.forEach(category => {
      const matchedPrompts = category.prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.cn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filtered = [...filtered, ...matchedPrompts];
    });
    return filtered;
  };

  const currentPrompts = getFilteredPrompts();

  // --- UI 组件：苹果风格高亮占位符 (#5AC8FA) ---
  const highlightPlaceholders = (text) => {
    return text.split(/(\[.*?\])/g).map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} className="text-[#5AC8FA] bg-[#5AC8FA]/15 px-1.5 py-0.5 rounded-md font-medium mx-0.5 border border-[#5AC8FA]/20 shadow-sm transition-all hover:bg-[#5AC8FA]/25">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#0071E3]/20 selection:text-[#0071E3] overflow-hidden">
      
      {/* 移动端菜单遮罩 (iOS Blur) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🍎 左侧边栏 (macOS Sidebar) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#F5F5F7]/90 backdrop-blur-2xl border-r border-gray-300/40 transform transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
        md:relative md:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="pt-10 pb-6 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-1.5 bg-gradient-to-br from-[#0071E3] to-[#34C759] rounded-[10px] shadow-sm group-hover:scale-105 transition-transform">
               <Layers size={20} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="text-[20px] font-bold tracking-tight text-[#1D1D1F]">
              Prompt<span className="font-light text-gray-500">Hub</span><span className="text-[#0071E3] text-sm ml-1 font-black">PRO</span>
            </h1>
          </div>
          <button className="md:hidden text-gray-500 hover:bg-gray-200/60 p-1.5 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar pb-10">
          
          {/* 收藏夹区域 */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400/80 uppercase tracking-[0.15em] mb-2 ml-2">
              My Workspace
            </p>
            <button
              onClick={() => {
                setActiveCategory('favorites');
                setSearchQuery('');
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-[14px] transition-all duration-200 group
                ${activeCategory === 'favorites' && searchQuery === ''
                  ? 'bg-[#0071E3] text-white font-medium shadow-[0_2px_10px_rgba(0,113,227,0.3)]' 
                  : 'text-gray-700 hover:bg-gray-200/50 font-normal'}
              `}
            >
              <div className="flex items-center space-x-3">
                <Star size={18} strokeWidth={activeCategory === 'favorites' ? 2 : 1.5} className={activeCategory === 'favorites' ? 'text-yellow-300 fill-yellow-300' : 'text-gray-400 group-hover:text-yellow-400'} />
                <span>收藏的提示词</span>
              </div>
              {favorites.length > 0 && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeCategory === 'favorites' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* 知识库板块 */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400/80 uppercase tracking-[0.15em] mb-2 ml-2">
              Lipsky Systems (V3.0)
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
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-[10px] text-[14px] transition-all duration-200 group
                    ${activeCategory === category.id && searchQuery === ''
                      ? 'bg-gray-200/80 text-[#1D1D1F] font-semibold' 
                      : 'text-gray-600 hover:bg-gray-200/50 font-medium'}
                  `}
                >
                  <span className={`transition-colors ${activeCategory === category.id && searchQuery === '' ? 'text-[#0071E3]' : 'text-gray-400 group-hover:text-[#0071E3]/70'}`}>
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 底部信息块 */}
        <div className="p-4 mx-4 mb-4 mt-auto">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center shadow-inner overflow-hidden border border-white">
                <span className="text-gray-600 text-[10px] font-bold">PJ</span>
              </div>
              <div className="text-[13px]">
                <p className="font-semibold text-[#1D1D1F] leading-tight">Paul J Lipsky</p>
                <p className="text-gray-400 text-[11px] font-medium">Pro Creator</p>
              </div>
            </div>
            <Zap size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
          </div>
        </div>
      </aside>

      {/* 🍎 主内容区 (Content View) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#ffffff] rounded-l-[2rem] md:rounded-l-[2.5rem] shadow-[-10px_0_30px_rgba(0,0,0,0.04)] border-l border-white">
        
        {/* 顶部搜索栏 & 分段控制器 (Glass Header) */}
        <header className="bg-white/70 backdrop-blur-xl z-20 px-6 sm:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100/50 sticky top-0 transition-all">
          <div className="flex items-center flex-1 max-w-2xl">
            <button 
              className="md:hidden mr-4 text-gray-500 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0071E3]">
                <Search size={16} className="text-gray-400 group-focus-within:text-[#0071E3]" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="搜索应用、场景、工具 (如 NotebookLM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-[14px] sm:text-[15px] font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all shadow-inner"
              />
            </div>
          </div>

          {/* 苹果分段控制器 (Segmented Control) */}
          <div className="hidden sm:flex bg-gray-100/80 p-1 rounded-full items-center self-start sm:self-auto shadow-inner">
            <button
              onClick={() => setGlobalLang('cn')}
              className={`px-6 py-1.5 text-[13px] rounded-full transition-all duration-300 ${globalLang === 'cn' ? 'bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.1)]' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              中文版
            </button>
            <button
              onClick={() => setGlobalLang('en')}
              className={`px-6 py-1.5 text-[13px] rounded-full transition-all duration-300 ${globalLang === 'en' ? 'bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.1)]' : 'text-gray-500 hover:text-gray-800 font-medium'}`}
            >
              English
            </button>
          </div>
        </header>

        {/* 提示词列表区 (Card List) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-8 md:py-12 custom-scrollbar bg-[#FAFAFC]">
          <div className="max-w-4xl mx-auto pb-24">
            
            {/* 页面标题信息 */}
            <div className="mb-10 pl-2">
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#1D1D1F] tracking-tight">
                {searchQuery 
                  ? 'Search Results' 
                  : activeCategory === 'favorites' 
                    ? 'Favorites ⭐️'
                    : promptData.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-500 mt-2 text-[15px] font-medium">
                {searchQuery 
                  ? `共为您找到 ${currentPrompts.length} 个精确匹配的提示词` 
                  : activeCategory === 'favorites'
                    ? '您保存的高频使用提示词都在这里。'
                    : '在右上角切换双语，一键拷贝提示词。带方括号的高亮区域为需要您修改的变量。'}
              </p>
              
              {/* 移动端语言提示 */}
              <div className="sm:hidden mt-5 inline-flex bg-gray-200/60 p-1 rounded-full items-center">
                <button onClick={() => setGlobalLang('cn')} className={`px-5 py-1.5 text-xs rounded-full ${globalLang === 'cn' ? 'bg-white shadow-sm font-semibold text-black' : 'text-gray-500 font-medium'}`}>中文</button>
                <button onClick={() => setGlobalLang('en')} className={`px-5 py-1.5 text-xs rounded-full ${globalLang === 'en' ? 'bg-white shadow-sm font-semibold text-black' : 'text-gray-500 font-medium'}`}>English</button>
              </div>
            </div>

            {/* 卡片渲染 */}
            {currentPrompts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {currentPrompts.map((prompt, index) => {
                  const isFav = favorites.includes(prompt.title);
                  return (
                  <div 
                    key={index} 
                    className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] group"
                  >
                    <div className="p-7 sm:p-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* 工具标签 */}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100/80 border border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                              {prompt.tool}
                            </span>
                            {/* 收藏按钮 */}
                            <button 
                              onClick={() => toggleFavorite(prompt.title)}
                              className={`p-1.5 rounded-full transition-all duration-300 hover:bg-gray-100 ${isFav ? 'text-yellow-400 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300'}`}
                              title={isFav ? "取消收藏" : "加入收藏"}
                            >
                              <Star size={18} className={isFav ? 'fill-yellow-400' : ''} />
                            </button>
                          </div>
                          <h3 className="text-[20px] font-bold text-[#1D1D1F] tracking-tight mb-2 leading-snug">
                            {prompt.title}
                          </h3>
                          <p className="text-[15px] text-gray-500 leading-relaxed font-medium">{prompt.description}</p>
                        </div>
                        
                        {/* 超大醒目的一键复制按钮 */}
                        <button
                          onClick={(e) => {
                            handleCopy(globalLang === 'cn' ? prompt.cn : prompt.en);
                            // 添加简单的点击波纹视觉反馈
                            const btn = e.currentTarget;
                            btn.classList.add('bg-[#005bb5]', 'scale-95');
                            setTimeout(() => btn.classList.remove('bg-[#005bb5]', 'scale-95'), 150);
                          }}
                          className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center space-x-2 px-6 py-3 bg-[#0071E3] text-white rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(0,113,227,0.25)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)]"
                          title="一键拷贝当前语言提示词"
                        >
                          <Copy size={16} strokeWidth={2.5} />
                          <span className="text-[14px] font-bold tracking-wide">
                            {globalLang === 'cn' ? '一键拷贝' : 'Copy Prompt'}
                          </span>
                        </button>
                      </div>
                      
                      {/* macOS 风格终端代码区 */}
                      <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-2xl border border-[#3A3A3C]/50 mt-4 relative">
                        {/* 顶部玻璃态控制条 */}
                        <div className="bg-[#2C2C2E]/80 px-5 py-3.5 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10 shadow-sm"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10 shadow-sm"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10 shadow-sm"></div>
                          </div>
                          
                          <div className="text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                            Terminal • {globalLang === 'cn' ? 'ZH' : 'EN'}
                          </div>
                        </div>
                        
                        {/* 代码正文内容区 */}
                        <div className="p-6 sm:p-7 font-mono text-[14px] leading-[1.8] text-[#F5F5F7] whitespace-pre-wrap tracking-tight">
                           {globalLang === 'cn' 
                              ? highlightPlaceholders(prompt.cn)
                              : highlightPlaceholders(prompt.en)
                           }
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[24px] border border-dashed border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                   <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1D1D1F]">
                  {activeCategory === 'favorites' ? '您的收藏夹是空的' : '未找到相关提示词'}
                </h3>
                <p className="text-gray-500 mt-2 text-[14px] font-medium">
                  {activeCategory === 'favorites' 
                    ? '点击提示词标题旁边的星号图标，即可将它加入收藏。' 
                    : '请尝试缩短关键词，或浏览左侧其他系统板块。'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 🍎 Dynamic Island Toast 提示 */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-6 fade-in duration-300">
          <div className="bg-black/85 backdrop-blur-2xl text-white px-6 py-3.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-white/15 flex items-center space-x-3">
            <span className="font-semibold text-[14px] tracking-wide">{toast}</span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default App;
