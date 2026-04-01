import React, { useState, useEffect } from 'react';
import { 
  Search, Copy, CheckCircle2, ShoppingCart, Bot, 
  Image as ImageIcon, Megaphone, BookOpen, 
  Command, Code, Headphones, Star, Layers, Zap
} from 'lucide-react';

// --- 深度提炼数据源：全面丰富，并新增了 cost (每月成本) 属性用于滑动条筛选 ---
const promptData = [
  {
    id: 'ecommerce',
    nameCn: '🛒 电商与代发货',
    nameEn: 'Dropshipping',
    icon: <ShoppingCart />,
    prompts: [
      {
        title: '分析高销量竞品核心痛点',
        description: '在决定卖某款产品前，让 AI 分析市场抱怨，寻找产品差异化卖点。',
        tool: 'ChatGPT / Gemini',
        cost: 0,
        cn: '我想开始在 eBay/Shopify 上销售 [产品名称，如：便携式汽车吸尘器]。请帮我深度分析目前市场上买家对这类产品最常见的 5 个抱怨和核心痛点。并针对每一个痛点，列出我在寻找供应商时应该关注的产品功能或解决方案。',
        en: 'I want to start dropshipping [Product Name, e.g., portable car vacuums] on eBay/Shopify. Please deeply analyze the top 5 most common buyer complaints and core pain points for this product currently on the market. For each pain point, list the specific features or solutions I should look for when sourcing from a supplier.'
      },
      {
        title: '生成 eBay 极限 SEO 标题',
        description: '基于核心关键词，生成符合 eBay 规则的高权重标题。',
        tool: 'Zik Analytics / AutoDS',
        cost: 30,
        cn: '我正在 eBay 销售一款产品。以下是我从工具中找到的高搜索量关键词：[关键词列表，如：5 foot, fold in half, table, plastic, heavy duty, gray]。请帮我将这些词组合成一个连贯的 SEO 标题。要求：最描述性的词放最前面，禁止使用逗号等标点符号，总长度严格限制在 80 个字符以内。',
        en: 'I am selling a product on eBay. Here are the high-volume keywords I found: [Keyword List, e.g., 5 foot, fold in half, table, plastic, heavy duty, gray]. Please combine these into a coherent SEO title. Requirements: put the most descriptive words first, DO NOT use punctuation like commas, and strictly limit the total length to exactly or just under 80 characters.'
      },
      {
        title: '重写干瘪的供应商产品描述',
        description: '将供应商生硬的参数转化为有说服力、有温度的销售文案。',
        tool: 'Claude / ChatGPT',
        cost: 0,
        cn: '请帮我重写以下产品描述，使其对买家更具吸引力，适合 Shopify 或 eBay。请突出产品的耐用性、解决的实际问题，并采用专业、热情的销售语调。请先写一段引人入胜的介绍，然后将核心规格用带 Emoji 的要点 (Bullet points) 呈现。原描述：\n[在此处粘贴原始产品规格]',
        en: 'Please rewrite the following product description to make it highly appealing to buyers for Shopify or eBay. Highlight durability, practical problems solved, and use a professional, enthusiastic sales tone. Start with an engaging intro paragraph, followed by core specs presented as bullet points with relevant emojis. Original description:\n[Paste original specs here]'
      },
      {
        title: '专业处理物流延误/客诉邮件',
        description: '专业且礼貌地安抚未收到货的买家，降低退款率和差评率。',
        tool: 'Gmail AI',
        cost: 0,
        cn: '一位买家在我的网店留言：“[在此处输入买家抱怨，如：我一周前买的东西怎么还没到？]”。实际上由于 [原因，如：恶劣天气/供应商缺货]，物品今天才刚刚发出。请帮我起草一封礼貌、专业的安抚邮件。暂时无法提供物流单号，但要向他们保证已加急处理并诚恳表达歉意。',
        en: 'A buyer messaged my store: "[Insert buyer complaint]". In reality, due to [Reason, e.g., severe weather / supplier out of stock], the item just shipped today. Please draft a polite and professional appeasement email. Do not provide a tracking number yet, but assure them it has been expedited and sincerely apologize for the inconvenience.'
      }
    ]
  },
  {
    id: 'notebooklm',
    nameCn: '🧠 NotebookLM 研究',
    nameEn: 'NotebookLM',
    icon: <BookOpen />,
    prompts: [
      {
        title: '定制特定风格演示文稿 (Slide Deck)',
        description: '跳过默认幻灯片，用提示词定制精美的插画风格和详细备注。',
        tool: 'NotebookLM',
        cost: 0,
        cn: '基于我在笔记本中上传的所有来源，为我整理一个 5-7 页的演示文稿 (Slide Deck)。主题是：“[你的演示主题]”。我要求所有幻灯片的视觉插图必须是 [指定风格，如：复古动漫/赛博朋克/极简商务] 风格。每一页必须明确包含：主标题、3个精炼的要点，以及供我阅读的详细演讲者备注 (Speaker Notes)。',
        en: 'Based on all sources uploaded in this notebook, create a 5-7 page Slide Deck. The topic is: "[Your Topic]". I mandate that the visual illustrations for all slides must be in a [Specific Style, e.g., Retro Anime / Cyberpunk / Clean Corporate] style. Each slide must include: a main title, 3 concise bullet points, and detailed Speaker Notes for me to read.'
      },
      {
        title: '生成爆炸图/解剖图信息图 (Infographic)',
        description: '让 AI 提取复杂产品信息，生成极具科技感的拆解视图提示。',
        tool: 'NotebookLM',
        cost: 0,
        cn: '总结当前笔记本中关于 [具体细节，如：黑洞如何形成 / 新款iPhone结构] 的核心机制。然后，为我生成一个提示词，用于创建一张 16x9 尺寸、极致细节的“爆炸视图 (Exploded View Diagram)”信息图表。请详细指明图表上应该出现的 5 个核心排版文字和流程图箭头指向。',
        en: 'Summarize the core mechanisms about [Specific Detail, e.g., how black holes form / iPhone internal structure] from this notebook. Then, generate a prompt for me to create a 16x9, ultra-detailed "Exploded View Diagram" step-by-step infographic. Please explicitly detail the exact typography text for 5 core components and flowchart arrows that should appear.'
      },
      {
        title: '构建深度知识图谱与心智模型',
        description: '不仅提取重点，更要找出不同资料间的共识与分歧，加深理解。',
        tool: 'Cortex / NotebookLM',
        cost: 10,
        cn: '基于我上传的所有 YouTube 视频文字稿和文章，构建一个深度的思维导图大纲。不要只是简单提取核心观点，请务必明确指出不同来源之间的“共识 (Consensus)”与“核心分歧点 (Disagreements)”。最后，用费曼技巧 (Feynman Technique) 向我解释这个主题中最难懂的部分。',
        en: 'Based on all the YouTube transcripts and articles I uploaded, build a deep mind map outline. Do not just extract core points; specifically identify the "consensus" and "core disagreements" across different sources. Finally, use the Feynman Technique to explain the most complex part of this topic to me.'
      },
      {
        title: '提取并指导生成爆款播客对谈 (Audio)',
        description: '给 NotebookLM 剧本，让它生成的 Audio Overview 更加有趣。',
        tool: 'NotebookLM',
        cost: 0,
        cn: '仔细分析这个笔记本中的所有资料，为两名播客主持人（一男一女）撰写一份 5 分钟的对谈播客大纲。要求：开场要有极强的悬念，中间要针对 [特定话题] 穿插一段幽默的争论，并在结尾引导听众深入思考。这份大纲将用于指导 NotebookLM 的 Audio Overview 生成。',
        en: 'Carefully analyze all sources in this notebook and write a 5-minute conversational podcast outline for two hosts (one male, one female). Requirements: start with a strong cliffhanger hook, include a humorous debate in the middle about [Specific Topic], and end with a thought-provoking question. This outline will guide the Audio Overview generation.'
      },
      {
        title: '基于遗忘曲线的深度测验生成',
        description: '利用 AI 将学习材料转化为深度 Quiz，避免死记硬背。',
        tool: 'Recall / NotebookLM',
        cost: 10,
        cn: '根据我保存在这个笔记本里的长文/视频内容，生成 10 个具有挑战性的多选题。不要只考表面的死记硬背，重点考察对核心概念底层逻辑的理解。请将正确答案和深入的解释附在最后，并提供一个帮助记忆的简单口诀。',
        en: 'Based on the long article/video content saved in this notebook, generate 10 challenging multiple-choice questions. Do not just test rote memorization; focus on testing the deep logical understanding of core concepts. Provide the correct answers and in-depth explanations at the end, along with a simple mnemonic device to help remember it.'
      },
      {
        title: '将手写杂乱笔记结构化为商业计划',
        description: '处理手机拍摄的手写头脑风暴，转化为可执行的数字大纲。',
        tool: 'NotebookLM / Gemini',
        cost: 0,
        cn: '请分析我上传的这张手写头脑风暴图片。提取其中的关键创意和零散想法，帮我将它们重组为一个逻辑严密的 [输出格式，如：YouTube 视频脚本大纲 / 商业计划书]。请剔除不相关的涂鸦，并在逻辑断层的地方用你的专业知识进行补充。',
        en: 'Please analyze the uploaded image of my handwritten brainstorm notes. Extract the key creative concepts and scattered ideas, and restructure them into a highly logical [Output Format, e.g., YouTube video script outline / Business Plan]. Filter out irrelevant doodles and use your expertise to fill in any logical gaps.'
      }
    ]
  },
  {
    id: 'social-marketing',
    nameCn: '📢 社媒与内容营销',
    nameEn: 'Social / Marketing',
    icon: <Megaphone />,
    prompts: [
      {
        title: '生成 Canva 批量创建数据矩阵 (CSV)',
        description: '一次性生成数十个格式完美的社媒帖子数据，无缝导入 Canva 批量生成。',
        tool: 'ChatGPT / Canva Bulk',
        cost: 20,
        cn: '请为一家 [你的业务，如：提供在线心理咨询的诊所] 生成 [数量，如：15] 个具有同理心和传播力的 Instagram 轮播帖 (Carousel) 内容方案。请严格以 CSV 表格格式输出，绝对不要包含任何额外的对话文本。表格必须包含这 4 列：1. Post Name, 2. Image Prompt (供AI生图用的画面描述), 3. Headline (图片上的加粗大标题), 4. Copy (带相关热门Hashtags的帖子正文)。',
        en: 'Please generate [Number, e.g., 15] empathetic and highly shareable Instagram Carousel post ideas for a [Your Business, e.g., online therapy clinic]. Strictly output ONLY in a CSV table format with no conversational text. The table MUST contain these 4 columns: 1. Post Name, 2. Image Prompt (for AI image gen), 3. Headline (bold text on the image), 4. Copy (post caption with trending hashtags).'
      },
      {
        title: 'UGC 视频广告剧本 (打破滑动惯性)',
        description: '专为 Facebook 和 TikTok 广告设计的“真实用户体验”风格强效视频脚本。',
        tool: 'Bandy AI / ChatGPT',
        cost: 20,
        cn: '为这款 [产品名称，如：蓝牙睡眠眼罩] 写一个 15-30 秒的 TikTok / Facebook UGC 风格的视频广告脚本。开头必须有一个能够“打破滑动惯性 (Scroll-stopping)”的强烈视觉钩子。中间通过第一人称视角展示该产品如何解决 [具体痛点，如：侧睡耳朵疼]，结尾包含强有力的行动号召（CTA）。请在脚本中标注出画面拍摄建议。',
        en: 'Write a 15-30 second TikTok / Facebook UGC style video ad script for [Product Name, e.g., Bluetooth sleep headband]. The hook must be a "scroll-stopping" visual cue. The middle should show, via a first-person perspective, exactly how the product solves [Specific Pain Point, e.g., hurting ears for side sleepers]. End with a strong CTA. Include specific shot direction suggestions.'
      },
      {
        title: 'YouTube 爆款深度测评脚本',
        description: '生成能带来自然流量和联盟佣金 (Affiliate) 的高质量视频解说词。',
        tool: 'Claude / Gemini',
        cost: 0,
        cn: '帮我写一个 8 分钟的 YouTube 视频脚本，测评今年最火的 5 款 [产品类别，如：亚马逊不锈钢保温杯]。要求：前 15 秒要有强烈的悬念钩子 (Hook)，中间要有详尽的优缺点对比表，并在最后自然地引导观众点击描述栏的联盟营销 (Affiliate) 链接。请在脚本中明确标注出 B-Roll (空镜) 画面和音效建议。',
        en: 'Help me write an 8-minute YouTube video script reviewing the top 5 most popular [Product Category, e.g., Amazon stainless steel tumblers] this year. Requirements: a strong hook in the first 15 seconds, detailed pros and cons comparison in the middle, and a natural call-to-action at the end directing viewers to the affiliate links. Please clearly mark B-Roll footage and sound effect suggestions.'
      },
      {
        title: 'Pinterest 爆款引流图文案矩阵',
        description: '为 Pinterest 打造的高转化率、富含 SEO 关键词的图文组合方案。',
        tool: 'ChatGPT',
        cost: 0,
        cn: '帮我生成 10 个用于 Pinterest 推广 [你的博客文章/产品，如：2026年数字游民赚钱指南] 的 Pin 图文案。要求：以 CSV 表格格式输出，包含这 3 列：1. Pin Title（极大吸引点击率的大标题），2. Pin Description（富含长尾 SEO 关键词的详细描述），3. Image Concept（适合用 AI 图像生成器制作的极简、高级美学背景图提示词）。',
        en: 'Help me generate 10 Pinterest Pin ideas to promote [Your Blog/Product, e.g., 2026 Digital Nomad Income Guide]. Requirements: Output in CSV format with these 3 columns: 1. Pin Title (highly click-worthy headline), 2. Pin Description (detailed description rich in long-tail SEO keywords), 3. Image Concept (prompt for generating a minimalist, high-end aesthetic background image using AI).'
      },
      {
        title: '自动生成 KDP 电子书大纲与内容',
        description: '快速构建可在 Etsy 或亚马逊 KDP 售卖的数字产品基础框架。',
        tool: 'ChatGPT / Claude',
        cost: 0,
        cn: '我想在 Etsy 或亚马逊 KDP 上销售数字产品。请为我构思并撰写一本名为《[主题，如：500个高利润低内容图书创意]》的电子书大纲。必须包括：3个引人注目的备选封面标题、完整的章节目录、一段极具说服力的引言，以及第一章的完整详细内容。请使用专业、赋能的销售语调。',
        en: 'I want to sell digital products on Etsy or Amazon KDP. Please conceptualize and write an outline for an ebook tentatively titled "[Topic, e.g., 500 High-Profit Low Content Book Ideas]". Must include: 3 catchy alternative cover titles, a complete table of contents, a highly persuasive introduction, and the full detailed content for Chapter 1. Use a professional and empowering tone.'
      },
      {
        title: '提取长视频打造病毒 Shorts',
        description: '分析长视频文字稿，提取最具争议或最吸引人的 60 秒黄金片段。',
        tool: 'Zeemo AI',
        cost: 20,
        cn: '分析我提供的这段 YouTube 播客长视频的文字稿。请从中提取出 3 个最具争议性或最吸引人的 60 秒短视频（Shorts/Reels）切片片段。对于每个片段，请标出：起始/结束时间点、核心“金句”，并建议屏幕上应添加什么风格的背景素材 (B-roll) 和字幕动画来维持观众的完播率。',
        en: 'Analyze the provided transcript from a long-form YouTube podcast. Extract the 3 most controversial or highly engaging 60-second segments perfect for Shorts/Reels. For each segment, indicate: the start/end timestamps, the core "hook quote", and suggest the style of B-roll footage and animated captions to add on screen to maximize viewer retention.'
      }
    ]
  },
  {
    id: 'ai-agents',
    nameCn: '🤖 AI 代理自动化',
    nameEn: 'AI Agents',
    icon: <Bot />,
    prompts: [
      {
        title: '设置自动化线索挖掘流',
        description: '提供给工作流工具的自然语言指令，用于自动寻找潜在 B2B 客户。',
        tool: 'Zapier / n8n',
        cost: 20,
        cn: '创建一个每天自动运行的工作流：在谷歌地图上搜索 [地区名，如：丹佛] 的 [目标客户，如：本地牙医诊所]。抓取他们的网站，并使用 AI 检查网站是否未针对移动端优化。如果未优化，提取他们的联系邮箱，并起草一封包含截图的个性化冷邮件，推销我的网站重设计服务。',
        en: 'Create a daily automated workflow: Search Google Maps for [Target Client, e.g., local dental clinics] in [Location, e.g., Denver]. Scrape their websites and use AI to check if they are mobile-optimized. If not optimized, extract their contact email and draft a personalized cold email (mentioning the mobile issue) pitching my web redesign services.'
      },
      {
        title: 'Perplexity Computer 全网自动抓取',
        description: '指派 AI 电脑自主浏览全网并整理数据至表格。',
        tool: 'Perplexity Computer',
        cost: 50,
        cn: '你的任务是：1. 在 YouTube 上搜索关于 [主题，如：2026年 AI 工具] 的最新热门视频。2. 提取前 5 个视频中提到的所有未重复的工具名称。3. 自动去官网查询这些工具的价格。4. 将最终结果整理成一个 Markdown 表格，包含工具名、主要功能和起步价格。执行过程请自主决策。',
        en: 'Your task: 1. Search YouTube for the latest trending videos about [Topic, e.g., AI tools in 2026]. 2. Extract all unique tool names mentioned across the top 5 videos. 3. Auto-browse their official websites to find their starting pricing. 4. Compile the final results into a Markdown table with Tool Name, Core Feature, and Starting Price. Work autonomously.'
      },
      {
        title: 'Claude 专属邮件处理助手',
        description: '在本地 AI 中设立一个具备您说话风格的“首席邮件执行官”。',
        tool: 'Co-work OS',
        cost: 0,
        cn: '【系统指令】你现在是我的“首席邮件执行官”。你需要完全模仿我日常的说话语气。你的任务是根据我提供的简短、口语化的思路，起草专业但平易近人的回复邮件。在输出任何内容之前，请先分析并学习该文件夹中我以往的已发邮件。严禁使用诸如“I hope this email finds you well”这类陈词滥调。',
        en: '[System Prompt] You are now my "Chief Email Executive". You must perfectly mimic my natural tone of voice. Your task is to draft professional yet approachable email replies based on my brief, casual notes. Before outputting anything, analyze and learn from my past sent emails in this folder. Strictly NO corporate cliches like "I hope this email finds you well".'
      }
    ]
  },
  {
    id: 'nocode-apps',
    nameCn: '💻 零代码开发',
    nameEn: 'SaaS / No-Code',
    icon: <Code />,
    prompts: [
      {
        title: '开发全栈 SaaS 习惯追踪应用',
        description: '向智能应用构建器提供清晰的架构和数据库需求，包含后端。',
        tool: 'Crayo / Base44',
        cost: 0,
        cn: '构建一个基于 Web 的习惯追踪与问责应用 (SaaS)。功能需求：1. 完整的用户注册/登录认证系统。2. 真实的后端数据库能存储用户创建的每日习惯。3. 用户可以打卡，系统会在前端显示随时间变化的连胜进度条 (Streak chart)。4. UI 风格参考 Apple 的极简玻璃拟物化 (Glassmorphism) 风格。',
        en: 'Build a full-stack web-based habit tracking and accountability app (SaaS). Features: 1. Complete user authentication (signup/login). 2. A real backend database to store custom daily habits. 3. Users can check off habits, and the frontend displays a visual streak progress chart over time. 4. UI style should be Apple-inspired minimalist glassmorphism.'
      },
      {
        title: '多智能体团队抓取工具开发',
        description: '让多智能体团队同时工作，打造复杂的定制数据抓取仪表板。',
        tool: 'MGX Agent',
        cost: 0,
        cn: '请带领你的智能体开发团队，为我构建一个能够抓取 Facebook Marketplace 数据的仪表板应用。应用需要每天清晨自动抓取本地被低估的 [产品类别，如：实木家具]，并以列表形式展示价格、链接和图片。我要利用这个工具捡漏并在 eBay 上翻新出售。',
        en: 'Please lead your AI agent team to build a dashboard application that scrapes Facebook Marketplace data. The app needs to automatically scrape undervalued [Product Category, e.g., solid wood furniture] locally every morning, displaying the price, link, and images in a list format. I will use this tool for retail arbitrage to flip on eBay.'
      },
      {
        title: '构建带 Stripe 支付的商业落地页',
        description: '让 AI 代理直接生成一个可接单的专业商业销售页面。',
        tool: 'Deep Agent',
        cost: 10,
        cn: '请为我的 [业务类型，如：本地健身房私教训练营] 构建一个现代、视觉冲击力强的单页面网站。需要包含：1. 引人注目的 Hero 标题。2. 详细的课程安排板块。3. 教练介绍。4. 集成了 Stripe 支付模块的定价选项卡。网站必须具备极简的暗黑模式响应式设计。',
        en: 'Please build a modern, visually striking single-page website for my [Business Type, e.g., Local Gym Personal Training Bootcamp]. It must include: 1. A compelling Hero headline. 2. A detailed schedule section. 3. Trainer bio. 4. A pricing tab fully integrated with a Stripe payment module. The site must be fully responsive with a sleek dark mode design.'
      }
    ]
  },
  {
    id: 'media-generation',
    nameCn: '🎬 影像生成',
    nameEn: 'Media Generation',
    icon: <ImageIcon />,
    prompts: [
      {
        title: '生成包含正确文字的高级信息图',
        description: '利用顶尖模型渲染完美的文字排版与插画。',
        tool: 'Nano Banana Pro',
        cost: 0,
        cn: '制作一张关于 [具体主题，如：如何冲泡完美的意式浓缩] 的步骤说明信息图（Infographic）。要求：必须包含清晰的排版文字，大标题为“[主标题名称]”，并配有简短的步骤说明和对应的现代矢量插画。极简、专业的设计排版。',
        en: 'Make an infographic that shows step by step how to make a [Specific Topic, e.g., perfect espresso shot]. Include clear typography with the main title "[Main Title]" and short steps with corresponding modern vector illustrations. Clean, minimalist, and professional layout.'
      },
      {
        title: '生成高级电商摄影背景图',
        description: '无需昂贵影棚，生成绝佳光影的商品展示底图。',
        tool: 'Midjourney',
        cost: 10,
        cn: '[产品名称，如：哑光黑色的高级咖啡豆包装袋] 的商业摄影照片，放置在质朴的胡桃木桌面上，温暖的自然晨光从画面左侧洒下，散景（虚化）的背景中有一杯冒着热气的美式咖啡。专业影棚布光，极度逼真细节，8k分辨率。 --ar 16:9',
        en: 'Commercial product photography of a [Product Name, e.g., matte black premium coffee bean bag] placed on a rustic walnut table. Warm natural morning daylight hitting from the left side, steam rising from a cup of black coffee in the beautifully blurred bokeh background. Professional studio lighting, photorealistic details, 8k resolution. --ar 16:9'
      },
      {
        title: '静态商品图转视频广告运镜',
        description: '为静态图片增加物理运动效果，适合社交媒体视频流。',
        tool: 'Veo 3 / Sora',
        cost: 20,
        cn: '【上传商品图片后使用】电影级的缓慢平移运镜（Panning shot），拍摄画面中的这款 [描述图片中的产品，如：放置在徒步小径岩石上的不锈钢水壶]。摄像机慢慢向前和向右推进，阳光穿过树叶间的缝隙闪烁，空气中能看到飞舞的细小灰尘微粒。物理规律绝对真实，4k分辨率。',
        en: '[Use with uploaded product image] Cinematic slow panning shot of [Describe the product, e.g., this stainless steel water bottle resting on a rocky hiking trail]. The camera slowly pushes forward and to the right, sunlight flickering through the leaves, tiny dust particles dancing in the air. Physically accurate, photorealistic, 4k resolution.'
      }
    ]
  },
  {
    id: 'productivity',
    nameCn: '⚡ 极致效率',
    nameEn: 'Productivity',
    icon: <Headphones />,
    prompts: [
      {
        title: '高精度语音头脑风暴润色',
        description: '将口述的、发散的杂乱语音，秒变条理清晰的执行清单。',
        tool: 'Wispr Flow',
        cost: 0,
        cn: '以下是我刚才散步时口述的一段杂乱语音转录。请帮我将其转化为一个结构清晰的项目待办清单（To-do list）。要求：1. 去除所有“嗯”、“啊”等语气词和重复废话。2. 修正发音导致的拼写错误。3. 将任务按照紧急/重要程度排序。4. 为每个任务分配极其明确的下一步行动。',
        en: 'Here is a messy, rambling voice transcript I just recorded while walking. Please transform it into a highly structured project To-do list. Requirements: 1. Remove all filler words (ums, ahs) and repetitive rambling. 2. Correct phonetical spelling errors. 3. Order tasks by apparent urgency/importance. 4. Assign extremely clear next-action steps for each task.'
      },
      {
        title: '长会议录音提炼与复盘归档',
        description: '快速掌握动辄一小时的无聊会议重点，生成团队汇报大纲。',
        tool: 'TicNote Cloud',
        cost: 0,
        cn: '请深入分析这份长达 1 小时的客户沟通会议记录文本。我不需要寒暄部分，请直接提取：1. 客户方提出的 3 个最核心的不满或诉求。2. 会议中我方承诺的具体的“下一步行动计划（Next steps）”及负责人。3. 将这些干货浓缩为一个可以用于团队内部汇报的 Markdown 大纲结构。',
        en: 'Deeply analyze this 1-hour client meeting transcript. Skip the small talk and directly extract: 1. The top 3 core complaints or demands raised by the client. 2. The specific "Next steps" we committed to during the meeting, along with the assigned owner. 3. Condense this actionable info into a Markdown outline structure perfect for an internal team debrief.'
      }
    ]
  }
];

const App = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [globalLang, setGlobalLang] = useState('cn'); 
  
  // 收藏夹状态 (LocalStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('prompt_favorites_ramp');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('prompt_favorites_ramp', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (title, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // 防拦截复制方案
  const handleCopy = (text, e) => {
    e.stopPropagation(); 
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
        setToast(globalLang === 'cn' ? '提示词已成功复制！' : 'Prompt copied to clipboard!');
        setTimeout(() => setToast(null), 2500);
      }
    } catch (err) {
      console.error('Copy Error:', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // 获取过滤后的提示词 (增加了价格滑动条的筛选逻辑)
  const getFilteredPrompts = () => {
    let filtered = [];
    
    if (activeCategory === 'favorites') {
      promptData.forEach(category => {
        const favPrompts = category.prompts.filter(prompt => favorites.includes(prompt.title));
        const promptsWithIcons = favPrompts.map(p => ({ ...p, icon: category.icon }));
        filtered = [...filtered, ...promptsWithIcons];
      });
      if (searchQuery.trim() !== '') {
         filtered = filtered.filter(prompt => 
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tool.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return filtered;
    }

    const categoriesToSearch = activeCategory === 'all' 
      ? promptData 
      : promptData.filter(c => c.id === activeCategory);

    categoriesToSearch.forEach(category => {
      const matchedPrompts = category.prompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.cn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const promptsWithIcons = matchedPrompts.map(p => ({ ...p, icon: category.icon }));
      filtered = [...filtered, ...promptsWithIcons];
    });

    return filtered;
  };

  const currentPrompts = getFilteredPrompts();

  const highlightPlaceholders = (text) => {
    return text.split(/(\[.*?\])/g).map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} className="text-black bg-[#CCFF00]/40 px-1.5 py-0.5 rounded-md font-bold mx-0.5 border border-[#CCFF00]/60">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#CCFF00] selection:text-black">
      
      {/* 🚀 Top Navigation */}
      <nav className="w-full px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
             <Command size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-[22px] tracking-tight">PromptHub <span className="text-[#CCFF00] inline-block -translate-y-1">↗</span></span>
        </div>

        {/* Global Lang Toggle */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl items-center shadow-inner">
          <button
            onClick={() => setGlobalLang('cn')}
            className={`px-5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${globalLang === 'cn' ? 'bg-white text-black font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-gray-500 font-semibold hover:text-black'}`}
          >
            中文
          </button>
          <button
            onClick={() => setGlobalLang('en')}
            className={`px-5 py-1.5 text-[13px] rounded-lg transition-all duration-200 ${globalLang === 'en' ? 'bg-white text-black font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-gray-500 font-semibold hover:text-black'}`}
          >
            EN
          </button>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-16 text-center flex flex-col items-center">
        <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-extrabold tracking-tighter leading-[1.05] text-[#111111] mb-6">
          {globalLang === 'cn' ? '我们只写 ' : 'We only write '} <br className="hidden sm:block" />
          <span className="bg-[#CCFF00] px-4 pb-2 pt-1 rounded-2xl inline-block mt-2 shadow-sm">
            {globalLang === 'cn' ? '高质量提示词。' : 'prompts.'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
          {globalLang === 'cn' 
            ? "拒绝废话，只提供经过实战检验的高级提示词。从社媒营销到深度研报，直接复制这些顶级工作流指令，让 AI 真正为你打工。" 
            : "No fluff, just battle-tested, high-quality prompts. From social marketing to deep research, copy these top-tier workflow instructions and make AI truly work for you."
          }
        </p>

        {/* Search Input Container */}
        <div className="flex flex-col justify-center items-center gap-5 w-full max-w-2xl mx-auto">
          {/* 搜索框 */}
          <div className="relative w-full group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} strokeWidth={2.5} />
             <input 
               type="text" 
               placeholder={globalLang === 'cn' ? "搜索 100+ 项高价值工作流..." : "Search 100+ high-value workflows..."}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-14 pr-6 py-4 rounded-xl bg-gray-100 border-2 border-transparent focus:bg-white focus:border-[#CCFF00] focus:ring-4 focus:ring-[#CCFF00]/20 text-[16px] font-semibold text-black placeholder-gray-400 transition-all outline-none"
             />
          </div>
        </div>
      </div>

      {/* 🚀 Category Filter Pills - 修复了滑动被截断的问题 */}
      <div className="w-full mb-12 max-w-[90rem] mx-auto">
        <div className="flex overflow-x-auto gap-3 pb-4 px-6 hide-scrollbar items-center justify-start">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-6 py-3 rounded-full text-[14px] font-bold whitespace-nowrap transition-all duration-300 border-2 ${activeCategory === 'all' ? 'bg-[#111] text-[#CCFF00] border-[#111]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            {globalLang === 'cn' ? '全部工作流' : 'All Workflows'}
          </button>
          
          <button
            onClick={() => setActiveCategory('favorites')}
            className={`shrink-0 px-6 py-3 rounded-full text-[14px] font-bold whitespace-nowrap transition-all duration-300 border-2 flex items-center gap-2 ${activeCategory === 'favorites' ? 'bg-[#111] text-[#CCFF00] border-[#111]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            <Star size={16} className={activeCategory === 'favorites' ? 'fill-[#CCFF00]' : ''} />
            {globalLang === 'cn' ? '收藏夹' : 'Favorites'}
            {favorites.length > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[11px] ${activeCategory === 'favorites' ? 'bg-[#CCFF00] text-black' : 'bg-gray-100 text-gray-500'}`}>
                {favorites.length}
              </span>
            )}
          </button>

          {promptData.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-6 py-3 rounded-full text-[14px] font-bold whitespace-nowrap transition-all duration-300 border-2 flex items-center gap-2 ${activeCategory === cat.id ? 'bg-[#111] text-[#CCFF00] border-[#111]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              {globalLang === 'cn' ? cat.nameCn : cat.nameEn}
            </button>
          ))}
          {/* 占位符：确保最后一个标签在移动端可以完全滑出，不会被切断 */}
          <div className="shrink-0 w-4"></div>
        </div>
      </div>

      {/* 🚀 Ramp Style Interactive Grid */}
      <div className="max-w-[90rem] mx-auto px-6 pb-32">
        {activeCategory === 'favorites' && currentPrompts.length > 0 && (
           <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#111]">{globalLang === 'cn' ? '我的收藏 ⭐️' : 'My Favorites ⭐️'}</h2>
           </div>
        )}

        {currentPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {currentPrompts.map((prompt, idx) => {
              const isFav = favorites.includes(prompt.title);
              return (
              <div 
                key={idx}
                className="relative w-full h-full min-h-[520px] bg-[#F4F4F5] rounded-[32px] overflow-hidden group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col"
              >
                
                {/* 背景大图标 */}
                <div className="absolute -right-10 -bottom-10 flex items-center justify-center text-gray-200/50 group-hover:scale-110 transition-transform duration-700 ease-out z-0 pointer-events-none">
                   {React.cloneElement(prompt.icon, { size: 240, strokeWidth: 1 })}
                </div>

                <div className="p-8 flex flex-col h-full z-10 relative">
                  
                  {/* 卡片头部：工具标签 & 收藏 & 标题 */}
                  <div className="mb-5 flex-shrink-0">
                     <div className="flex items-center justify-between gap-3 mb-4">
                       <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#111] bg-[#CCFF00] px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                         {prompt.tool}
                       </span>
                       <button 
                         onClick={(e) => toggleFavorite(prompt.title, e)}
                         className={`p-2 rounded-full transition-all duration-200 bg-white shadow-sm hover:scale-110 ${isFav ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                         title={globalLang === 'cn' ? '加入/取消收藏' : 'Toggle Favorite'}
                       >
                         <Star size={18} className={isFav ? 'fill-yellow-500' : ''} />
                       </button>
                     </div>
                  <h3 className="text-[22px] font-extrabold text-[#111111] leading-[1.2] tracking-tight line-clamp-2 pr-2">
                    {prompt.title}
                  </h3>
               </div>

               {/* 核心区：展示提示词正文 */}
               <div className="flex-1 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-y-auto custom-scrollbar relative">
                 <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 select-none">
                   {globalLang === 'cn' ? '提示词内容' : 'Prompt Content'}
                 </p>
                    <div className="font-mono text-[13px] leading-[1.7] text-gray-800 break-words">
                      {globalLang === 'cn' 
                        ? highlightPlaceholders(prompt.cn)
                        : highlightPlaceholders(prompt.en)
                      }
                    </div>
                  </div>

                  {/* 卡片底部：操作按钮 */}
                  <div className="mt-6 flex justify-between items-center flex-shrink-0">
                     <p className="text-[13px] text-gray-500 font-medium w-[60%] line-clamp-2">
                       {prompt.description}
                     </p>
                     <button 
                       onClick={(e) => handleCopy(globalLang === 'cn' ? prompt.cn : prompt.en, e)}
                       className="flex items-center gap-2 px-5 py-3 bg-[#111111] text-white rounded-full transition-all duration-300 ease-out cursor-pointer hover:bg-[#CCFF00] hover:text-black shadow-lg hover:shadow-[0_10px_30px_rgba(204,255,0,0.4)] active:scale-95 group/btn"
                       title="Copy Prompt"
                     >
                        <Copy size={16} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="font-bold text-[14px] hidden sm:block">
                          {globalLang === 'cn' ? '一键复制' : 'Copy'}
                        </span>
                     </button>
                  </div>
                  
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
               {activeCategory === 'favorites' ? <Star size={32} className="text-gray-400" /> : <Search size={32} className="text-gray-400" />}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeCategory === 'favorites' 
                ? (globalLang === 'cn' ? '暂无收藏' : 'No Favorites Yet')
                : (globalLang === 'cn' ? '未找到相关工作流' : 'No workflows found')}
            </h3>
            <p className="text-gray-500 mt-3 font-medium text-lg">
              {activeCategory === 'favorites' 
                ? (globalLang === 'cn' ? '点击提示词卡片上的星形图标进行收藏。' : 'Click the star icon on any prompt to save it here.')
                : (globalLang === 'cn' ? '请尝试调整您的搜索关键词。' : 'Try adjusting your search terms.')}
            </p>
          </div>
        )}
      </div>

      {/* 🚀 Sleek Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-6 fade-in duration-300">
          <div className="bg-[#111111] text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center space-x-3 border border-gray-800">
            <CheckCircle2 size={20} className="text-[#CCFF00]" strokeWidth={2.5} />
            <span className="font-bold text-[15px] tracking-wide">{toast}</span>
          </div>
        </div>
      )}

      {/* Custom Styles for scrollbars and price slider */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E4E4E7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #D4D4D8;
        }
      `}} />
      
    </div>
  );
};

export default App;
