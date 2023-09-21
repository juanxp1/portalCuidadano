import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Orfeo extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.ORFEO(), data);
  }
  info(id, options = {}) {
    return this.post(`${Api.END_POINTS.ORFEO()}/${id}`, options);
  }

  clubes(options = {}) {
    return this.postWithFiles(Api.END_POINTS.ORFEO_CLUBES(), options);
  }

  autocomplete(options = {}) {
    return this.get(Api.END_POINTS.ORFEO_AUTOCOMPLETE(), options);
  }

  sportsOrfeo(options = {}) {
    return this.get(Api.END_POINTS.ORFEO_SPORTS(), options);
  }

  files(options = {}) {
    return this.post(Api.END_POINTS.ORFEO_ATTACHMENT(), options);
  }

  history(options = {}) {
    return this.post(Api.END_POINTS.ORFEO_HISTORY(), options);
  }
}
