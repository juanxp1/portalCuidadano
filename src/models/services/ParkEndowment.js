import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class ParkEndowment extends Model {
  constructor(parkId, endowmentId, data = {}) {
    super(Api.END_POINTS.PARKS_ENDOWMENTS(parkId, endowmentId), data);
  }
}
