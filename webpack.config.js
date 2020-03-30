const path = require('path');

module.exports = {
    entry: './src/js/ui.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    }
};
