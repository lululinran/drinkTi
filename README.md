# 🍸 DrinkTi — 调一杯属于你的人格



> 基于 MBTI 心理学的饮料人格测试系统 —— 24 道生活场景题，把你映射到 16 种饮料人格，还能和朋友调制专属鸡尾酒。

---

## ✨ 截图预览

<img width="1415" height="831" alt="image" src="https://github.com/user-attachments/assets/38fa8ca6-fb0c-4f2f-821e-d0239997025e" />

<img width="1297" height="668" alt="image" src="https://github.com/user-attachments/assets/d09d38bb-5177-49e0-b426-d223a04788ab" />
<img width="1396" height="830" alt="image" src="https://github.com/user-attachments/assets/107e7423-57be-49fa-91b4-310e1385bd1c" />



## 🎯 功能一览

- **人格测试** — 24 道精心设计的场景题，覆盖 MBTI 四个维度（E/I、S/N、T/F、J/P），每题 6 题
- **饮料人格匹配** — 16 种人格对应 16 种饮料（威士忌、抹茶拿铁、气泡水、莫吉托……），每种带专属杯型、颜色和风味描述
- **双人特调** — 16 × 16 = 256 种配对，每种拥有独有名称、兼容度评分和风味笔记。名称由哈希驱动算法实时生成，非预写死
- **饮品柜收藏** — 每款特调收进柜子，等级随收集数提升
- **用户系统** — 注册/登录，数据云端存储
- **SVG 饮品可视化** — 6 种杯型（rocks / tall / mug / martini / shot / coconut）的纯 CSS/SVG 渲染，无外部图片依赖

---

## 🛠 技术栈

| 层级 | 技术 |
|:---|:---|
| 前端 | HTML5 / CSS3 / Vanilla JavaScript（无框架） |
| 后端 | Java Servlet |
| 数据库 | MySQL 5.7 |
| 容器 | Apache Tomcat 9 |
| 构建 | Maven |

---

## 📁 项目结构

```
drinkTi/
├── index.html              # 主页面
├── app.js                  # 前端核心逻辑
├── data.js                 # 饮料人格参考数据
├── styles.css              # 全局样式
├── pom.xml                 # Maven 配置
├── sql/
│   └── schema.sql          # 数据库建表脚本
└── src/main/java/com/drinkti/
    ├── servlet/            # Servlet 控制器
    │   ├── AuthServlet.java        # 登录/注册
    │   ├── ResultServlet.java      # 测试结果提交
    │   ├── CocktailServlet.java    # 双人特调
    │   ├── CollectionServlet.java  # 饮品柜
    │   ├── ReferenceDataServlet.java
    │   └── HealthServlet.java
    ├── dao/                # 数据访问层
    ├── model/              # 数据模型
    ├── filter/             # CORS 过滤器
    └── util/               # 数据库工具
```

---

## 🚀 快速开始

### 1. 创建数据库

```bash
mysql -u root -p < sql/schema.sql
```

### 2. 配置数据库连接

编辑 `src/main/resources/db.properties`：

```properties
db.url=jdbc:mysql://localhost:3306/drinkti?useUnicode=true&characterEncoding=utf-8
db.username=root
db.password=your_password
```

### 3. 构建 & 部署

```bash
mvn clean package
cp target/drinkti-javaweb-1.0.0.war /path/to/tomcat/webapps/ROOT.war
```

### 4. 启动 Tomcat 后访问

```
http://localhost:8080
```

---

## 🧪 API 接口

| 方法 | 路径 | 说明 |
|:---|:---|:---|
| `GET` | `/api/health` | 健康检查 |
| `POST` | `/api/auth/login` | 登录 |
| `POST` | `/api/auth/register` | 注册 |
| `GET` | `/api/auth/me` | 当前用户 |
| `POST` | `/api/results` | 提交测试结果 |
| `GET` | `/api/results/latest` | 最新结果 |
| `GET` | `/api/cocktails` | 特调列表 |
| `POST` | `/api/cocktails` | 创建特调 |
| `GET` | `/api/collection` | 饮品柜数据 |
| `DELETE` | `/api/collection` | 清空数据 |

---

## 🧬 设计细节

### 饮料人格映射

| MBTI | 饮料 | 杯型 | 色号 |
|:---|:---|:---|:---|
| INTJ | 威士忌型 Whisky | rocks | `#9C5A2F` |
| INTP | 金汤力型 Gin & Tonic | tall | `#B8D4C8` |
| INFP | 抹茶拿铁型 Matcha Latte | martini | `#9CB87A` |
| INFJ | 热可可型 Hot Cocoa | mug | `#7B3F25` |
| ENFP | 桃子气泡型 Peach Soda | tall | `#F5B5A1` |
| ENFJ | 玫瑰拿铁型 Rose Latte | martini | `#E89B9B` |
| ENTP | 莫吉托型 Mojito | martini | `#B5D9A8` |
| ENTJ | 黑咖啡型 Black Coffee | rocks | `#2C1F1A` |
| ISTJ | 矿泉水型 Still Water | tall | `#C8DCE8` |
| ISFJ | 热豆浆型 Soy Milk | mug | `#F0E8D0` |
| ESTJ | 美式咖啡型 Americano | rocks | `#5C3920` |
| ESFJ | 热红酒型 Mulled Wine | mug | `#A6452D` |
| ISTP | 苏打水型 Soda Water | tall | `#B0CDD8` |
| ISFP | 椰子水型 Coconut Water | coconut | `#F0E4C8` |
| ESTP | 龙舌兰型 Tequila Shot | shot | `#E5C77B` |
| ESFP | 果味气泡型 Fruit Soda | tall | `#F2A6C0` |

### SVG 杯型系统

6 种杯型全部由内联 SVG 实时渲染，颜色从数据库动态注入。无 PNG/JPG 图片依赖，响应式缩放不失真。

| 杯型 | 外观 |
|:---|:---|
| `rocks` | 短宽岩石杯 |
| `tall` | 高长水杯 + 侧边装饰线 |
| `mug` | 马克杯 + 弧形把手 + 蒸汽 |
| `martini` | 三角马天尼杯 + 樱桃/薄荷装饰 |
| `shot` | 小口烈酒杯 + 柠檬片 |
| `coconut` | 椭圆椰子壳 + 吸管 |

### 双人特调算法

```
输入: INTJ + ENFP
        │
        ▼
countDimDiff()  → 比较 4 个维度 → diff = 2 (差 E/I, J/P)
        │
        ▼
hashStr("INTJ+ENFP")  → DJB2 哈希 → 32 位无符号整数
        │
        ├─→ NAME_PATTERNS[diff][hash % N]   → 选取名称模板
        ├─→ cocktail_templates[hash % M]     → 选取风味笔记
        └─→ (hash % 7) - 3                   → 兼容度抖动 (-3 ~ +3)
```

**256 对独有名称**通过"名称模板 + 饮料名占位符"实现：

- 名称模式池按差异度分 5 组（`same` / `diff1` / `diff2` / `diff3` / `opposite`），共计 127 个模式
- 占位符 `{nameA}` `{enA}` `{nameB}` `{enB}` 在运行时被替换为实际饮料的中英文名
- 同一配对永远产生相同结果（幂等），不受刷新影响
- 少量精选配对使用手工名称，覆盖热门组合

示例：

| 配对 | diff | 名称 |
|:---|:---|:---|
| INTP + ENTJ | 2 | 金汤力与黑咖啡 / Gin & Tonic & Black Coffee |
| ISFP + ESTJ | 3 | 雷暴黑咖啡 / Thunder Black Coffee |
| INTJ + ESFP | 4 | 威士忌对果味气泡 / Whisky vs Fruit Soda |

**风味笔记**来自数据库 `cocktail_templates` 表，共 53 条，同样按差异度分组，哈希取模选取。

---

## 👤 作者

**lululinran** · 课程作业演示版本

---

## 📄 License

MIT
