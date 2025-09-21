# GreenUP

GreenUP helps home cooks eat vibrant on any budget. Browse a curated catalog of fruits and vegetables, compare nutrition details, build a cart, and check out with confidence. The platform also powers wellness content and community feedback to keep healthy eating approachable.

## Features

- 🛒 **Produce marketplace** – searchable catalog with rich imagery, pricing, inventory, and nutrition links.
- 🧾 **Cart & orders** – persistent cart stored locally, server-side order + line-item records.
- 🔐 **Account management** – secure signup/login with session regeneration and rate-limited auth endpoints.
- 💬 **Feedback & comments** – leave product reviews or site feedback with moderation controls.
- 📱 **Responsive UI** – modern Bootstrap 5 + custom styling for desktop, tablet, and mobile.

## Tech Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Runtime         | Node.js 18+, Express 4                               |
| Database        | MySQL 8 via Sequelize ORM                            |
| Auth & Security | bcrypt hashing, express-session with Sequelize store |
| Views           | Handlebars templates, Bootstrap 5, custom CSS        |
| Tooling         | ESLint, Prettier, Nodemon, dotenv                    |

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm 9+ (ships with Node 18)
- MySQL 8 running locally or accessible remotely

### Installation

```bash
# Clone the repository
git clone https://github.com/JesusV545/GreenUP.git
cd GreenUP

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# edit .env with your credentials

# Build the database schema & seed reference data
npm run seeds -- --force

# Start the development server
npm run dev
```

Visit `http://localhost:3001` to explore the app in development mode. The default `npm run dev` task uses `nodemon` for automatic reloads.

### Environment Variables

Place the following keys in `.env` (see `config/connection.js` for defaults):

| Variable                                                        | Description                                              |
| --------------------------------------------------------------- | -------------------------------------------------------- |
| `DB_HOST`, `DB_PORT`                                            | Database host/port (defaults `127.0.0.1:3306`).          |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`                             | Database schema and credentials.                         |
| `DB_POOL_MIN`, `DB_POOL_MAX`, `DB_POOL_ACQUIRE`, `DB_POOL_IDLE` | Optional Sequelize pool tuning.                          |
| `DB_SSL`, `DB_SSL_REJECT_UNAUTHORIZED`                          | Enable TLS for hosted MySQL (e.g., `true` / `false`).    |
| `SESSION_SECRET`                                                | Key used to sign session cookies (change in production). |
| `SESSION_MAX_AGE`                                               | Cookie lifetime in ms (defaults to 1 hour).              |
| `CORS_ORIGIN`                                                   | Comma-separated origins allowed to call the API.         |
| `AUTH_MAX_ATTEMPTS`, `AUTH_WINDOW_MS`                           | Login throttling configuration.                          |

### Database Seeding

The seeder is idempotent and supports targeted runs:

```bash
# Full reset and reseed
npm run seeds -- --force

# Only seed products and comments
npm run seeds -- --only=products,comments
```

## Roadmap

- [ ] Build checkout flow with payment integration.
- [ ] Add user dashboards with order history and saved items.
- [ ] Launch recipe inspiration & meal planning modules.
- [ ] Provide admin tooling for product catalog management.
- [ ] Add i18n/localization support.

## Changelog

| Date       | Version | Highlights                                                                   |
| ---------- | ------- | ---------------------------------------------------------------------------- |
| 2025-09-20 | v0.3.0  | New product data model, improved cart/order schema, refreshed storefront UI. |
| 2025-09-10 | v0.2.0  | Added auth hardening, API refactors, improved seeding CLI.                   |
| 2025-08-30 | v0.1.0  | Initial revival of GreenUP platform.                                         |

## Project Links

- Repo: https://github.com/JesusV545/GreenUP
- Issues & Roadmap: https://github.com/JesusV545/GreenUP/issues
- Demo (Render): _TBD_

## Contributing

1. Fork and clone the repo.
2. Create a feature branch (`git checkout -b feature/my-update`).
3. Run `npm run lint` & `npm run format` before committing.
4. Submit a PR to `dev-main` with context and testing results.

## License

[MIT](https://opensource.org/licenses/MIT)

---

_Related quote_: “Let food be thy medicine and medicine be thy food.” – Hippocrates
