import { dispatch } from "vuex-pathify";
import { User } from "@/models/services/User";

export default function (Vue, store) {
  (Vue.auth = {
    login: (data) => {
      return new Promise((resolve, reject) => {
        new User(data)
          .login()
          .then((response) => {
            dispatch("auth/setToken", response).then(() => resolve(response));
          })
          .catch((error) => reject(error));
      });
    },
    profiles: () => {
      return new Promise((resolve, reject) => {
        new User()
          .profiles()
          .then((response) => {
            dispatch("auth/setProfiles", response.data).finally(() =>
              resolve(response)
            );
          })
          .catch((error) => reject(error));
      });
    },
    logout: () => {
      return new Promise((resolve, reject) => {
        new User()
          .logout()
          .then((response) => {
            new User().logoutFacebook().finally(() => resolve(response));
          })
          .catch((error) => reject(error))
          .finally(() => {
            dispatch("auth/logout").catch((error) => reject(error));
          });
      });
    },
    ready: () => !!store.state,
    user: () => (store.state ? store.state.auth.user : null),
    token: () => (store.state ? store.state.auth.token?.access_token : null),
    isLoggedIn: () => store.state && store.state.auth.token?.access_token,
    isVerified: () => store.state && store.state.auth.user?.email_verified_at,
    isNotLoggedIn() {
      return !this.isLoggedIn();
    },
  }),
    Object.defineProperties(Vue.prototype, {
      $auth: {
        get() {
          return Vue.auth;
        },
      },
    });
}
