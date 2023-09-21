import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class RegisterStatus extends Model {
  constructor(
    data = {
      document: null,
      email: null,
    }
  ) {
    super(Api.END_POINTS.PORTAL_REGISTER_STATUS(), data);
  }

  index(options = {}) {
    return this.get(this.url, options);
  }
}
