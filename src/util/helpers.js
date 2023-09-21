// Globals
import { IN_BROWSER } from "@/util/globals";
const PDFJS = require("pdfjs-dist/build/pdf");

export async function thumbnailPdf(file) {
  PDFJS.disableWorker = true;
  const pdf = await PDFJS.getDocument(URL.createObjectURL(file)).promise;
  const img = await pdf.getPage(1).then(async function (page) {
    let viewport = page.getViewport({ scale: 0.5 });
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    let renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    return await page.render(renderContext).promise.then(function () {
      //set to draw behind current content
      ctx.globalCompositeOperation = "destination-over";
      //set background color
      ctx.fillStyle = "#fff";
      //draw on entire canvas
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // create an img from the canvas which contains the page contents
      const img = canvas.toDataURL();
      canvas.remove();
      return img;
    });
  });
  return img;
}

export const routeGenerator = (
  path,
  name,
  folder,
  i18n,
  meta = {},
  props = true
) => {
  const route = {
    path,
    name,
    component: () =>
      import(/* [name].[contenthash].chunk */ `@/views/${folder}/${name}`),
    props,
    meta: {
      title: i18n.t(
        `router.${
          name === "PassThrough"
            ? (meta.alias || "home").toLowerCase()
            : name.toLowerCase()
        }`
      ),
      ...meta,
    },
  };
  return name === "PassThrough" && delete route.name ? route : route;
};

export const genRoutes = (routes = [], i18n, folder) => {
  return routes.reduce((acc, cur) => {
    acc.push(
      cur.children
        ? {
            ...routeGenerator(
              cur.path,
              cur.name,
              folder,
              i18n,
              cur.meta ? cur.meta : {},
              cur.props ? cur.props : true
            ),
            children: genRoutes(cur.children, i18n, folder),
          }
        : routeGenerator(
            cur.path,
            cur.name,
            folder,
            i18n,
            cur.meta ? cur.meta : {},
            cur.props ? cur.props : true
          )
    );
    return acc;
  }, []);
};

export const uniqueId = (prefix) =>
  `${prefix}_` + Math.random().toString(36).substr(2, 9);

export const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export async function waitForReadystate() {
  if (!IN_BROWSER || document.readyState === "interactive") return;

  await new Promise((resolve) => {
    const cb = () => {
      window.requestAnimationFrame(resolve);
      window.removeEventListener("DOMContentLoaded", cb);
    };

    window.addEventListener("DOMContentLoaded", cb);
  });
}

/** Jaro-Winkler distance between two strings */
// eslint-disable-next-line max-statements
export function distance(s1, s2) {
  // Exit early if either are empty.
  if (s1.length === 0 || s2.length === 0) {
    return 0;
  }

  // Exit early if they're an exact match.
  if (s1 === s2) {
    return 1;
  }

  const range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  const s1Matches = new Array(s1.length);
  const s2Matches = new Array(s2.length);

  let m = 0;
  for (let i = 0; i < s1.length; i++) {
    const low = i >= range ? i - range : 0;
    const high = i + range <= s2.length - 1 ? i + range : s2.length - 1;

    for (let j = low; j <= high; j++) {
      if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
        ++m;
        s1Matches[i] = s2Matches[j] = true;
        break;
      }
    }
  }

  // Exit early if no matches were found.
  if (m === 0) {
    return 0;
  }

  // Count the transpositions.
  let j;
  let k = 0;
  let numTrans = 0;

  for (let i = 0; i < s1.length; i++) {
    if (s1Matches[i] === true) {
      for (j = k; j < s2.length; j++) {
        if (s2Matches[j] === true) {
          k = j + 1;
          break;
        }
      }

      if (s1[i] !== s2[j]) {
        ++numTrans;
      }
    }
  }

  let weight = (m / s1.length + m / s2.length + (m - numTrans / 2) / m) / 3;
  let l = 0;
  const p = 0.1;

  if (weight > 0.7) {
    while (s1[l] === s2[l] && l < 4) {
      ++l;
    }

    weight = weight + l * p * (1 - weight);
  }

  return weight;
}

export const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

export const mergeObject = (target, source) => {
  const obj = target;
  Object.keys(target).map((key) => {
    if (key in source) {
      obj[key] = source[key];
    }
  });
  return obj;
};

export function deepEqual(a, b) {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date && a.getTime() !== b.getTime()) {
    // If the values are Date, compare them as timestamps
    return false;
  }

  if (a !== Object(a) || b !== Object(b)) {
    // If the values aren't objects, they were already checked for equality
    return false;
  }

  const props = Object.keys(a);

  if (props.length !== Object.keys(b).length) {
    // Different number of props, don't bother to check
    return false;
  }

  return props.every((p) => deepEqual(a[p], b[p]));
}

export function humanReadableFileSize(bytes, binary = false) {
  const base = binary ? 1024 : 1000;
  if (bytes < base) {
    return `${bytes} B`;
  }

  const prefix = binary ? ["Ki", "Mi", "Gi"] : ["k", "M", "G"];
  let unit = -1;
  while (Math.abs(bytes) >= base && unit < prefix.length - 1) {
    bytes /= base;
    ++unit;
  }
  return `${bytes.toFixed(1)} ${prefix[unit]}B`;
}

export function wrapInArray(v) {
  return v != null ? (Array.isArray(v) ? v : [v]) : [];
}

export function isCssColor(color) {
  return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/);
}
