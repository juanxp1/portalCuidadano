import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Social extends Model {
  constructor(id) {
    super(Api.END_POINTS.SOCIAL_PROGRAMS(id), {});
  }
}
