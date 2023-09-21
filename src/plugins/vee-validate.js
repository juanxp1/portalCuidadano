import Vue from "vue";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  configure,
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { extendVeeRules } from "@/plugins/rules";

Vue.component("v-validation-provider", ValidationProvider);
Vue.component("v-validation-observer", ValidationObserver);

export function useVeeValidate(app, i18n) {
  configure({
    defaultMessage: (field, values) => {
      values._field_ = i18n.t(`${field}`);
      return app.i18n.t(`validation.${values._rule_}`, values);
    },
  });
  configure({
    defaultMessage: (field, values) => {
      return i18n.t(`validation.${values._rule_}`, values);
    },
  });
  const extRules = extendVeeRules(app.i18n);
  Object.keys(extRules).forEach((rule) => {
    extend(rule, extRules[rule]);
  });
  Object.keys(rules).forEach((rule) => {
    extend(rule, rules[rule]);
  });
}
