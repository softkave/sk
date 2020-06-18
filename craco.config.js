const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // "@font-family":
              //   "-apple-system, BlinkMacSystemFont, 'Work Sans', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji",
              // "@text-color": "fade(@black, 85%)",
              // "@text-color-secondary": "fade(@black, 65%)",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
