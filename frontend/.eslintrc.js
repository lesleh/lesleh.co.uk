module.exports = {
  parser: 'babel-eslint',
  rules: {
    strict: 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'jsx-a11y/label-has-for': 0,
    'react/jsx-one-expression-per-line': 0,
    'jsx-a11y/label-has-associated-control': 0,
  },
  globals: {
    FormData: true,
    window: true,
    fetch: true,
  },
  extends: [
    'airbnb',
    'prettier',
  ],
};
