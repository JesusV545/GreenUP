module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js']
      }
    }
  },
  overrides: [
    {
      files: ['public/js/**/*.js'],
      env: {
        browser: true,
        es2022: true
      },
      globals: {
        Handlebars: 'readonly'
      }
    }
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
