import Cookies from "vue-cookies";
import { has } from "lodash";

export function axiosInterceptor(Vue, router, store, i18n) {
  try {
    Vue.use(Cookies);
    window.intercepted = new Vue();
  } catch (e) {
    console.error("Require Vue instance, router and store.");
  }
  window.intercepted.axios.interceptors.request.use(
    async (config) => {
      const type = (await store.state)
        ? store.state.auth.token?.token_type
        : null;
      const token = (await store.state)
        ? store.state.auth.token?.access_token
        : null;
      if (type && token) {
        config.headers.common["Authorization"] = `${type} ${token}`;
      }
      config.headers.common["X-Localization"] = i18n.locale;
      config.headers.common["X-Requested-With"] = "XMLHttpRequest";
      config.headers.common["Accept"] = "application/json";
      config.headers.common["Content-Type"] = "application/json";
      const csfr = window.intercepted.$cookies.get("XSRF-TOKEN");
      if (csfr) {
        config.headers.common["X-XSRF-TOKEN"] = csfr;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  window.intercepted.axios.interceptors.response.use(
    (response) => {
      handleResponse(response);
      return response;
    },
    (error) => {
      if (error.response) {
        handleResponse(error.response);
        if (parseInt(error.response.status) === 401) {
          delete error.config.headers.Authorization;
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        if (process.env.NODE_ENV === "production") {
          router.push({
            name: "Error",
            params: {
              code: 504,
              text: "No se pudo realizar la solicitud al servidor.",
            },
          });
        }
        if (process.env.NODE_ENV !== "production") {
          console.log("Request");
          console.log(error.request);
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        // eslint-disable-next-line
        console.error('Error', error)
      }
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line
        console.log('Config')
        // eslint-disable-next-line
        console.log(error)
      }
      return Promise.reject(error);
    }
  );

  function handleResponse(response) {
    const categories = [
      "informational",
      "success",
      "redirection",
      "client-error",
      "server-error",
    ];
    const status = response ? response.status : null;
    const codes = statusCodes();

    if (!status || !codes[status]) {
      return false;
    }

    let statusCategory = parseInt(status.toString().charAt(0));
    let category = categories[statusCategory - 1];
    let sluggedCode = slugify(codes[status]);
    let data = { status: status, code: codes[status], data: response.data };

    if (parseInt(status) >= 400) {
      handleErrors(parseInt(status), codes[status], response);
    }

    window.intercepted.$emit("response", data);
    window.intercepted.$emit("response:" + category, data);
    window.intercepted.$emit("response:" + sluggedCode, data);
    window.intercepted.$emit("response:" + status, data);
    window.intercepted.$emit("response:" + statusCategory + "xx", data);

    return true;
  }

  function handleErrors(status, code, response) {
    if (![401, 422, 429, 404, 403, 503].includes(status)) {
      router.push({
        name: "Error",
        params: {
          code: status,
          text: response.data.message || code,
        },
      });
    }
    if (response.status === 401) {
      store.dispatch("auth/logout").then(() => {
        if (!["Login", "Home"].includes(router.currentRoute.name)) {
          router.push({ name: "Login" });
        }
      });
    }
    if (response.status === 503) {
      router.push({ name: "Maintenance" });
    }
    if (status === 403) {
      const verified = has(store, "state.auth.user.email_verified_at")
        ? !!store.state.auth.user.email_verified_at
        : null;
      if (verified) {
        router.push({
          name: "Error",
          params: {
            code: response.status,
            text: response.data.message || code,
          },
        });
      } else {
        router.push({ name: "Verify" });
      }
    }
  }

  function slugify(string) {
    return string
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-");
  }

  function statusCodes() {
    return {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",

      200: "OK",
      201: "Created",
      202: "Accepted",
      203: "Non-authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      208: "Already Reported",
      226: "IM Used",

      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      308: "Permanent Redirect",

      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Payload Too Large",
      414: "Request-URI Too Long",
      415: "Unsupported Media Type",
      416: "Requested Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a teapot",
      421: "Misdirected Request",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      444: "Connection Closed Without Response",
      451: "Unavailable For Legal Reasons",
      499: "Client Closed Request",

      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      510: "Not Extended",
      511: "Network Authentication Required",
      599: "Network Connect Timeout Error",
    };
  }
}
