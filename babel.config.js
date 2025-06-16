export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: process.env.NODE_ENV === 'production' ? '24.0.1' : '21.6.2'
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
}
