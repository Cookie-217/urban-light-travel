# 🚲 基于 Java 的城市轻出行路线推荐系统

> 前后端分离 · 响应式适配所有设备 · AI 智能体 · 天气感知推荐 · 可部署上线

一个面向「城市轻出行」的智能路线推荐平台：根据**起点、出行方式、时间预算、兴趣偏好**，
综合**距离、评分、花费、实时天气**生成最优轻出行路线，并内置一个会聊天的 **AI 旅行智能体**。
技术栈：**后端 Spring Boot 2.7（Java 8）** + **前端 Vue 3（CDN，零构建）** + **PostgreSQL/H2**。

---

## ✨ 功能特性

- **多模式出行推荐**：步行 / 骑行 / 地铁 / 公交 / 打车 / 接驳，算法自动权衡速度、费用与评分
- **地图可视化**：基于 Leaflet + OpenStreetMap，路线站点与连线一图呈现（响应式）
- **智能路线规划器**：可视化配置起点/方式/时间/兴趣/预算，一键生成方案并可保存
- **AI 智能体（Agent）**：聊天式交互，能识别「规划意图」并自动调用推荐引擎；接入大模型后获得自然语言解说，未接入时启用内置规则兜底
- **天气感知**：调用 Open-Meteo（免 Key）获取实时天气，雨天自动优先室内/文化类景点
- **用户体系**：JWT 登录注册、个人偏好、收藏兴趣点、保存我的行程
- **响应式设计**：移动端底部导航 + 桌面端顶栏，手机/平板/桌面全适配，现代化玻璃拟态 UI
- **演示模式**：纯静态托管（如 GitHub Pages）无法连接后端时，自动使用内置示例数据，全部功能仍可用
- **一键部署**：Docker / docker-compose / GitHub Pages / Render / Railway 配置齐备

---

## 🧱 技术架构

```
┌────────────────────┐         ┌──────────────────────────────┐
│   前端 (Vue 3 SPA)  │  REST   │   后端 (Spring Boot 2.7)      │
│  Leaflet 地图       │ ──────▶ │   JWT 安全 / 推荐引擎 / AI     │
│  响应式 UI          │  /api   │   天气服务 / JPA 持久化        │
└────────────────────┘         └───────────┬──────────────────┘
                                            │
                                  ┌─────────┴─────────┐
                                  │  H2(开发) / PostgreSQL(生产) │
                                  │  Open-Meteo(天气) / LLM(可选) │
                                  └───────────────────┘
```

| 层 | 技术 |
|---|---|
| 后端 | Spring Boot 2.7、Spring Security(JWT)、Spring Data JPA、H2 / PostgreSQL、jjwt、springdoc-openapi |
| 前端 | Vue 3（global build，免构建）、Leaflet、原生 CSS 设计系统 |
| AI | OpenAI 兼容大模型（环境变量配置，可选）+ 规则兜底 Agent |
| 部署 | Docker、docker-compose、GitHub Pages、Render / Railway |

---

## 📂 目录结构

```
.
├── backend/                 # Spring Boot 后端
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/urbantravel/...   # controller / service / repository / entity / security
│       └── src/main/resources/application.yml
├── frontend/                # 前端静态站点（无需构建）
│   ├── index.html
│   ├── css/style.css
│   ├── js/{config,demo-data,app}.js
│   ├── Dockerfile           # nginx 反向代理 /api 到后端
│   └── nginx.conf
├── docker-compose.yml       # 一键编排 前端 + 后端 + PostgreSQL
├── .github/workflows/       # CI（后端测试）+ 前端 GitHub Pages 部署
├── .env.example
├── README.md
└── LICENSE
```

---

## 🚀 快速开始（本地开发）

### 后端

```bash
cd backend
# 需要 JDK 8 + Maven
mvn spring-boot:run
# 或打包后运行：
mvn clean package -DskipTests
java -jar target/urban-light-travel.jar
```

启动后访问：
- API 根：`http://localhost:8080/api`
- Swagger 文档：`http://localhost:8080/api/swagger-ui.html`
- 健康检查：`http://localhost:8080/api/health`
- H2 控制台：`http://localhost:8080/api/h2-console`

### 前端

前端是纯静态文件，直接用任意静态服务器打开即可，例如：

```bash
cd frontend
python -m http.server 5500
# 浏览器打开 http://localhost:5500
```

> 若前端与后端不在同源，可通过 `?api=http://localhost:8080/api` 指定后端地址；
> 若后端不可用，前端自动进入**演示模式**（内置示例数据 + 离线推荐/AI）。

### 演示账号

| 用户名 | 密码 | 角色 |
|---|---|---|
| `admin` | `admin123` | 管理员 |
| `demo` | `demo123` | 普通用户 |

---

## 🐳 一键部署（Docker Compose）

```bash
cp .env.example .env        # 修改 DB_PASSWORD / JWT_SECRET 等
docker compose up --build
```

- 前端：`http://localhost:8081`
- 后端 API：`http://localhost:8080/api`

---

## ☁️ 部署上线

### 前端 → GitHub Pages（已配置 CI 自动发布）

推送到 `main` 分支后，GitHub Actions 会自动把 `frontend/` 发布为静态站点。
访问 `https://<user>.github.io/<repo>/` 即可，无需服务器。

### 后端 → Render / Railway（一键）

仓库已包含 `backend/Dockerfile`，在 Render / Railway 选择 **Deploy from GitHub (Docker)** 即可。
或直接使用 Render 一键部署按钮（把下方仓库地址替换为你的）：

```
https://render.com/deploy?repo=https://github.com/<you>/<repo>
```

部署后在环境变量中设置：`JWT_SECRET`（强随机）、`DB_*`、`AI_API_KEY`（可选）。
前端连接已上线后端：打开 `https://<pages-url>/?api=https://<backend>/api`。

---

## 🔑 环境变量（生产）

| 变量 | 说明 |
|---|---|
| `SPRING_PROFILES_ACTIVE` | 设为 `prod` 使用 PostgreSQL |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | 数据库连接 |
| `JWT_SECRET` | **务必设置为强随机字符串**（生产） |
| `AI_ENABLED` / `AI_API_BASE` / `AI_API_KEY` / `AI_MODEL` | 大模型接入（OpenAI 兼容） |
| `WEATHER_ENABLED` | 是否启用实时天气 |

> ⚠️ **安全约定**：所有密码、API Key、JWT 密钥均通过环境变量 / `.env` 注入（`.env` 已被 `.gitignore` 忽略），
> 仓库内**不包含任何真实密钥**。生产部署请务必替换默认占位值。

---

## 🤖 AI 智能体说明

- 未配置 `AI_API_KEY` 时，内置**规则 Agent**：识别规划意图 → 调用推荐引擎 → 生成结构化解说。
- 配置后，调用 OpenAI 兼容接口，对行程方案做自然语言润色，并支持多轮闲聊。
- 接入大模型仅需一个环境变量，无需改代码。

---

## 📡 API 速览

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录（返回 JWT） |
| GET | `/api/pois?city=&keyword=` | 查询兴趣点 |
| GET | `/api/pois/cities` | 城市列表 |
| POST | `/api/plan` | 生成路线方案（公开） |
| GET | `/api/ai/status` | AI 状态 |
| POST | `/api/ai/chat` | AI 助手对话（公开） |
| GET | `/api/users/me` | 当前用户 |
| GET/POST/DELETE | `/api/routes` | 我的行程 |
| GET/POST | `/api/favorites/*` | 收藏 |

完整定义见 Swagger：`/api/swagger-ui.html`。

---

## 📄 License

[MIT](./LICENSE)
