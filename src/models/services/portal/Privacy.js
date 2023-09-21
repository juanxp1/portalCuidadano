import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Privacidad permite obtener el texto de términos y condiciones
 * y el consentimiento informado para registro de beneficiarios.
 *
 *
 * @class BloodType
 * @constructor
 * @public
 *
 *
 */
export class Privacy extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_PRIVACY_TERMS(), data);
  }

  /**
   * Obtiene el consentimiento informado para los participantes
   *
   * @param {object} options Modificador de axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  consent(options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PRIVACY_CONSENT(), options);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Privacy}
   */
  clone(data = {}) {
    return new Privacy(data);
  }
}
