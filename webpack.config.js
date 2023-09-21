module.exports = {
  // devtool: "source-map",
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": __dirname + "/src",
    },
  },
  entry: {
    app: __dirname + "/src/entry-client.js",
  },
};
