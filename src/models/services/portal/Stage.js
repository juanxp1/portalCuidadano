import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Stage extends Model {
  constructor() {
    super(Api.END_POINTS.PORTAL_STAGES(), {});
  }
}
