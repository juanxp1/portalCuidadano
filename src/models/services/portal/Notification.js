import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Notification extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_PROFILES_NOTIFICATIONS(), data);
  }
  clone(id, data = {}) {
    return new Notification(data);
  }
}
