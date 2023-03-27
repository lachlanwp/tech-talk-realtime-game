module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@constants': './src/constants/index',
          '@models': './src/models/index',
          '@screens': './src/screens/index',
          '@utils': './src/utils/index',
          '@components': './src/components/index',
          '@appstate': './src/appstate/index',
          '@hooks': './src/hooks/index',
        },
      },
    ],
  ],
};
