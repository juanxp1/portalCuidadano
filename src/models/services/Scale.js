import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Scale extends Model {
  constructor() {
    super(Api.END_POINTS.SCALES(), {});
  }
}
