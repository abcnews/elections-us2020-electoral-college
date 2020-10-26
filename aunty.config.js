const fs = require('fs');
const path = require('path');

const ADDITIONAL_ENTRY_POINTS = ['editor', 'standalone', 'polyfills'];

module.exports = {
  type: 'react',
  serve: {
    hot: false
  },
  webpack: config => {
    config.devtool = 'source-map';

    ADDITIONAL_ENTRY_POINTS.forEach(name => {
      config.entry[name] = [config.entry.index[0].replace('index', name)];
    });

    return config;
  },
  deploy: [
    {
      to: '/www/res/sites/news-projects/<name>/<id>'
    },
    config => {
      fs.writeFileSync(
        path.join(__dirname, 'redirect', 'index.js'),
        `window.location = String(window.location).replace('/latest/', '/${config.id}/')`
      );

      return {
        ...config,
        from: 'redirect',
        to: '/www/res/sites/news-projects/<name>/latest'
      };
    }
  ]
};
