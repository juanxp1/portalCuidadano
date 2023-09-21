/**
 * plugins/app.js
 *
 * Automatically loads and bootstraps files
 * in the `./src/components/` folder.
 */
// import _ from "lodash";
import { IS_PROD } from "@/util/globals";
const loader = {
  log(...args) {
    if (!IS_PROD) {
      console.log(...args);
    }
  },
  install(Vue) {
    const files = require.context("@/components", true, /\.vue$/i);
    files.keys().map((key) => {
      // let Xname = _.kebabCase(files(key).default.name);
      let name = files(key).default.name;
      let component = files(key).default;
      loader.log("[Auto-loading Component]", name, component);
      Vue.component(name, component);
    });
  },
};

export default loader;

export function registerComponents(app) {
  app.use(loader);
}