import { Model } from "@/models/Model";
import { Api } from "@/models/Api";
import { Sdk } from "@/util/facebook-sdk";

export class User extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.USER(), data);
  }

  preRegister() {
    return this.post(Api.END_POINTS.PRE_REGISTER(), this.data());
  }

  preRegisterValidation() {
    return this.post(Api.END_POINTS.PRE_REGISTER_VALIDATION(), this.data());
  }

  profiles() {
    return this.get(Api.END_POINTS.PROFILES(), this.data());
  }

  login() {
    return this.post(Api.END_POINTS.LOGIN(), this.data());
  }

  social() {
    return this.post(Api.END_POINTS.SOCIAL(), this.data());
  }

  register() {
    return this.postWithFiles(Api.END_POINTS.REGISTER(), this.data());
  }

  logout(options = {}) {
    return this.post(Api.END_POINTS.LOGOUT(), options);
  }

  logoutFacebook() {
    return new Promise((resolve, reject) => {
      Sdk.getLoginStatus()
        .then((response) => {
          if (Sdk.isConnected(response.status)) {
            Sdk.logout().finally(() => resolve(response));
          }
        })
        .finally(() => resolve(true));
    });
  }

  logoutAllDevices(options = {}) {
    return this.post(Api.END_POINTS.LOGOUT_ALL_DEVICES(), options);
  }

  forgotPassword(options = {}) {
    return this.post(Api.END_POINTS.FORGOT_PASSWORD(), options);
  }

  resetPassword(options = {}) {
    return this.post(Api.END_POINTS.RESET_PASSWORD(), options);
  }

  changePassword(options = {}) {
    return this.post(Api.END_POINTS.CHANGE_PASSWORD(), options);
  }

  changeEmail(options = {}) {
    return this.post(Api.END_POINTS.CHANGE_EMAIL(), options);
  }

  confirmChangeEmail(options = {}) {
    return this.post(Api.END_POINTS.CONFIRM_CHANGE_EMAIL(), options);
  }

  resendConfirmChangeEmail(options = {}) {
    return this.post(Api.END_POINTS.RESEND_CONFIRM_CHANGE_EMAIL(), options);
  }

  verify(id, options = {}) {
    return this.post(Api.END_POINTS.VERIFY_VERIFICATION_EMAIL(id), options);
  }

  resendVerification(options = {}) {
    return this.post(Api.END_POINTS.RESEND_VERIFICATION_EMAIL(), options);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {User}
   */
  clone(data) {
    return new User(data);
  }
}
