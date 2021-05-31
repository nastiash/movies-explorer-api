module.exports = {
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-underscore-dangle': ['error', {
      allow: ['_id'],
    }],
    'no-console': 'off',
    'linebreak-style': 'off',
    'consistent-return': 'off',
  },
};
