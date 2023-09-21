// Imports
const rules = require("./rules");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  _highlight: true,
})
  .use(require("markdown-it-attrs"))
  .use(require("markdown-it-anchor"), {
    permalink: true,
    permalinkSymbol: "",
    permalinkClass: "",
    slugify: (str) => {
      let slug = String(str)
        .trim()
        .toLowerCase()
        .replace(/[\s,.[\]{}()/]+/g, "-")
        .replace(/[^a-z0-9 -]/g, (c) => c.charCodeAt(0).toString(16))
        .replace(/-{2,}/g, "-")
        .replace(/^-*|-*$/g, "");

      if (slug.charAt(0).match(/[^a-z]/g)) {
        slug = "section-" + slug;
      }

      return encodeURIComponent(slug);
    },
  })
  .use(require("markdown-it-prism"))
  .use(require("markdown-it-emoji"))
  .use(require("markdown-it-header-sections"))
  .use(require("markdown-it-container"), "warning", {
    validate: function (params) {
      return params.trim().match(/^warning\s+(.*)$/);
    },

    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return (
          '<v-alert type="warning"><summary>' +
          md.utils.escapeHtml(m[1]) +
          "</summary>\n"
        );
      } else {
        // closing tag
        return "</v-alert>\n";
      }
    },
  });

for (const key in rules) rules[key](md);

module.exports = { md };
