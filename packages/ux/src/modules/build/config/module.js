export default {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        loose: true,
        modules: false,
        targets: {
          chrome: 62
        }
      }
    ]
  ]
}
