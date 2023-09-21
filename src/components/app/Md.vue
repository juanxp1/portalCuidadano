<script>
// Utilities
import { get } from "lodash";

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  _highlight: true,
})
  .use(require("markdown-it-attrs"))
  .use(require("markdown-it-prism"))
  .use(require("markdown-it-emoji"))
  .use(require("markdown-it-header-sections"))
  .use(require("markdown-it-container"), "warning", {
    validate: function (params) {
      return params.trim().match(/^warning\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);
      console.log(m);
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

export default {
  name: "AppMd",
  functional: true,
  props: {
    tag: {
      type: String,
      default: "div",
    },
  },
  render(h, { children: nodes = [], data, props, slots }) {
    const children = [];
    const node = nodes[0] || {};
    if (node.children) {
      children.push(...node.children);
    } else if (nodes.length > 1) {
      children.push(nodes);
    } else {
      const txtContent = get(data.domProps, "textContent", "");
      const text = node.text || txtContent || "";
      data.domProps = {
        ...data.domProps,
        innerHTML: md.render(text, {}),
      };
    }
    data.staticClass = `v-markdown ${data.staticClass || ""}`.trim();
    return h(props.tag, data, children);
  },
};
</script>
