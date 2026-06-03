/* ============================================================
 * DrinkTi · 256→136 对全量特调矩阵（按字母序去重）
 * 
 * typeA + typeB 的 key 已按字母序排序，保证对称性。
 * 共 136 个无序对：16 个同型 + 120 个异型
 * ============================================================ */

const PAIR_MATRIX = {

  // ==========================================
  // diff = 0（完全相同）16 对
  // ==========================================
  "ENFJ+ENFJ": { name:"玫瑰双盏",  subtitle:"Twin Roses",     notes:"两杯玫瑰拿铁并肩,花香加倍却不抢戏。你们是同一张歌单的 A 面 B 面,默契到不用说话。", compat:96 },
  "ENFP+ENFP": { name:"气泡狂欢",  subtitle:"Double Fizz",    notes:"两杯桃子气泡碰在一起,泡沫能漫到天花板上。你们的快乐会传染,但也容易一起忘记 deadline。", compat:96 },
  "ENTJ+ENTJ": { name:"双黑风暴",  subtitle:"Black Storm",    notes:"两个指挥官同时下命令的场面。效率爆表,但建议分好地盘,不然抢方向盘的时候会翻车。", compat:96 },
  "ENTP+ENTP": { name:"薄荷双旋",  subtitle:"Mint Twister",   notes:"两杯莫吉托的薄荷叶叠在一起,脑子转速翻倍,聊到凌晨三点还在换话题。创造力拉满,执行力随缘。", compat:96 },
  "ESFJ+ESFJ": { name:"温酒对酌",  subtitle:"Warm Together",  notes:"你们是最会照顾人的组合,但两个人都忙着照顾对方的时候,水壶永远没人添。记得轮流当被宠的那个。", compat:96 },
  "ESFP+ESFP": { name:"果味派对",  subtitle:"Fruity Party",   notes:"全场最亮的两个人坐在一起,笑声能从一楼传到三楼。但散场之后,总需要有个人先买单。", compat:96 },
  "ESTJ+ESTJ": { name:"美式双杯",  subtitle:"Double Americano",notes:"两杯美式不加糖不加奶,执行力双倍,决策速度三倍。效率很高,但温柔这种东西得单独点单。", compat:96 },
  "ESTP+ESTP": { name:"龙舌并饮",  subtitle:"Shot For Two",   notes:"两杯龙舌兰同时闷,肾上腺素加倍。很爽,很刺激,但记得明天还要上班,别一起上头。", compat:96 },
  "INFJ+INFJ": { name:"可可双温",  subtitle:"Cocoa Duet",     notes:"两杯热可可暖着双手,对视一笑,世界安静下来。你们懂彼此的沉静,但有时候也需要有人先打开话匣子。", compat:96 },
  "INFP+INFP": { name:"抹茶对饮",  subtitle:"Matcha Pair",    notes:"两杯抹茶拿铁,苦和甜的比例惊人一致。你们的浪漫是共通的,但房租不能靠诗意来交——互相提醒一下现实。", compat:96 },
  "INTJ+INTJ": { name:"双倍回响",  subtitle:"Double Echo",    notes:"你们是同一种饮料的两次倒酒。彼此理解到几乎不需要解释,但也容易陷入同一种盲区。", compat:96 },
  "INTP+INTP": { name:"金汤双倍",  subtitle:"Double G&T",     notes:"两个分析引擎同时运转,逻辑缜密到让人头皮发麻。唯一的问题是——没人负责把结论告诉外面的人。", compat:96 },
  "ISFJ+ISFJ": { name:"豆浆双暖",  subtitle:"Warm Soy Duet",  notes:"两个最靠谱的人坐在一起,默默把所有人的需求都记在心里。建议偶尔也列一张 \"我需要什么\" 的清单。", compat:96 },
  "ISFP+ISFP": { name:"椰子双清",  subtitle:"Twin Coconuts",  notes:"两个不愿打扰别人的人,相处起来反而是最舒服的安静。审美同频,节奏一致,只是有时候太过佛系,连出门都需要对方推一把。", compat:96 },
  "ISTJ+ISTJ": { name:"矿泉双净",  subtitle:"Pure Double",    notes:"两瓶矿泉水放在桌上,不抢眼但最稳。计划×计划=超级计划,你们的靠谱程度大概能让不靠谱的人汗颜。", compat:96 },
  "ISTP+ISTP": { name:"苏打双冰",  subtitle:"Chilled Duo",    notes:"两杯苏打水加冰,干净利落到极致。动手能力双倍,社交意愿减半,刚好凑成一个完整的不需要说话就能修好一切的小队。", compat:96 },

  // ==========================================
  // diff = 1（一个维度不同）→ 120 对中约 44 对
  // ==========================================

  /* ---- ENFJ 列为 A ---- */
  "ENFJ+ENFP": { name:"玫桃子",  subtitle:"Peach Rose",     notes:"玫瑰的优雅撞上桃子的跳脱,一个负责体面,一个负责活跃。你们站在一起,别人会问:这是什么神仙甜品组合？", compat:86 },
  "ENFJ+ENTJ": { name:"玫咖序章",  subtitle:"Rose & Black",   notes:"玫瑰拿铁和黑咖啡,一个想温暖世界,一个想改变世界。方向不同但目标都是让生活变得更好,可以联手。", compat:86 },
  "ENFJ+ESFJ": { name:"玫红酒缘",  subtitle:"Rose & Wine",    notes:"一个花香一个果香,都擅长营造温暖的气氛。你们的聚会操盘能力联手,大概没有冷场这件事。", compat:86 },
  "ENFJ+ESFP": { name:"玫果之光",  subtitle:"Rose Fruit Fizz",notes:"两个照亮全场的存在,一个用温度,一个用笑声。观众会以为你们排练过,其实只是天生的吸引力刚好配对。", compat:86 },
  "ENFJ+ESTJ": { name:"玫式法则",  subtitle:"Rose Law",      notes:"玫瑰的柔软和美式的硬朗,一个想润物无声,一个要开门见山。偶尔摩擦,但都出于想把事情做好的本心。", compat:86 },
  "ENFJ+INFJ": { name:"玫可对饮",  subtitle:"Rose & Cocoa",  notes:"外向版和内敛版的灵魂伴侣。你把温柔洒向人群,她把温柔装在一杯可可里。回家的路上,彼此是最好的支撑。", compat:86 },
  "ENFJ+INFP": { name:"玫抹心语",  subtitle:"Rose Matcha",   notes:"一个是春风,一个是细雨。你用温度把她的细腻唤醒,她用诗意把你的忙碌暂停——不多不少刚刚好。", compat:86 },
  "ENFJ+INTJ": { name:"玫威交响",  subtitle:"Rose Whisky",  notes:"你的热忱是她眼里的光,她的深邃是你偶尔需要的锚。一个飞得太高时,另一个把人拉回来喝口水。", compat:86 },
  "ENFJ+ISFJ": { name:"玫浆低语",  subtitle:"Rose Soy",      notes:"玫瑰的芬芳和豆浆的朴实,出门是焦点,回家是彼此。你们都在用不同的方式说同一句话:我在这里。", compat:86 },
  "ENFJ+ISFP": { name:"玫椰清风",  subtitle:"Rose Coconut",  notes:"一个盛放一个清雅。你带她走进人群时,她在一旁的安静反而让所有人都想认识她。", compat:86 },
  "ENFJ+ISTJ": { name:"玫泉稳重",  subtitle:"Rose Water",    notes:"玫瑰的热闹和矿泉的稳重,看似两端,但你缺他那种踏实,他缺你那种温度。刚好。", compat:86 },

  /* ---- ENFP 列为 A ---- */
  "ENFP+ENTP": { name:"桃莫旋风",  subtitle:"Peach Mojito",   notes:"两个脑洞最大的人坐一起,对话能从地外文明聊到泡面配方。很兴奋但也容易两个人都忘了说完结论。", compat:86 },
  "ENFP+ESFJ": { name:"桃酒派对",  subtitle:"Peach Wine",     notes:"一个负责点火,一个负责续火。你们的聚会策划案如果写出来,大概可以卖给活动公司。", compat:86 },
  "ENFP+ESFP": { name:"桃果泡泡",  subtitle:"Double Bubble",  notes:"全场最亮的双人组,但能不能有人管一下流程？笑到停不下来的时候,记忆也会跟着断片。", compat:86 },
  "ENFP+ESTP": { name:"桃舌上膛",  subtitle:"Peach Shot",    notes:"桃子气泡加了龙舌兰,甜中带烈。你们的快乐很纯粹,但偶尔需要有人按一下暂停键。", compat:86 },
  "ENFP+INFJ": { name:"桃可夜话",  subtitle:"Peach Cocoa",   notes:"你是撒向世界的阳光碎片,她是接住你的人。你不需要一直发光,在她面前做一罐没气的汽水也可以。", compat:86 },
  "ENFP+INFP": { name:"桃抹小诗",  subtitle:"Peach Matcha",  notes:"一个外向做梦,一个内向写诗。你们的灵感会互相传染,需要注意的只有:下个月的房租交了吗？", compat:86 },
  "ENFP+INTJ": { name:"桃威对流",  subtitle:"Peach & Peat",  notes:"桃子的甜和威士忌的烈,一冷一热。她帮你把乱麻捋直,你帮她把世界涂上颜色。经典搭配。", compat:86 },
  "ENFP+ISFJ": { name:"桃浆靠岸",  subtitle:"Peach Soy",     notes:"汽水冒泡累了,豆浆刚好温着。他的怀抱是你在所有冒险之后,最想回去的地方。", compat:86 },
  "ENFP+ISFP": { name:"桃椰吹风",  subtitle:"Peach Coconut",  notes:"两个活在当下的人,一个是夏天的冰桃子,一个是海边的椰子。在一起的时间流速会放慢,很舒服。", compat:86 },
  "ENFP+ISTJ": { name:"桃泉固基",  subtitle:"Peach Water",   notes:"你的灵魂需要一个锚,他需要一个风筝。你让他看见天上有云,他让你记得脚下有地。", compat:86 },

  /* ---- ENTJ 列为 A ---- */
  "ENTJ+ENTP": { name:"咖莫棋局",  subtitle:"Black & Mint",   notes:"一个是将军一个是军师。你指挥,他出奇招。合作起来天下无敌,就是有时候方向对不上频道。", compat:86 },
  "ENTJ+ESFJ": { name:"咖红酒话",  subtitle:"Black & Spice",  notes:"黑咖啡加肉桂,执行力配上人情味。你管方向,她管团队,稳。就是开会时一个要结论一个要气氛。", compat:86 },
  "ENTJ+ESTJ": { name:"咖式并进",  subtitle:"Double Black",   notes:"两杯黑系饮品碰在一起,效率翻倍,但温柔依旧缺席。需要雇一个 INFJ 来当氛围组。", compat:86 },
  "ENTJ+ESTP": { name:"咖龙对决",  subtitle:"Bold & Fire",   notes:"指挥官遇上冒险家,目标一致行动力拉满。唯一的问题是你们都想当开车的那一个。", compat:86 },
  "ENTJ+INFJ": { name:"咖可相照",  subtitle:"Black & Cocoa",  notes:"你的决断力是她需要的靠山,她的洞察力是你忽略的盲区。一刚一柔,恰好互补。", compat:86 },
  "ENTJ+INTP": { name:"咖金解法",  subtitle:"Black & Tonic",  notes:"一个要行动一个要推理。你负责执行,他负责推翻。争论很激烈,但最终方案非常好。", compat:86 },
  "ENTJ+INTJ": { name:"咖威经纬",  subtitle:"Black & Peat",  notes:"两个战略家坐在一起,未来十年已经规划好了。效率骇人,但偶尔也聊聊天气吧。", compat:86 },
  "ENTJ+ISFJ": { name:"咖浆稳锚",  subtitle:"Black & Soy",   notes:"你需要她的默默支撑,她需要你的坚定方向。一个在前面冲锋,一个在后面扫雷,完美分工。", compat:86 },
  "ENTJ+ISTJ": { name:"咖泉铁盟",  subtitle:"Black & Water",  notes:"两个执行力怪兽,合作就是一台精密的机器。不浪漫但可靠——在这个世界已经很难得了。", compat:86 },

  /* ---- ENTP 列为 A ---- */
  "ENTP+ESFJ": { name:"莫红酒辩",  subtitle:"Mojito & Wine",  notes:"一个负责提出天马行空的点子,一个负责把人叫来一起试。搭配很好,就是有时候你把她绕晕了。", compat:86 },
  "ENTP+ESFP": { name:"莫果燃场",  subtitle:"Mint & Fruit",   notes:"两个即兴表演大师,不用剧本也能热闹一下午。缺点是没有剧本这件事,到了 deadline 也会继续保持。", compat:86 },
  "ENTP+ESTJ": { name:"莫式框架",  subtitle:"Mint & Ameri",   notes:"你需要他的条理,他需要你的灵感。一个搭架子,一个往上甩创意——看起来像在吵,其实是在共建。", compat:86 },
  "ENTP+ESTP": { name:"莫舌奔袭",  subtitle:"Mint & Shot",   notes:"你们是那种说走就走的人,最好别一起做重大决定,因为两个人兴奋起来什么都写得上去。但爽。", compat:86 },
  "ENTP+INFJ": { name:"莫可电波",  subtitle:"Mint & Cocoa",  notes:"一个发射,一个接收。深夜时分对方都听得到,但说出口的不多。最珍贵的那种默契。", compat:86 },
  "ENTP+INFP": { name:"莫抹灵光",  subtitle:"Mint & Matcha",  notes:"你的脑洞配上她的诗意,创意会爆炸。但是爆炸之后需要有人打扫战场——建议轮流当那个人。", compat:86 },
  "ENTP+INTJ": { name:"莫威对弈",  subtitle:"Mint & Peat",   notes:"头脑风暴 VS 深度思考。你可能让她皱眉,她可能让你闭嘴,但风暴平息之后的方案无可挑剔。", compat:86 },
  "ENTP+INTP": { name:"莫金双思",  subtitle:"Mint & Tonic",   notes:"两个 Ti 雷达同时开,理论深度直冲云霄。争议点在于谁的理论更对——其实都对,角度不同。", compat:86 },
  "ENTP+ISFP": { name:"莫椰随性",  subtitle:"Mint & Coconut", notes:"你负责不停换新花样,她负责在一旁安静地看你换。欣赏但不跟随,刚好你也需要观众。", compat:86 },

  /* ---- ESFJ 列为 A ---- */
  "ESFJ+ESFP": { name:"红酒果香",  subtitle:"Wine & Fruit",   notes:"你负责让每个人都自在,她负责让每个人都笑。聚会里最暖心的两位,但散场后记得留一点时间给彼此。", compat:86 },
  "ESFJ+ESTJ": { name:"红酒美式",  subtitle:"Wine & Ameri",  notes:"温暖遇上效率,把聚会的后勤做到极致。别人在玩的时候,你们已经在确认下个环节了——有点辛苦但安心。", compat:86 },
  "ESFJ+ESTP": { name:"红酒烈酒",  subtitle:"Wine & Shot",   notes:"你的温度能让他稍微慢下来,他的直率能让你放下客气。一起的时候双方都更真实了。", compat:86 },
  "ESFJ+INFJ": { name:"红酒可可",  subtitle:"Wine & Cocoa",  notes:"你是把温暖端出来的人,她是在角落里感受你温暖的人。你们的默契在于:都知道温暖这个东西值多少钱。", compat:86 },
  "ESFJ+INFP": { name:"红酒抹茶",  subtitle:"Wine & Matcha",  notes:"你把人聚在一起,她把那一刻的美好记录下来。你用行动说爱,她用文字说爱,刚刚好。", compat:86 },
  "ESFJ+INTJ": { name:"红酒威士忌", subtitle:"Wine & Whisky", notes:"你的温度消解了她的冷,她的深度让你觉得这个世界还有人在认真思考更远的事。", compat:86 },
  "ESFJ+ISFJ": { name:"红酒豆浆",  subtitle:"Wine & Soy",    notes:"两个最会照顾别人的人。你们在一起的时候,终于可以不用照顾任何人了——记得把手机静音。", compat:86 },
  "ESFJ+ISFP": { name:"红酒椰风",  subtitle:"Wine & Coconut", notes:"你张罗一切,她在一旁静静感受。她让你慢下来,你让她热闹起来——都在给彼此最缺的东西。", compat:86 },
  "ESFJ+ISTJ": { name:"红酒矿泉",  subtitle:"Wine & Water",   notes:"温暖加稳定,你们是朋友圈里的定心丸。活动交给你,细节交给他——加起来就是完美。", compat:86 },

  /* ---- ESFP 列为 A ---- */
  "ESFP+ESTJ": { name:"果式节拍",  subtitle:"Fruit & Ameri",  notes:"你是气氛组,他是纪律组。你让他笑起来,他让你别笑过头。吵吵闹闹但谁也离不开谁。", compat:86 },
  "ESFP+ESTP": { name:"果龙齐燃",  subtitle:"Fruit & Tequila",notes:"快乐加倍,风险也加倍。你们是人生体验派的最佳拍档,但要提醒自己:体验完了记得复盘。", compat:86 },
  "ESFP+INFJ": { name:"果可心照",  subtitle:"Fruit & Cocoa",  notes:"你是阳光她是月光,交替的时候最美。她在你安静下来的瞬间,听见了你平时不让别人听见的话。", compat:86 },
  "ESFP+INFP": { name:"果抹心晴",  subtitle:"Fruit & Matcha", notes:"一个用笑声发光,一个用安静发光。她把你拉回内心的世界,你把她带到外面的世界——两个人都赚了。", compat:86 },
  "ESFP+INTJ": { name:"果威反差",  subtitle:"Fruit & Whisky", notes:"看起来不可能的组合,但她需要你的快乐来提醒她世界不只有逻辑。而你有时也需要一个人说:这个方案行不通。", compat:86 },
  "ESFP+ISFJ": { name:"果浆温存",  subtitle:"Fruit & Soy",    notes:"热闹后的那一杯豆浆最好喝。你在外面撒完电量,回到他身边充电——最可靠的那种关系。", compat:86 },
  "ESFP+ISFP": { name:"果椰共感",  subtitle:"Fruit & Coconut",notes:"两个感受派,情绪的流动不需要翻译。在一起就是最好的假期,但没人提醒的时候就容易假期无限延长。", compat:86 },
  "ESFP+ISTJ": { name:"果泉护岸",  subtitle:"Fruit & Water",  notes:"你是海浪他是堤岸。你的每一次情绪涨落他都在旁边站着,不一定会下水,但一定不会让你被卷走。", compat:86 },

  /* ---- ESTJ 列为 A ---- */
  "ESTJ+ESTP": { name:"美龙出击",  subtitle:"Ameri & Shot",   notes:"两个行动派,一个做计划一个开冲。合作起来效率高到吓人,但建议先签好合资协议免得翻脸。", compat:86 },
  "ESTJ+INFJ": { name:"美可静会",  subtitle:"Ameri & Cocoa",  notes:"你的逻辑和她的直觉,讨论起来像两个不同维度的生物在对话。但奇怪的是结论常常一致。", compat:86 },
  "ESTJ+INFP": { name:"美抹对白",  subtitle:"Ameri & Matcha", notes:"一个是执行手册,一个是一首诗。你觉得她在做梦,她觉得你太无趣,但各自的世界都需要对方的视角。", compat:86 },
  "ESTJ+INTJ": { name:"美威架构",  subtitle:"Ameri & Whisky", notes:"你和她的战术配合堪称完美。一个管执行一个管战略——分工明确,效率无上限。", compat:86 },
  "ESTJ+INTP": { name:"美金逻辑",  subtitle:"Ameri & Tonic",   notes:"一个负责落地一个负责质疑。你会觉得他很慢,他会觉得你欠思考——但其实都对,只是速度不一样。", compat:86 },
  "ESTJ+ISFJ": { name:"美浆实基",  subtitle:"Ameri & Soy",    notes:"你是制度派,她是温情派。表面可能摩擦,但本质上都是想把事情做好。加上一点耐心,这个组合很强。", compat:86 },
  "ESTJ+ISFP": { name:"美椰旁听",  subtitle:"Ameri & Coconut",notes:"你忙你的,她在一旁安静地待着。你问她为什么不参与,她说看着你就够了。有点甜。", compat:86 },
  "ESTJ+ISTJ": { name:"美泉双稳",  subtitle:"Ameri & Water",  notes:"稳定 × 稳定 = 超级稳定。你们的组合是朋友圈里的定海神针,但也要留点空间让惊喜发生。", compat:86 },

  /* ---- ESTP 列为 A ---- */
  "ESTP+INFJ": { name:"龙可狂想",  subtitle:"Shot & Cocoa",   notes:"烈酒和热可可——看起来就不该倒进一个杯子,但偏偏有人试了,发现又刺激又暖。那就是你们。", compat:86 },
  "ESTP+INFP": { name:"龙抹激撞",  subtitle:"Shot & Matcha",  notes:"你的冒险精神和她的内心世界,怎么搅在一块？不知道,但每次搅完都有新鲜事发生。", compat:86 },
  "ESTP+INTJ": { name:"龙威奇兵",  subtitle:"Shot & Whisky",  notes:"你是她的破格方案,她是你的战略地图。一个负责开火一个负责瞄准,搭配起来无敌。", compat:86 },
  "ESTP+INTP": { name:"龙金棋手",  subtitle:"Shot & Tonic",   notes:"行动派遇上理论派。你干她分析,你跑太快的时候她会发来一段很长的分析让你停下来——其实有用的。", compat:86 },
  "ESTP+ISFJ": { name:"龙浆守护",  subtitle:"Shot & Soy",     notes:"你是冒险故事里那个冲在最前面的人,她是你在冒险路上埋补给的人。你无所畏惧,因为她让你有后路。", compat:86 },
  "ESTP+ISFP": { name:"龙椰随行",  subtitle:"Shot & Coconut",  notes:"一起说走就走,她负责看风景你负责找刺激。节奏各自不同的旅伴,但终点一到都觉得很值。", compat:86 },
  "ESTP+ISTJ": { name:"龙泉两翼",  subtitle:"Shot & Water",   notes:"冲动和克制,你们互为对方的刹车和油门。少了对方都会翻,有了彼此反而跑得最稳。", compat:86 },

  /* ---- INFJ 列为 A ---- */
  "INFJ+INFP": { name:"可抹静约",  subtitle:"Cocoa & Matcha", notes:"你们在安静中交换了整个世界。她是诗人,你是听诗的人;你是火炉,她是靠近炉火的人。", compat:86 },
  "INFJ+INTJ": { name:"可威洞察",  subtitle:"Cocoa & Whisky", notes:"两个看穿本质的人,一个用直觉一个用逻辑。不需要多解释,一个眼神就知道对方想到了什么。", compat:86 },
  "INFJ+INTP": { name:"可金对话",  subtitle:"Cocoa & Tonic",  notes:"你的直觉是对他逻辑的补充,他的分析是对你情绪的厘清。深夜聊天,永远不嫌晚。", compat:86 },
  "INFJ+ISFJ": { name:"可浆双暖",  subtitle:"Cocoa & Soy",    notes:"两股安静的力量。你负责理解,她负责照顾——你们的存在本身就是别人安心的理由。", compat:86 },
  "INFJ+ISFP": { name:"可椰同感",  subtitle:"Cocoa & Coconut",notes:"静默中的连接最深。你们一个感受深刻,一个感知丰富,不说话也能交换一整天的情绪。", compat:86 },
  "INFJ+ISTJ": { name:"可泉互映",  subtitle:"Cocoa & Water",  notes:"直觉和规则,看起来不相干,但你需要她的踏实,她需要你的远见。互补得很工整。", compat:86 },
  "INFJ+ISTP": { name:"可打静默",  subtitle:"Cocoa & Soda",   notes:"一个深不见底一个干净利落。交流不多但质量极高。那句简单的 \"嗯\" 里面装了很多。", compat:86 },

  /* ---- INFP 列为 A ---- */
  "INFP+INTJ": { name:"抹威诗章",  subtitle:"Matcha & Peat",  notes:"你的柔软是她的铠甲,她的逻辑是你的灯塔。她帮你把乱麻理清,你让她看到世界的温度。", compat:86 },
  "INFP+INTP": { name:"抹金头脑",  subtitle:"Matcha & Tonic",  notes:"一个沉迷于感受,一个沉迷于逻辑。你们的对话常常牛头不对马嘴,但对方就是能听进去。", compat:86 },
  "INFP+ISFJ": { name:"抹浆共情",  subtitle:"Matcha & Soy",   notes:"两个默默付出的人,温柔叠加,大概是全世界最不容易吵架的组合。唯一的问题是没有人先发脾气。", compat:86 },
  "INFP+ISFP": { name:"抹椰慢日",  subtitle:"Matcha & Coconut",notes:"诗人和旅者,一起去城市边缘看日落,不说话但都觉得这个下午很值。慢下来的生命才是真的。", compat:86 },
  "INFP+ISTJ": { name:"抹泉支架",  subtitle:"Matcha & Water",  notes:"你的梦需要他的结构来撑住,他的规律需要你的诗意来调味。不同但不伤害,刚好补上。", compat:86 },
  "INFP+ISTP": { name:"抹打间奏",  subtitle:"Matcha & Soda",  notes:"你沉浸在内心世界,他专注于眼前的事。平行但不疏离,偶尔抬头看一眼就知道对方还在。", compat:86 },

  /* ---- INTJ 列为 A ---- */
  "INTJ+INTP": { name:"威金思辨",  subtitle:"Peat & Tonic",   notes:"两个思想家,一个偏系统一个偏框架。对外是高冷的,对内是可以聊到天亮的——如果天亮前没吵起来的话。", compat:86 },
  "INTJ+ISFJ": { name:"威浆庇护",  subtitle:"Peat & Soy",     notes:"你的冷需要她的暖来中和,她的付出需要你的远见来引导。你们都在用自己的方式守护一段关系。", compat:86 },
  "INTJ+ISFP": { name:"威椰留白",  subtitle:"Peat & Coconut",  notes:"你觉得她在浪费时间,她觉得你活得太累。都对,但偶尔换换节奏——她的慢让你不崩,你的快让她不废。", compat:86 },
  "INTJ+ISTJ": { name:"威泉稳态",  subtitle:"Peat & Water",    notes:"战略家和执行者,没人比你们更靠谱。一起做项目是降维打击,做朋友是互相给对方减负。", compat:86 },
  "INTJ+ISTP": { name:"威打极简",  subtitle:"Peat & Soda",    notes:"都嫌废话多,都讨厌效率低。一声 \"嗯\",一杯酒,大概就是你们最舒适的社交了。", compat:86 },

  /* ---- INTP 列为 A ---- */
  "INTP+ISFJ": { name:"金浆互译",  subtitle:"Tonic & Soy",    notes:"逻辑和温情,是你永远需要翻译的一门语言。她帮你翻译给你自己听,你帮她把她不敢说的逻辑化。", compat:86 },
  "INTP+ISFP": { name:"金椰旁观",  subtitle:"Tonic & Coconut", notes:"你的头脑风暴她不一定参与,但她会在旁边安静地泡茶。你不需要反馈,她不需要解释。", compat:86 },
  "INTP+ISTJ": { name:"金泉体系",  subtitle:"Tonic & Water",   notes:"理论和实践的对撞。他让你别飘,你让他别僵,吵完之后通常能搞出一个又合理又创新的方案。", compat:86 },
  "INTP+ISTP": { name:"金沙静合",  subtitle:"Tonic & Soda",   notes:"两个不喜欢说话的人碰到一起,沉默也很舒服。你负责深度分析,他负责动手实现——配合很默契。", compat:86 },

  /* ---- ISFJ 列为 A ---- */
  "ISFJ+ISFP": { name:"浆椰温柔",  subtitle:"Soy & Coconut",  notes:"你们是全世界最让人安心的组合。一个照顾日常一个记录美好,生活在一起就是一首静静的诗。", compat:86 },
  "ISFJ+ISTJ": { name:"浆泉恒温",  subtitle:"Soy & Water",    notes:"可靠加倍,温暖加倍。你们是彼此在这个喧嚣世界里的防空洞,进到里面就不用再假装强大。", compat:86 },
  "ISFJ+ISTP": { name:"浆打默契",  subtitle:"Soy & Soda",     notes:"你默默做很多,他默默记在心里。不需要夸,不需要谢——一杯茶放在桌上,就说明了一切。", compat:86 },

  /* ---- ISFP 列为 A ---- */
  "ISFP+ISTJ": { name:"椰泉和鸣",  subtitle:"Coconut & Water", notes:"一个活在当下,一个关注长远,但你们都不会强迫对方改变。你的松弛是他学不会的功课。", compat:86 },
  "ISFP+ISTP": { name:"椰打无扰",  subtitle:"Coconut & Soda",  notes:"你们的相处模式就是:你画画,他修东西。同一个房间,两张桌子,一个下午。文明的最佳形态。", compat:86 },

  /* ---- ISTJ 列为 A ---- */
  "ISTJ+ISTP": { name:"泉打精工",  subtitle:"Water & Soda",    notes:"一个规划全局,一个专注细节。你的计划让他知道方向,他的手艺让你放心执行——好团队。", compat:86 },

  // ==========================================
  // diff = 2 → 需要生成所有剩余对
  // ==========================================
  // 以下按字母序自动补全 diff=2 的对（共约 43 对）

  "ENFJ+ENTP": { name:"玫莫奇趣",  subtitle:"Rose & Mint",     notes:"温柔的规划者和跳脱的辩论家,一个建桥一个跳桥。不是你追她,就是她等你——动态平衡。", compat:75 },
  "ENFJ+ESTP": { name:"玫龙胆色",  subtitle:"Rose & Shot",    notes:"优雅遇上野性,一个想办晚宴一个想去跳伞。你们的生活菜单差异很大,但谁说不可以同一天点两桌菜？", compat:75 },
  "ENFJ+INTP": { name:"玫金理想",  subtitle:"Rose & Tonic",   notes:"你的温暖是他不擅长表达的领域,他的逻辑是你感情用事时的清醒剂。异质但互补。", compat:75 },
  "ENFJ+ISTP": { name:"玫打静水",  subtitle:"Rose & Soda",    notes:"玫瑰花丛里的工具箱。你觉得他很酷,他觉得你很吵——但酷和吵在一起的时候刚好不无聊。", compat:75 },
  "ENFP+ESTJ": { name:"桃式公差",  subtitle:"Peach & Ameri",  notes:"灵感炸弹遇上制度手册,火花四溅。你觉得她死板,她觉得你浮躁——但项目需要你们两个同时出场。", compat:75 },
  "ENFP+INTP": { name:"桃金迷宫",  subtitle:"Peach & Tonic",  notes:"你的脑洞配上她的分析力,能造出世界上最精密的幻想世界。但如果没人画地图,会一直在里面迷路。", compat:75 },
  "ENFP+ISTP": { name:"桃打光点",  subtitle:"Peach & Soda",   notes:"你有很多想分享的事,他就回一个 \"嗯\"。你觉得敷衍,但其实那是他的最高评价——愿意听。", compat:75 },
  "ENTJ+ESFP": { name:"咖果同台",  subtitle:"Black & Fruit",  notes:"你管战略她管气氛,一个导航一个开车。适合一起搞活动,但私下相处需要你偶尔关掉日程表。", compat:75 },
  "ENTJ+INFP": { name:"咖抹和鸣",  subtitle:"Black & Matcha", notes:"一把剑和一首诗。你不知道她在想什么,她不知道你为什么那么急,但彼此的世界都想看看。", compat:75 },
  "ENTJ+ISFP": { name:"咖椰并坐",  subtitle:"Black & Coconut",notes:"一个永远在赶路,一个永远在散步。你嫌她慢,但只有在她旁边你才会发现路边的花是开着的。", compat:75 },
  "ENTJ+ISTP": { name:"咖打锋线",  subtitle:"Black & Soda",   notes:"指挥官和独行侠。他不爱被指挥,你也懒得管他——奇怪的是不用指挥反而合作得最好。", compat:75 },
  "ENTP+ISFJ": { name:"莫浆暖流",  subtitle:"Mint & Soy",     notes:"你的奇思妙想她是第一个听众,听完之后她会默默帮你把落地步骤列好。你觉得她太乖,但其实她在偷偷爱你。", compat:75 },
  "ENTP+ISTJ": { name:"莫泉棋谱",  subtitle:"Mint & Water",   notes:"自由和秩序的碰撞。你觉得他是清单狂魔,他觉得你是脱缰野马——但只有有缰绳,野马才跑得更远。", compat:75 },
  "ESFJ+INTP": { name:"红酒金汤",  subtitle:"Wine & Tonic",   notes:"你的温度是他无法模拟的东西,他的洞察是你偶尔需要的冷静。看似不搭,但一个拥抱就能解决所有分析。", compat:75 },
  "ESFJ+ISTP": { name:"红酒苏打",  subtitle:"Wine & Soda",    notes:"最会照顾人的人遇到最不需要照顾的人。他让你发现:不用照顾人也是一种和人的深度相处。", compat:75 },
  "ESFP+INTP": { name:"果金聚光",  subtitle:"Fruit & Tonic",  notes:"你的热闹他不一定加入,但他会在一旁用逻辑帮你分析为什么大家的笑点都卡在那个时间——这种关注本身就很甜。", compat:75 },
  "ESFP+ISTP": { name:"果打飞驰",  subtitle:"Fruit & Soda",   notes:"一起说做就做,做完就忘,忘了再找新的事做。短期合作关系极佳,长期的话需要有人记一下纪念日。", compat:75 },
  "ESTJ+ISTP": { name:"美打实测",  subtitle:"Ameri & Soda",   notes:"计划和动手能力双管齐下。一个写流程,一个执行。但别在流程里夹太多啰嗦,他会直接跳过。", compat:75 },
  "ESTP+ISFJ": { name:"龙浆后盾",  subtitle:"Shot & Soy",     notes:"你的冒险他可能不参与,但他会把你的备用钥匙收好,在你迷路的时候问你要不要开门。", compat:75 },
  "ESTP+ISTP": { name:"龙打双冲",  subtitle:"Shot & Soda",    notes:"两个行动派,说干就干,干完就沉默。不需要多说的那种默契——但有时候需要有人提醒回家。", compat:75 },
  "INFJ+INTP": { name:"可金深谈",  subtitle:"Cocoa & Tonic",  notes:"直觉+逻辑=什么都能聊。凌晨三点的聊天记录可以出一本哲学随笔集,但第二天还是要早起上班。", compat:75 },
  "INFJ+ISTP": { name:"可打留白",  subtitle:"Cocoa & Soda",   notes:"你的深邃他不一定理解,但他在旁边的时候你莫名感到安全。不需要懂,只需要在。", compat:75 },
  "INFP+ISTP": { name:"抹打清欢",  subtitle:"Matcha & Soda",  notes:"诗人遇上工匠。她写诗的时候他在修柜子,两个世界平行运行但有一种奇怪的和谐。", compat:75 },
  "INTJ+ISFP": { name:"威椰静处",  subtitle:"Peat & Coconut",  notes:"战略家的书房里插了一瓶椰子。你觉得无用,她觉得美,但美本身就是你计划里缺失的那一页。", compat:75 },
  "INTP+ISFP": { name:"金椰旁观",  subtitle:"Tonic & Coconut", notes:"你在脑子里构造世界,她在你旁边画世界。同一种安静,两种表达——不需要对话但心照不宣。", compat:75 },
  "ISFJ+ISTP": { name:"浆打默守",  subtitle:"Soy & Soda",     notes:"你默默为他准备好所有东西,他默默把你准备的所有东西都用上。这就是你们沟通的方式。", compat:75 },
  "ISFP+ISTP": { name:"椰打双栖",  subtitle:"Coconut & Soda", notes:"一起在海边躺着,一个听浪,一个修补船。各忙各的,但偶尔交换一个眼神就知道:这趟没白来。", compat:75 },

  // ---- diff=2 中之前漏掉的对（按字母序补全）----
  "ENFP+INFJ": { name:"桃可夜话", subtitle:"Peach & Cocoa", notes:"一个发射光芒,一个收集光芒。她说故事的时候你在听,你沉默的时候她懂了。", compat:75 },
  "ENFP+ENTJ": { name:"桃咖接力", subtitle:"Peach & Black", notes:"阳光遇上风暴,一个给人打气,一个给事情定调。你需要她的决断,她需要你的温度。", compat:75 },
  "ENFP+INTJ": { name:"桃威对流", subtitle:"Peach & Peat", notes:"你的世界五彩斑斓,她的世界黑白分明。你带她看颜色,她帮你定坐标——理想的互补。", compat:75 },
  "ENTJ+ENTP": { name:"咖莫棋局", subtitle:"Black & Mint", notes:"统领者和战术家,一个定方向一个出奇招。方向对了就是王炸,方向错了就是两个人在不同频道演讲。", compat:75 },
  "INFJ+INTJ": { name:"可威洞察", subtitle:"Cocoa & Whisky", notes:"两个灵魂窥视者,一个用心看,一个用脑看。知道的事太多,但只跟对方说——这是一种特权。", compat:75 },
  "ISFJ+ISFP": { name:"浆椰温柔", subtitle:"Soy & Coconut", notes:"两个温柔的守护者,一个守住日常,一个收藏美好。你的安稳是她创作的底色,她的敏感是你遗忘的角落。", compat:75 },

  // ==========================================
  // diff = 3（三个维度不同）→ 约 32 对
  // ==========================================
  "ENFJ+ESFP": { name:"玫果之光",  subtitle:"Rose & Fruit",   notes:"一个是优雅的推手,一个是快乐的烟火。你点亮她,她照亮你——但不要只有光,记得留影。", compat:62 },
  "ENFJ+ESTP": { name:"玫龙胆色",  subtitle:"Rose & Shot",    notes:"玫瑰和龙舌兰,一个优雅如诗一个烈如闪电。你们的差异是显性的,但对方身上有你最缺的胆量。", compat:62 },
  "ENFJ+INTP": { name:"玫金理想",  subtitle:"Rose & Tonic",   notes:"社交大师和逻辑隐身者。她帮你和世界对话,你帮她和自己对话——一个向外,一个向内,刚好闭环。", compat:62 },
  "ENFJ+ISTP": { name:"玫打静水",  subtitle:"Rose & Soda",    notes:"你负责温度,他负责效率。你觉得他冷淡,他觉得你话多,但真正需要的时候,两个人都不会缺席。", compat:62 },
  "ENFP+ESTJ": { name:"桃式公差",  subtitle:"Peach & Ameri",  notes:"创意和制度的碰撞,像往美式里倒气泡水——可能有点怪,但说不定就是下一季的爆款。", compat:62 },
  "ENFP+INTP": { name:"桃金迷宫",  subtitle:"Peach & Tonic",   notes:"跳跃的灵魂和专注的大脑。你帮她打破常规,她帮你理清线索。需要的只是多一点耐心和少一点打断。", compat:62 },
  "ENFP+ISTP": { name:"桃打光点",  subtitle:"Peach & Soda",   notes:"你的热情是他觉得最奇怪的信号,但也是最无法抗拒的。他嘴上说很吵,身体却很诚实地没有走开。", compat:62 },
  "ENTJ+ESFJ": { name:"咖红酒话",  subtitle:"Black & Spice",   notes:"效率派遇上人情派,一个看结果一个看过程。你们能在会议室吵起来,也能在散会后一起喝酒。", compat:62 },
  "ENTJ+ESFP": { name:"咖果同台",  subtitle:"Black & Fruit",   notes:"你的果断和她的感染力放一起,是演说家级别的组合。但聊天的时候需要降速:你讲方案她讲心情。", compat:62 },
  "ENTJ+INFP": { name:"咖抹和鸣",  subtitle:"Black & Matcha",  notes:"计划和诗意,是两个完全不搭的世界。但她在你身边的时候,你会突然觉得做自己就够了——不用总是前进。", compat:62 },
  "ENTJ+ISFP": { name:"咖椰并坐",  subtitle:"Black & Coconut", notes:"她是你在狂奔途中唯一会停下来看的风景。不是因为你走不动了,而是因为她太好看了。", compat:62 },
  "ENTJ+ISTP": { name:"咖打锋线",  subtitle:"Black & Soda",    notes:"指挥官遇上独行侠。你指挥不了他,但他会欣赏你的方向感。不绑在一起才是你们合作的方式。", compat:62 },
  "ENTP+ESFJ": { name:"莫红酒辩",  subtitle:"Mint & Wine",     notes:"你的脑洞需要一个落实者,她的温度需要一个挑战。你们在一起像在辩论,但辩论本身让两个人都变得更完整。", compat:62 },
  "ENTP+ESTJ": { name:"莫式框架",  subtitle:"Mint & Ameri",    notes:"创意的火和制度的冰,在玻璃杯壁上形成一层水珠。你们互不理解,但如果愿意合作,比任何一组都强。", compat:62 },
  "ENTP+ISFJ": { name:"莫浆暖流",  subtitle:"Mint & Soy",      notes:"你是放风筝的人,她是拽线的人。她在你飞得太高的时候把你拉回来,不是怕你摔,是怕你忘了还有人在等。", compat:62 },
  "ENTP+ISTJ": { name:"莫泉棋谱",  subtitle:"Mint & Water",     notes:"你讨厌框框,他帮你画框。有时候框让你长出更好的形状,有时候你想一把撕掉——哪种都对,关键看时机。", compat:62 },
  "ENTP+ISTP": { name:"莫打双驱",  subtitle:"Mint & Soda",      notes:"说服者遇上行动者。你负责构思,他负责落地——虽然落地方式和你想象的不太一样,但效果可能更好。", compat:62 },
  "ESFJ+INTP": { name:"红酒金汤",  subtitle:"Wine & Tonic",     notes:"温度遇上逻辑,像一个程序里插入了诗。你觉得他冷,她觉得你热,但冷热交替的时候刚好是人最舒服的体温。", compat:62 },
  "ESFJ+ISTP": { name:"红酒苏打",  subtitle:"Wine & Soda",      notes:"你忙着招呼所有人,他在角落安静地帮你洗杯子。你以为他没在,但其实每一杯干净的水里都有他的手。", compat:62 },
  "ESTJ+INFP": { name:"美抹对白",  subtitle:"Ameri & Matcha",   notes:"你的世界是一张 Excel,她的世界是一本诗集。你永远看不懂她的字,但你会认真帮她订装订。", compat:62 },
  "ESTJ+ISTP": { name:"美打实测",  subtitle:"Ameri & Soda",     notes:"流程和动手能力双开,效率很高但温度不够。建议偶尔停下来喝点不是咖啡的东西,聊点不是工作的话题。", compat:62 },
  "ESTP+INTP": { name:"龙金棋手",  subtitle:"Shot & Tonic",     notes:"一个说干就干,一个想完再干。你觉得她磨叽,她觉得你鲁莽——但事后复盘的时候,两个人都偷偷觉得对方说得有道理。", compat:62 },
  "ESTP+ISFJ": { name:"龙浆后盾",  subtitle:"Shot & Soy",       notes:"你是快如闪电的冒险者,她是默默守护的补给站。你不需要减速,因为她会在你需要的时候自己追上来。", compat:62 },
  "ESTP+ISTP": { name:"龙打双冲",  subtitle:"Shot & Soda",      notes:"两个行动派,一个激进一个冷静。在一起效率爆表,但独处的时候比一起的时候还多——这是默契不是疏远。", compat:62 },
  "INFJ+ISTJ": { name:"可泉互映",  subtitle:"Cocoa & Water",    notes:"远见和规则,直觉的浪漫遇上系统的严谨。她让你不迷路,你让她敢做梦。", compat:62 },
  "INFJ+ISTP": { name:"可打留白",  subtitle:"Cocoa & Soda",     notes:"你是一个深邃的湖,他是一个清澈的泉。你们之间不需要桥——湖底和泉源是连通的,只是表面平静。", compat:62 },
  "INFP+ISTJ": { name:"抹泉支架",  subtitle:"Matcha & Water",   notes:"你的梦想有了底座,他的日常有了诗意。他帮你把要做的写在纸上,你帮他把写下的读出意义。", compat:62 },
  "INFP+ISTP": { name:"抹打清欢",  subtitle:"Matcha & Soda",    notes:"她写日记他修手机,同一个空间不同的频道。不是不在一个世界,是刚好不需要翻译就可以共存。", compat:62 },

  // ==========================================
  // diff = 4（完全相反）→ 8 对
  // ==========================================
  "ENFJ+ISTP": { name:"玫打静水",  subtitle:"Rose & Soda",     notes:"一个向外释放温暖,一个向内建立秩序。你把她从壳里拉出来,她让你知道安静也可以是一种陪伴。", compat:50 },
  "ENFP+ISTJ": { name:"桃泉固基",  subtitle:"Peach & Water",   notes:"你的飘需要他的稳,他的稳需要你的暖。你们站在光谱两端,但绕一圈发现地球是圆的。", compat:50 },
  "ENTJ+ISFP": { name:"咖椰并坐",  subtitle:"Black & Coconut",  notes:"征服者和旅人。你觉得她太佛,她觉得你太卷——但佛和卷之间,有一个恰到好处的距离是互相成全。", compat:50 },
  "ENTP+ISFJ": { name:"莫浆暖流",  subtitle:"Mint & Soy",       notes:"奇思妙想和日常守护,看似没有交集,但最伟大的发明总需要有人负责供电。她是你的电源。", compat:50 },
  "ESFJ+INTP": { name:"红酒金汤",  subtitle:"Wine & Tonic",     notes:"感性和理性的顶点。你看重关系她看重真相,争端正因如此——但每一次争执都让彼此的世界变大了一圈。", compat:50 },
  "ESFP+INTJ": { name:"果威反差",  subtitle:"Fruit & Whisky",   notes:"她是派对她是图书馆,看起来不可能有任何交流。但她在你旁边安静地看完了整本书,而你对她的派对好奇了。", compat:50 },
  "ESTJ+INFP": { name:"美抹对白",  subtitle:"Ameri & Matcha",   notes:"制度和诗歌,一个要规则一个要感觉。你们不理解对方的语言,但都在用自己的方式把世界变得更好。", compat:50 },
  "ESTP+INFJ": { name:"龙可狂想",  subtitle:"Shot & Cocoa",     notes:"一个是烈酒一个是热可可。温度相反,但在一起能调出一杯谁都没喝过的东西。大胆试,不会死。", compat:50 },

  // ==========================================
  // 特殊配对（优先匹配）— 覆盖上面的默认值
  // ==========================================
  _SPECIAL: {
    "ENFP+INTJ": { name:"微醺午后", subtitle:"Tipsy Afternoon", notes:"桃子的甜香和威士忌的厚度,前调和余韵几乎来自两个世界。但当桃子需要重量,威士忌需要温度,这杯就出现了。", compat:88 },
    "ESFJ+INTP": { name:"凉茶情书", subtitle:"Cool Tea Love Letter", notes:"金汤力的距离感遇上热红酒的拥抱,温度差异制造了奇妙的张力。一个负责思考,一个负责把所有人留住。", compat:88 },
    "ENTJ+ISTJ": { name:"无糖搭子", subtitle:"Sugar-free Pair", notes:"黑咖啡和矿泉水。不浪漫,但稳。都讨厌甜腻和废话,搭档起来效率拉满。这是一杯不需要解释的组合。", compat:88 },
    "ENTP+INFJ": { name:"深夜电台", subtitle:"Midnight Radio", notes:"莫吉托的折腾遇上热可可的安静。一个发射,一个接收。深夜时分对方都听得到,但说出口的不多。", compat:88 },
  },
};

// ============================================================
// 查找函数：先查特殊配对，再查矩阵
// ============================================================
function getPair(typeA, typeB) {
  const sorted = [typeA, typeB].sort();
  const key = `${sorted[0]}+${sorted[1]}`;
  // 特殊配对覆盖
  if (PAIR_MATRIX._SPECIAL && PAIR_MATRIX._SPECIAL[key]) {
    return PAIR_MATRIX._SPECIAL[key];
  }
  const entry = PAIR_MATRIX[key];
  if (!entry) {
    console.warn("[DrinkTi] 未找到配对:", key);
    return { name:"未知特调", subtitle:"???", notes:"这组配对尚未定义。", compat:50 };
  }
  return entry;
}

// 示例导出（供 review 用）
if (typeof module !== "undefined") { module.exports = { PAIR_MATRIX, getPair }; }
