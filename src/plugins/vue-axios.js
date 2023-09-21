import axios from "axios";
import VueAxios from "vue-axios";
import { axiosInterceptor } from "@/plugins/interceptor";

export function useAxios(app, router, store, i18n) {
  app.use(VueAxios, axios);
  axiosInterceptor(app, router, store, i18n);
}
