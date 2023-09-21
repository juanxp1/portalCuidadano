const canonical = process.env.VUE_APP_CANONICAL;
const publicPath = process.env.VUE_APP_PUBLIC_PATH;

export function genAppMetaInfo(defaults) {
  const metadata = genMetaInfo(...Object.values(defaults));

  metadata.link.push(...genLink());
  metadata.meta.push(...genMeta());

  return metadata;
}

// eslint-disable-next-line no-unused-vars
export function genFacebookMetaInfo(args) {
  return parseMeta("fb", { app_id: process.env.VUE_APP_FACEBOOK_CLIENT_ID });
}

export function genLink() {
  const hrefs = [
    {
      href: "img/icons/apple-splash-2048-2732.jpg",
      media:
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2732-2048.jpg",
      media:
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-1668-2388.jpg",
      media:
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2388-1668.jpg",
      media:
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-1668-2224.jpg",
      media:
        "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2224-1668.jpg",
      media:
        "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-1536-2048.jpg",
      media:
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2048-1536.jpg",
      media:
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-1242-2688.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2688-1242.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-1125-2436.jpg",
      media:
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2436-1125.jpg",
      media:
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-828-1792.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-1792-828.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-1242-2208.jpg",
      media:
        "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-2208-1242.jpg",
      media:
        "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-750-1334.jpg",
      media:
        "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-1334-750.jpg",
      media:
        "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      href: "img/icons/apple-splash-640-1136.jpg",
      media:
        "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "img/icons/apple-splash-1136-640.jpg",
      media:
        "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
  ];
  const link = [
    { rel: "shortcut icon", href: canonical + publicPath + "favicon.ico" },
    { rel: "manifest", href: canonical + publicPath + "manifest.json" },
    { rel: "canonical", href: canonical },
    {
      rel: "search",
      type: "application/opensearchdescription+xml",
      href: `${canonical}search.xml`,
      title: "Portal Ciudadano - IDRD",
    },
  ];

  for (const href of hrefs) {
    const rel = "apple-touch-startup-image";
    link.push({ rel, href: publicPath + href.href, media: href.media });
  }

  return link;
}

export function genOpenGraphMetaInfo(args) {
  return parseMeta("og", {
    description: args.description,
    image: `${canonical}${publicPath}img/icons/android-chrome-192x192.png`,
    site_name: "Portal Ciudadano - IDRD",
    title: args.title,
    type: "website",
  });
}

export function parseMeta(prefix, metadata) {
  const meta = [];

  for (const key in metadata) {
    const content = metadata[key];
    const property = `${prefix}:${key}`;

    meta.push({
      vmid: property,
      property,
      content,
    });
  }

  return meta;
}

export function genMeta() {
  return [
    { charset: "utf-8" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
    },
  ];
}

export function genMetaInfo(title, description, keywords) {
  const length = description.length;

  description = length <= 117 ? description : `${description.slice(0, 116)}...`;

  const options = {
    description,
    keywords,
    title,
  };

  return {
    link: [],
    meta: [
      { vmid: "description", name: "description", content: description },
      { vmid: "keywords", name: "keywords", content: keywords },
      { vmid: "language", name: "language", content: "Spanish" },
      { vmid: "robots", name: "robots", content: "index, follow" },
      {
        vmid: "author",
        name: "author",
        content: "Instituto Distrital de Recreación y Deporte",
      },
      ...genFacebookMetaInfo(options),
      ...genOpenGraphMetaInfo(options),
      ...genTwitterMetaInfo(),
    ],
    script: [
      {
        type: "application/ld+json",
        json: {
          "@context": "https://schema.org",
          "@type": "GovernmentOrganization",
          name: "Instituto Distrital de Recreación y Deporte",
          alternateName: "IDRD",
          url: "https://www.idrd.gov.co/",
          logo: `${canonical}${publicPath}img/icons/android-chrome-192x192.png`,
          email: "atncliente@idrd.gov.co",
          telephone: "+57 (601) 6605400 Ext.251, 252 y 265",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Calle 63 # 59A - 06 IDRD",
            addressLocality: "BOGOTA",
            postalCode: "111221",
            addressCountry: "CO",
          },
          sameAs: [
            "https://www.facebook.com/IDRDBogota",
            "https://twitter.com/IDRD",
            "https://www.instagram.com/idrdbogota/",
            "https://www.youtube.com/c/IDRDBogota1",
          ],
        },
      },
    ],
    title,
  };
}

export function genTwitterMetaInfo() {
  return parseMeta("twitter", {
    card: `${canonical}${publicPath}img/icons/android-chrome-192x192.png`,
    domain: canonical,
    site: "Portal Ciudadano - IDRD",
  });
}
