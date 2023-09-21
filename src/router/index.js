// Imports
import Vue from "vue";
import { has } from "lodash";
import VueRouter from "vue-router";
import scrollBehavior from "./scroll-behavior";
import { auth } from "./routes/auth";
import { parks } from "./routes/public";
import { dashboard } from "./routes/dashboard";
import VueGtag from "vue-gtag";

// Globals
import { IS_SERVER } from "@/util/globals";
import { genRoutes } from "@/util/helpers";

Vue.use(VueRouter);

export function createRouter(vuetify, store, i18n) {
  const routes = [
    {
      path: "/",
      props: {
        showParallax: true,
        showFab: true,
      },
      meta: {
        title: i18n.t(`router.home`),
        can: true,
      },
      component: () => import("@/layouts/landing/index"),
      children: [
        {
          path: "home",
          redirect: "/",
          meta: {
            title: i18n.t(`router.home`),
            can: true,
          },
        },
        {
          path: "",
          name: "Home",
          component: () => import("@/views/landing/Index"),
          props: true,
          meta: {
            title: i18n.t(`router.home`),
            can: true,
          },
        },
      ],
    },
    {
      path: "/parques",
      name: "Parks",
      redirect: "/parques/buscar",
      meta: {
        title: i18n.t(`router.parks`),
        can: true,
      },
      component: () => import("@/layouts/landing/index"),
      props: {
        showParallax: false,
        showFab: false,
      },
      children: genRoutes(parks, i18n, "landing"),
    },
    {
      path: "/usuarios",
      meta: {
        title: "router.users",
        can: true,
      },
      component: () => import("@/layouts/auth/index"),
      children: genRoutes(auth, i18n, "auth"),
    },
    {
      path: "/app",
      redirect: "/dashboard",
      meta: {
        title: i18n.t(`router.home`),
        can: true,
      },
      component: () => import("@/layouts/dashboard/index"),
      children: genRoutes(dashboard, i18n, "dashboard"),
    },
    {
      path: "/maintenance",
      props: true,
      redirect: "/maintenance",
      meta: {
        title: "Maintenance",
        can: true,
      },
      component: () => import("@/layouts/maintenance/index"),
      children: [
        {
          name: "Maintenance",
          path: "/maintenance",
          component: () => import("@/views/Maintenance"),
          props: true,
          meta: {
            title: "Error",
            can: true,
          },
        },
      ],
    },
    {
      path: "*",
      props: true,
      redirect: "/error",
      meta: {
        title: "Error",
        can: true,
      },
      component: () => import("@/layouts/error/index"),
      children: [
        {
          name: "Error",
          path: "/error",
          component: () => import("@/views/Error"),
          props: true,
          meta: {
            title: "Error",
            can: true,
          },
        },
      ],
    },
  ];
  const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior: (...args) => scrollBehavior(vuetify, store, ...args),
    routes,
  });
  const getUserState = () => {
    return new Promise((resolve) => {
      store.restored.finally(() => {
        resolve(
          store.state &&
            has(store.state, "auth.token.access_token") &&
            !!store.state.auth.token.access_token
        );
      });
    });
  };
  const authenticationMiddleware = async (to, from, next) => {
    const isLoggedIn = await getUserState();
    if (has(to, "meta.forVisitors") && !!to.meta.forVisitors) {
      if (isLoggedIn) {
        next({
          name: "Dashboard",
          query: from.query,
        });
      } else {
        next();
      }
    } else if (has(to, "meta.requiresAuth") && !!to.meta.requiresAuth) {
      if (!isLoggedIn) {
        next({
          name: "Login",
          query: from.query,
        });
      } else {
        next();
      }
    } else {
      next();
    }
  };
  router.beforeEach(authenticationMiddleware);

  router.afterEach((to, from) => {
    if (to.path !== from.path && store.state.pwa.sw.update) {
      store.dispatch("pwa/update");
    }
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 100);
  });

  Vue.use(
    VueGtag,
    {
      bootstrap: !IS_SERVER,
      config: {
        id: process.env.VUE_APP_GOOGLE_TAG_MANAGER,
      },
    },
    router
  );

  return router;
}
