# 🍸 DrinkTi — 调一杯属于你的人格



> 基于 MBTI 心理学的饮料人格测试系统 —— 24 道生活场景题，把你映射到 16 种饮料人格，还能和朋友调制专属鸡尾酒。

---

## ✨ 截图预览

<img width="1415" height="831" alt="image" src="https://github.com/user-attachments/assets/38fa8ca6-fb0c-4f2f-821e-d0239997025e" />

<img width="1297" height="668" alt="image" src="https://github.com/user-attachments/assets/d09d38bb-5177-49e0-b426-d223a04788ab" />
<img width="1396" height="830" alt="image" src="https://github.com/user-attachments/assets/107e7423-57be-49fa-91b4-310e1385bd1c" />



## 🎯 功能一览

- **人格测试** — 24 道精心设计的场景题，覆盖 MBTI 四个维度（E/I、S/N、T/F、J/P），每题 6 题
- **饮料人格匹配** — 16 种人格对应 16 种饮料（威士忌、抹茶拿铁、气泡水、莫吉托……）
- **双人特调** — 输入朋友的人格码，系统按维度差异生成专属双人鸡尾酒，带名称、兼容度评分和风味笔记
- **饮品柜收藏** — 每款特调收进柜子，等级随收集数提升
- **用户系统** — 注册/登录，数据云端存储

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

## 👤 作者

**lululinran** · 课程作业演示版本

---

## 📄 License

MIT
