module.exports = (api) =>{
    api.cache(true);

    const presets = [
        ['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3,
        }]
    ];

    return {
        presets,
    };
};
