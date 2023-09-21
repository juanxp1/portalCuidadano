import { Model } from "@/models/Model";
import { Api } from "@/models/Api";
import { mergeObject } from "@/util/helpers";

const form = {
  id: null,
  informed_consent: null,
  file: null,
  decoded: false,
  verified_at: null,
  // Confirmación de edad
  birthdate: null,
  age: null,
  // Datos Iniciales
  relationship: null,
  document_type_id: null,
  document: null,
  name: null,
  s_name: null,
  surname: null,
  s_surname: null,
  // Información de Residencia
  country_residence_id: null,
  state_residence_id: null,
  city_residence_id: null,
  locality_id: null,
  upz_id: null,
  neighborhood_id: null,
  other_neighborhood_name: null,
  address: null,
  stratum: null,
  mobile_phone: null,
  // Información Personal
  country_birth_id: null,
  state_birth_id: null,
  city_birth_id: null,
  // Detalles
  sex: null,
  gender_id: null,
  sexual_orientation_id: null,
  population_group_id: null,
  blood_type: null,
  ethnic_group_id: null,
  eps_id: null,
  has_disability: null,
  disability_id: null,
  contact_name: null,
  contact_phone: null,
  contact_relationship: null,
};

/**
 * La clase Beneficiarios permite adicionar beneficiarios adultos o menores
 * a un perfil existente en la base de datos.
 *
 * @class Beneficiary
 * @constructor
 * @public
 *
 * @property {string} file Archivo Documento de Identidad
 * @property {number} informed_consent Aceptación del consentimiento informado.
 * @property {string} birthdate Fecha de nacimiento
 * @property {number} age Edad
 * @property {number} country_birth_id Identificador del país de nacimiento
 * @property {number} state_birth_id Identificador del estado/depto de nacimiento
 * @property {number} city_birth_id Identificador de la ciudad de nacimiento
 * @property {number} relationship Parentesco de la persona a inscribir
 * @property {number} document_type_id Identificador del tipo de documento
 * @property {number} document Número de documento
 * @property {string} name Primer nombre
 * @property {string} s_name Segundo nombre
 * @property {string} surname Primer apellido
 * @property {string} s_surname Segundo apellido
 * @property {number} country_residence_id Identificador del país de residencia
 * @property {number} state_residence_id Identificador del estado/depto de residencia
 * @property {number} city_residence_id Identificador de la ciudad de residencia
 * @property {number} locality_id Identificador de la localidad de residencia
 * @property {number} upz_id Identificador de la Upz
 * @property {number} neighborhood_id Identificador del barrio
 * @property {string} other_neighborhood_name Otro nombre del barrio
 * @property {string} address Dirección de residencia
 * @property {number} stratum Estrato socioeconómico
 * @property {number} mobile_phone Teléfono de contacto
 * @property {number} sex Identificador del sexo
 * @property {number} gender_id Identificador del género
 * @property {number} sexual_orientation_id Identificador de la orientación sexual
 * @property {number} population_group_id Identificador del grupo poblacional
 * @property {number} blood_type Identificador del tipo de sangre
 * @property {number} ethnic_group_id Identificador del grupo étnico
 * @property {number} eps_id Identificador de la EPS
 * @property {string} has_disability Indica si tiene alguna discapacidad
 * @property {number} disability_id Identificador de la incapacidad
 * @property {number} contact_relationship Relación con el beneficiario
 * @property {string} contact_name Nombre del contacto de emergencia
 * @property {number} contact_phone Teléfono del contacto de emergencia
 */
export class Beneficiary extends Model {
  /**
   * Inicializa la ruta que debe apuntar y los parámetros que se deben
   * enviar para realizar peticiones
   *
   * @param  {object} data Recibe y sobreescribe los parámetros por defecto que se envían a las rutas especificadas
   */
  constructor(data = form) {
    //const object = mergeObject(form, data);
    super(Api.END_POINTS.PROFILES(), data);
  }

  /**
   * Obtiene las actividades asociadas al perfil
   *
   * @param {number} id Identificador del perfil a consultar
   * @param {object} options Modificadores de axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  activities(id, options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PROFILES_SCHEDULES(id), options);
  }

  /**
   * Obtiene la lista de los perfiles inscritos.
   *
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  profilesList(options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PROFILES_LIST(), options);
  }

  /**
   * Obtiene la lista de actividades inscritas y su estado
   *
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  subscriptions(options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PROFILES_SUBS(), options);
  }

  /**
   * Obtiene la actividad inscrita específica y su estado
   *
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  subscription(id, options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PROFILES_SUBS() + `/${id}`, options);
  }

  /**
   * Elimina la inscripción de un beneficiario a una actividad
   *
   * @param schedule_id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  unsubscribe(schedule_id, options = {}) {
    return this.delete(
      Api.END_POINTS.PORTAL_PROFILES_SUBS() + `/${schedule_id}`,
      options
    );
  }

  /**
   * Realiza la preinscripción de un usuario a una actividad
   *
   * @param profile_id
   * @param schedule_id
   * @param options
   * @returns {Promise<ValidationOptions.unknown>}
   */
  subscribe(profile_id, schedule_id, options = {}) {
    return this.put(
      Api.END_POINTS.PORTAL_PROFILES_SCHEDULES_SUBSCRIBE(
        profile_id,
        schedule_id
      ),
      options
    );
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Beneficiary}
   */
  clone(data = form) {
    return new Beneficiary(data);
  }
}
