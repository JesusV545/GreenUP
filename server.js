require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const routes = require('./controllers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const hbs = exphbs.create({});

app.disable('x-powered-by');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : null;

const corsOptions = {
  origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
};

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const sess = {
  secret: process.env.SESSION_SECRET || 'change-me',
  cookie: {
    maxAge: Number(process.env.SESSION_MAX_AGE || 1000 * 60 * 60),
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(session(sess));

app.use(routes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'An unexpected error occurred.';

    if (req.accepts(['json', 'html', 'text']) === 'json') {
      return res.status(status).json({
        message,
        ...(isProduction ? {} : { stack: err.stack }),
      });
    }

    return res.status(status).send(message);
  }
);

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
};

startServer();
