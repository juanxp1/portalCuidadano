export default {
  landing: {
    index: {
      services: {
        title: "Servicios",
        description:
          "Conoce los servicios de Canchas Sintéticas y Asadores disponibles para alquilar.",
      },
      agenda: {
        title: "Agenda",
        description:
          "Encuentra aquí los próximos eventos ofrecidos por el IDRD.",
      },
      activities: {
        title: "Actividades de Interés",
        description:
          "Encuentra aquí las próximas actividades ofrecidas por el IDRD.",
        cards: [
          {
            image: require("@/assets/img/landing/recreation.jpeg"),
            category: "Actividades",
            title: "Recreación",
            description: [
              "Busca los programas, servicios y ofertas de Recreación que te gustan o pueden interesar.",
              "Conoce nuevas actividades o eventos Recreativos en los que puedes participar.",
              "Conoce los actividades cerca de ti.",
              "Cómo inscribirte o participar.",
            ],
            to: { name: "OtherActivities" },
          },
          {
            image: require("@/assets/img/landing/sports.jpg"),
            category: "Actividades",
            title: "Deportes",
            description: [
              "Busca los programas, servicios y ofertas del deporte que te gustan o pueden interesar.",
              "Conoce nuevos deportes.",
              "Conoce los deportes cerca de ti.",
              "Conoce información de las Ligas Deportivas.",
              "Conoce información de los Clubes Deportivos.",
              "Cómo inscribirte o participar.",
            ],
            to: { name: "SportActivities" },
          },
          /*
          {
            image: require("@/assets/img/landing/program.jpeg"),
            category: "Actividades",
            title: "Programas Institucionales",
            description: [
              "Conocer los programas institucionales.",
              "Conoce los programas cerca de ti.",
              "Conoce información de los equipos de trabajo encargados de orientar y dirigir las actividades en cada programa.",
              "Cómo inscribirte o participar.",
            ],
            disabled: true,
            to: { name: "Home" },
          },
           */
        ],
      },
      parks: {
        title: "Parques de Bogotá",
        description:
          "Bogotá dispone de 5.134 parques de carácter público para que los residentes en la ciudad dispongan de adecuados espacios donde aprovechar su tiempo libre. Se encuentran distribuidos en 19 de las 20 localidades de la ciudad, conformando el Sistema Distrital de Parques. De ellos, 108 son administrados por el IDRD, a través de la Subdirección de Parques y Escenarios, encargada de su preservación y mantenimiento, así como de su aprovechamiento económico. De igual manera, sensibiliza a la ciudadanía en torno a su apropiación y adecuada utilización, que beneficie a toda la comunidad.",
      },
      other: {
        title: "Otros servicios",
      },
      interactive: {
        title: "Parques por Localidades",
        description:
          "Da clic en el mapa sobre una localidad o seleccionala en la lista desplegable para mostrar los parques situados en el sector seleccionado.",
      },
    },
  },
};
