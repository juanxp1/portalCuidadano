import locales from "./locales";

export function localeLookup(name) {
  const { alternate, locale } = locales.find((l) =>
    [l.alternate, l.locale].includes(name)
  );
  return alternate || locale;
}
