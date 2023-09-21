export const parks = [
  {
    name: "Search",
    path: "buscar",
    props: true,
    meta: {
      can: true,
    },
  },
  {
    name: "StatusRegister",
    path: "estado-registro",
    meta: {
      can: true,
    },
  },
  {
    name: "Orfeo",
    path: "radicados",
    meta: {
      can: true,
    },
  },
  {
    name: "OrfeoClub",
    path: "clubes",
    meta: {
      can: true,
    },
  },
  {
    name: "SyntheticFields",
    path: "canchas-sinteticas",
    props: true,
    meta: {
      can: true,
    },
  },
  {
    name: "Grills",
    path: "asadores",
    props: true,
    meta: {
      can: true,
    },
  },
  {
    name: "AgendaEvents",
    path: "agenda-idrd",
    props: true,
    meta: {
      can: true,
    },
  },
  {
    name: "PassThrough",
    path: "actividades",
    meta: {
      alias: "CitizenActivities",
    },
    children: [
      {
        name: "CitizenActivities",
        path: "",
        props: true,
        meta: {
          can: true,
        },
      },
      {
        name: "OtherActivities",
        path: "recreacion",
        props: true,
        meta: {
          can: true,
        },
      },
      {
        name: "PassThrough",
        path: "deportes",
        props: true,
        meta: {
          alias: "SportActivities",
          can: true,
        },
        children: [
          {
            name: "SportActivities",
            path: "",
            props: true,
            meta: {
              can: true,
            },
          },
          {
            name: "ActivityDetails",
            path: ":id-:slug?",
            props: true,
            meta: {
              can: true,
            },
          },
        ],
      },
    ],
  },
  {
    name: "ParkLocalities",
    path: "localidades",
    props: {
      showLocationsFirst: true,
    },
    meta: {
      can: true,
    },
  },
  {
    name: "ParkDiagrams",
    path: "diagramas-de-parques",
    meta: {
      can: true,
    },
  },
  {
    name: "Map",
    path: "mapa",
    meta: {
      can: true,
    },
  },
  {
    name: "SearchType",
    path: "escalas-de-parques/:type_id?-:name?",
    props: {
      showTypesFirst: true,
    },
    meta: {
      can: true,
    },
  },
  {
    name: "PassThrough",
    path: ":id/detalles",
    meta: {
      alias: "Park",
    },
    children: [
      {
        name: "Park",
        path: "",
        meta: {
          can: true,
          setProminent: true,
        },
      },
      {
        name: "ParkEndowment",
        path: ":endowmentId/dotacion",
        meta: {
          can: true,
        },
      },
      {
        name: "ParkDiagram",
        path: "diagrama",
        meta: {
          can: true,
          setProminent: true,
        },
      },
      {
        name: "Social",
        path: "gestion-social",
        meta: {
          can: true,
        },
      },
      {
        name: "Activities",
        path: "actividades-de-recreacion",
        meta: {
          can: true,
        },
      },
    ],
  },
];
