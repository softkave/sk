const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "css"
  })

  // TODO: remove less and less-loader from package.json
  //   or find a way to make this work
  // addLessLoader({
  //   javascriptEnabled: true,
  //   modifyVars: {
  //     // "@font-family": `
  //     //   Karla, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
  //     //   'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
  //     //   Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
  //     "@font-family": "Karla, sans-serif",
  //     "@text-color": "black"
  //   }
  // })
);
