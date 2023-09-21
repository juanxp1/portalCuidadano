/**
 * Vee Validate extension rules
 */
import moment from "moment";
const alphaDots = {
  en: /^[0-9A-Z.-]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ.-]*$/i,
  da: /^[0-9A-ZÆØÅ.-]*$/i,
  de: /^[0-9A-ZÄÖÜß.-]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ.-]*$/i,
  // eslint-disable-next-line no-misleading-character-class
  fa: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰپژگچکی]*$/,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ.-]*$/i,
  it: /^[0-9A-Z\xC0-\xFF.-]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ.-]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ.-]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ.-]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ.-]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ.-]*$/i,
  ro: /^[0-9A-ZĂÂÎŞŢ.-]*$/i,
  ru: /^[0-9А-ЯЁ.-]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ.-]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ.-]*$/i,
  sv: /^[0-9A-ZÅÄÖ.-]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ.-]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ.-]*$/i,
  // eslint-disable-next-line no-misleading-character-class
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ.-]*$/,
  az: /^[0-9A-ZÇƏĞİıÖŞÜ.-]*$/i,
  el: /^[0-9Α-ώ.-]*$/i,
};
export function extendVeeRules(i18n) {
  return {
    alpha_dots: (value) => {
      return (alphaDots[i18n.locale] || alphaDots.es).test(value);
    },
    lat_long: (value) => {
      return (
        value.length >= 4 && /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,15}$/.test(value)
      );
    },
    password: (value) => {
      return (
        value.length >= 8 &&
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[¿?\"='!^<>+´{}:;¡!*¨.@#$%^&*])(?=.{8,})"
        ).test(value)
      );
    },
    any_number: (value) => {
      return typeof value === "number" && isFinite(value) && !isNaN(value);
    },
    date_format: {
      validate(value, { format }) {
        return moment(value, format, true).isValid();
      },
      params: ["format"],
    },
    greater_than_or_equal_to: {
      validate(value, { target }) {
        return (
          moment(value).isValid() &&
          moment(target).isValid() &&
          moment(value).isSameOrAfter(moment(target))
        );
      },
      params: [
        {
          name: "target",
          isTarget: true,
        },
      ],
    },
    less_than_or_equal_to: {
      validate(value, { target }) {
        return (
          moment(value).isValid() &&
          moment(target).isValid() &&
          moment(value).isSameOrBefore(moment(target))
        );
      },
      params: [
        {
          name: "target",
          isTarget: true,
        },
      ],
    },
    greater_than: {
      validate(value, { target }) {
        return (
          moment(value).isValid() &&
          moment(target).isValid() &&
          moment(value).isBefore(moment(target))
        );
      },
      params: [
        {
          name: "target",
          isTarget: true,
        },
      ],
    },
    less_than: {
      validate(value, { target }) {
        return (
          moment(value).isValid() &&
          moment(target).isValid() &&
          moment(value).isBefore(moment(target))
        );
      },
      params: [
        {
          name: "target",
          isTarget: true,
        },
      ],
    },
    date_equal_to: {
      validate(value, { target }) {
        return (
          moment(value).isValid() &&
          moment(target).isValid() &&
          moment(value).isSame(moment(target))
        );
      },
      params: [
        {
          name: "target",
          isTarget: true,
        },
      ],
    },
    date_is_between: {
      validate(value, { min, max }) {
        return (
          moment(value).isValid() &&
          moment(min).isValid() &&
          moment(max).isValid() &&
          moment(value).isBetween(moment(min), moment(max))
        );
      },
      params: ["min", "max"],
    },
  };
}
