import { Model } from "@/models/Model";
import { Api } from "@/models/Api";
import _ from "lodash";
import moment from "moment";

const formatD = "YYYY-MM-DD";
const formatDH = "YYYY-MM-DD HH:mm";

export class IDRDEvent extends Model {
  constructor() {
    super(Api.END_POINTS.IDRD_EVENTS(), {});
    this.axiosInstante = this.$axios.create();
    this.axiosInstante.defaults.headers.common = {};
  }

  category(id) {
    switch (id) {
      case 1:
      default:
        return "Recreación";
      case 2:
        return "Deporte";
      case 3:
        return "Otro Evento";
    }
  }

  checkDate(date, addHour = false) {
    if (moment(date, formatDH).isValid()) {
      let newDate = moment(date, formatDH);
      newDate = addHour ? newDate.add(1, "hours") : newDate;
      return newDate.format(formatDH);
    } else {
      return date;
    }
  }

  isSame(date1, date2) {
    if (moment(date1, formatD).isValid() && moment(date2, formatD).isValid()) {
      return moment(date1, formatD).isSame(moment(date2, formatD));
    } else {
      return false;
    }
  }

  events(limit = 0, options = {}) {
    return new Promise((resolve, reject) => {
      this.axiosInstante
        .get(Api.END_POINTS.IDRD_EVENTS(), options)
        .then(({ data }) => {
          let events = _(data.eventos)
            .filter(
              (evt) =>
                moment(evt.fecha_fin, formatD).isValid() &&
                moment()
                  .subtract(1, "day")
                  .isSameOrBefore(moment(evt.fecha_fin, formatD))
            )
            .orderBy("fecha_fin", "asc");

          if (limit) {
            events = events.take(limit).value();
          } else {
            events = events.value();
          }

          resolve(
            events.map((evt) => {
              return {
                id: evt._id,
                rev: evt._rev,
                type: evt.tipo,
                _population: evt.tipo_poblacion,
                population: (evt.tipo_poblacion || "").split(","),
                category_id: evt.categoria,
                image: (evt.lugar || "").toLowerCase().includes("facebook")
                  ? require("@/assets/events/live.png")
                  : require("@/assets/events/park.png"),
                category: this.category(parseInt(evt.categoria)),
                name: evt.nombre,
                value: evt.entrada,
                summary: evt.resumen,
                description: evt.descripcion,
                place: evt.lugar,
                start: this.checkDate(`${evt.fecha} ${evt.hora}`),
                end: this.checkDate(`${evt.fecha_fin} ${evt.hora}`, true),
                format_date: this.isSame(evt.fecha, evt.fecha_fin)
                  ? evt.fecha
                  : `${evt.fecha} / ${evt.fecha_fin}`,
                start_date: evt.fecha,
                end_date: evt.fecha_fin,
                lat: parseFloat(evt.ubicacion.lat),
                lng: parseFloat(evt.ubicacion.lon),
                hour: evt.hora,
                maps:
                  _.has(evt, "ubicacion.lat") && evt.ubicacion.lat
                    ? `https://www.google.com/maps/place/${evt.ubicacion.lat},${evt.ubicacion.lon}`
                    : `https://www.google.com/maps/place/4.657373797629958,-74.0854918502333`,
                geo:
                  _.has(evt, "ubicacion.lat") && evt.ubicacion.lat
                    ? [
                        parseFloat(evt.ubicacion.lat),
                        parseFloat(evt.ubicacion.lon),
                      ]
                    : [],
              };
            })
          );
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.data);
          } else if (error.request) {
            reject(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            // eslint-disable-next-line
                        console.error('Error', error)
            reject(error.message || error);
          }

          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line
                        console.log('Config')
            // eslint-disable-next-line
                        console.log(error)
          }
          reject(error);
        });
    });
  }
}
