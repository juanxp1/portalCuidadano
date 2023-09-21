<template>
  <v-app v-scroll="onScroll">
    <v-fade-transition name="fade" mode="out-in" appear>
      <app-system-bar v-if="system" />
    </v-fade-transition>
    <app-bar />
    <div class="permission_denied">
      <particles id="tsparticles" :options="particles" />
      <router-view></router-view>
    </div>
    <app-settings />
    <app-footer />
    <gov-co-footer />
    <v-snackbar-queue @remove="$snackbar.remove" center bottom :items="items" />
    <v-pwa-snackbar />
  </v-app>
</template>

<script>
import { get } from "vuex-pathify";
import AppSettings from "@/layouts/dashboard/components/Settings";
import AppFooter from "@/components/global/Footer";
import GovCoFooter from "@/components/global/GovCoFooter";
import VSnackbarQueue from "@/components/global/Snackbar";
import VPwaSnackbar from "@/components/global/PwaSnackbar";
import AppSystemBar from "@/layouts/landing/components/SystemBar";
import AppBar from "@/layouts/landing/components/AppBar";
export default {
  name: "ErrorLayout",
  components: {
    AppBar,
    AppSystemBar,
    VPwaSnackbar,
    VSnackbarQueue,
    GovCoFooter,
    AppFooter,
    AppSettings,
  },
  computed: {
    items: get("snackbar/items"),
  },
  data: () => ({
    system: true,
    particles: {
      fpsLimit: 60,
      particles: {
        number: {
          value: 160,
          density: {
            enable: true,
            area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 1,
          random: {
            enable: true,
            minimumValue: 0.1,
          },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: {
            enable: true,
            minimumValue: 1,
          },
        },
        move: {
          enable: true,
          speed: 0.17,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          resize: true,
        },
      },
      detectRetina: true,
    },
  }),
  methods: {
    onScroll() {
      this.system = window.scrollY <= 50;
    },
  },
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Dosis:300,400,700,800");

.particle-error,
.permission_denied,
#tsparticles {
  width: 100%;
  height: 100%;
  margin: 0px !important;
}

#tsparticles {
  position: fixed !important;
  opacity: 0.23;
}

.permission_denied {
  min-height: 100vh;
  background: #24344c !important;
}

.denied__wrapper {
  max-width: 390px;
  width: 100%;
  height: 390px;
  display: block;
  margin: 0 auto;
  position: relative;
}

.permission_denied h1 {
  text-align: center;
  color: #fff;
  font-family: "Dosis", sans-serif;
  font-size: 100px;
  margin-bottom: 0px;
  font-weight: 800;
}

.permission_denied h3 {
  text-align: center;
  color: #fff;
  font-size: 19px;
  line-height: 23px;
  max-width: 330px;
  margin: 0px auto 30px auto;
  font-family: "Dosis", sans-serif;
  font-weight: 400;
}

.permission_denied h3 span {
  position: relative;
  width: 65px;
  display: inline-block;
}

.permission_denied h3 span:after {
  content: "";
  border-bottom: 3px solid #ffbb39;
  position: absolute;
  left: 0;
  top: 43%;
  width: 100%;
}

.permission_denied a {
  text-decoration: none;
}


.denied__link {
  background: none;
  color: #fff;
  padding: 12px 0px 10px 0px;
  border: 1px solid #fff;
  outline: none;
  border-radius: 7px;
  width: 80px;
  font-size: 15px;
  text-align: center;
  margin: 0 auto;
  vertical-align: middle;
  display: block;
  font-family: "Dosis", sans-serif;
  font-weight: 400;
}

.denied__link:hover {
  color: #ffbb39;
  border-color: #ffbb39;
  cursor: pointer;
  opacity: 1;
}

.permission_denied .stars {
  animation: sparkle 1.6s infinite ease-in-out alternate;
}

@keyframes sparkle {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

#astronaut {
  width: 43px;
  position: absolute;
  right: 20px;
  top: 310px;
  animation: spin 4.5s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

@media (max-width: 600px) {
  .permission_denied h1 {
    font-size: 75px;
  }
  .permission_denied h3 {
    font-size: 16px;
    width: 200px;
    margin: 0 auto;
    line-height: 23px;
  }
  .permission_denied h3 span {
    width: 60px;
  }
  #astronaut {
    width: 35px;
    right: 40px;
    top: 170px;
  }
}

.saturn,
.saturn-2,
.hover {
  animation: hover 2s infinite ease-in-out alternate;
}

@keyframes hover {
  0% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(-3px);
  }
}
</style>
