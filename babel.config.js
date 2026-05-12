export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '24.14.0'
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
}
