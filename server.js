const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
// const helpers = require('./utils');

const sequelize = require('./config/connection');
// const { Product } = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;
// LM added to see if this got handleBars to work
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/pages/index.html'))
//   );

//   app.get('/', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/pages/reviews.html'))
//   );
// removed the word "helpers " from inside until its needed

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use(routes);

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
