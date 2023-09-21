// eslint-disable-next-line
import Vue from "vue";
import { Errors as ErrorBag } from "@/models/Errors";
/**
 * La clase Form contiene métodos por defecto para realizar peticiones
 * HTTP a rutas establecidas con sus respectivos verbos [GET, POST, PUT,
 * PATCH, DELETE] y manejo de resultados y/o errores de respuesta y conversión
 * de datos de formularios y almacenamiento de errores
 *
 * @class Model
 * @constructor
 * @public
 *
 * @property {object} originalData Copia exacta de los valores por defecto de los
 * parámetros establecidos para enviar a los endpoints
 * @property {Vue.axios} $axios Instancia de axios preconfigurada globalmente
 * @property {object} errors Instancia para el control de errores provenientes del Backend
 * @property {boolean} resetOnlyWhenUpdate Indica si restaura el formulario a los valores por defecto
 */
export class Form {
  /**
   * Inicializa los parámetros y los asocia a propiedades de la clase
   *
   * @param  {object} data Recibe y sobreescribe los parámetros por defecto que se envían a las rutas especificadas
   */
  constructor(data) {
    this.originalData = data;
    for (const field in data) {
      this[field] = data[field];
    }
    this.form = null;
    this.errors = new ErrorBag();
    this.$axios = Vue.axios;
    this.resetOnlyWhenUpdate = true;
  }

  /**
   * Get the html form reference to set backend errors
   *
   * @param $ref
   */
  setFormInstance($ref = null) {
    this.errors = new ErrorBag($ref);
  }

  /**
   * Clear the form data to original data after send a request
   */
  reset() {
    for (const field in this.originalData) {
      this[field] = this.originalData[field];
    }
    this.errors.clear();
  }

  /**
   * Return the form data
   * @returns {object}
   */
  data() {
    const data = {};
    for (const property in this.originalData) {
      data[property] = this[property];
    }
    return data;
  }

  /**
   * Create a FormData helpful to send files.
   * If the the method is for update with field
   * this add an input with the PUT name method
   *
   * @param withPutMethod
   * @returns {FormData}
   */
  dataWithFiles(withPutMethod = false) {
    let data;
    if (withPutMethod) {
      data = {
        ...this.data(),
        _method: "PUT",
      };
    } else {
      data = this.data();
    }
    return this.convertModelToFormData(data);
  }

  /**
   * Create a new FormData instance with an object
   *
   * @param {any} val Any value
   * @param {FormData} formData FormData instance
   * @param {string} namespace
   * @returns {FormData}
   */
  convertModelToFormData(val, formData = new FormData(), namespace = "") {
    if (typeof val !== "undefined" && val !== null) {
      if (Array.isArray(val)) {
        let i = 0;
        for (const element of val) {
          this.convertModelToFormData(
            element,
            formData,
            namespace + "[" + i + "]"
          );
          i++;
        }
      } else if (typeof val === "object" && !(val instanceof File)) {
        for (const propertyName in val) {
          if (Object.prototype.hasOwnProperty.call(val, propertyName)) {
            this.convertModelToFormData(
              val[propertyName],
              formData,
              namespace ? namespace + "[" + propertyName + "]" : propertyName
            );
          }
        }
      } else if (typeof val === "boolean") {
        formData.append(namespace, val ? 1 : 0);
      } else {
        formData.append(namespace, val);
      }
    }
    return formData;
  }

  /**
   * Make the request to backend
   *
   * @param {string} method Indicate the request must be sent to the endpoint
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @param {boolean} hasFiles Indicate if request must send files
   * @returns {Promise<unknown>}
   */
  submit(method, url, options = {}, hasFiles = false) {
    return new Promise((resolve, reject) => {
      method = method.toLowerCase();
      if (window.navigator.onLine) {
        let request;
        if (hasFiles) {
          request =
            method === "put"
              ? this.$axios.post(url, this.dataWithFiles(true), options)
              : this.$axios[method](url, this.dataWithFiles(), options);
        } else {
          request =
            method !== "get" && method !== "delete"
              ? this.$axios[method](url, this.data(), options)
              : this.$axios[method](url, options);
        }

        request
          .then((response) => {
            this.onSuccess(method !== "put");
            resolve(response.data);
          })
          .catch((error) => {
            if (this.$axios.isCancel(error)) {
              // eslint-disable-next-line
                console.log('Request canceled', error.message)
            } else {
              if (error.response) {
                this.onFail(error.response.data);
                reject(error.response.data);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                reject(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // eslint-disable-next-line
                reject(error.message || error);
              }
              reject(error);
            }
          });
      } else {
        // eslint-disable-next-line
        console.info('You are working in offline mode.')
        reject(new TypeError("You are working in offline mode."));
      }
    });
  }

  /**
   * Create a new Request instance from axios
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  post(url, options = {}) {
    return this.submit("POST", url, options);
  }

  /**
   * Create a new FormData instance
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  postWithFiles(url, options = {}) {
    return this.submit(
      "POST",
      url,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...options,
      },
      true
    );
  }

  /**
   * Create a new Request instance from axios
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  get(url, options = {}) {
    return this.submit("GET", url, options);
  }

  /**
   * Create a new Request instance from axios
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  put(url, options = {}) {
    return this.submit("PUT", url, options);
  }

  /**
   * Create a new FormData instance
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  putWithFiles(url, options = {}) {
    return this.submit(
      "PUT",
      url,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...options,
      },
      true
    );
  }

  /**
   * Create a new Request instance from axios
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  delete(url, options = {}) {
    return this.submit("DELETE", url, options);
  }

  /**
   * Create a new Request instance from axios
   *
   * @param {string} url API endpoint to make request
   * @param {object} options Additional params or modifiers to axios
   * @returns {Promise<ValidationOptions.unknown>}
   */
  patch(url, options = {}) {
    return this.submit("PATCH", url, options);
  }

  /**
   * Clear the data object to original only if method is POST
   *
   * @param {boolean} reset
   */
  onSuccess(reset = false) {
    if (reset && this.resetOnlyWhenUpdate) {
      this.reset();
    }
  }

  /**
   * Create a new Error instance from response
   * set the errors and if has an HTML Form
   * instance show the backend errors in form
   *
   * @param {object|any} errors
   */
  onFail(errors) {
    this.errors.record(errors);
  }
}
