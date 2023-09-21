// Imports
const { md } = require("./markdown-it");
const Mode = require("frontmatter-markdown-loader/mode");
const path = require("path");

module.exports = (config) => {
  config.module
    .rule("markdown")
    .test(/\.md$/)
    .use("toc-loader")
    .loader(path.resolve("./build/toc-loader.js"))
    .end()
    .use("frontmatter-markdown-loader")
    .loader("frontmatter-markdown-loader")
    .tap(() => ({
      markdown: (body) => md.render(body),
      mode: [Mode.VUE_COMPONENT, Mode.BODY],
      vue: { root: "markdown-body" },
    }));
};
