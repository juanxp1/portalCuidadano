const meta = {
  requiresAuth: true,
  can: true,
};
export const dashboard = [
  {
    name: "Dashboard",
    path: "dashboard",
    meta,
  },
  {
    name: "Profile",
    path: "perfil",
    meta,
  },
  {
    name: "PassThrough",
    path: "beneficiarios",
    meta: {
      ...meta,
      alias: "People",
    },
    children: [
      {
        name: "People",
        path: "",
        meta,
      },
      {
        name: "Subscriptions",
        path: "actividades",
        meta,
      },
      {
        name: "SubscriptionDetails",
        path: "actividades/:id",
        meta,
      },
      {
        name: "Person",
        path: ":id",
        meta,
      },
    ],
  },
  {
    name: "PassThrough",
    path: "reservas",
    meta: {
      ...meta,
      alias: "Booking",
    },
    children: [
      {
        name: "Booking",
        path: "",
        meta,
      },
      {
        name: "BookingDates",
        path: ":id/reservar",
        meta,
      },
      {
        name: "Bookings",
        path: "mis-reservas",
        meta,
      },
    ],
  },
  {
    name: "PassThrough",
    path: "pagos",
    meta: {
      ...meta,
      alias: "Payments",
    },
    children: [
      {
        name: "Payments",
        path: "",
        meta,
      },
      {
        name: "Payment",
        path: "comprobante/:id",
        meta,
      },
      {
        name: "Services",
        path: "otros-servicios",
        meta,
      },
    ],
  },
  {
    name: "Notifications",
    path: "notificaciones",
    meta,
  },
];
