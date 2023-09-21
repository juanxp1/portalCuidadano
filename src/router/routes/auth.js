export const auth = [
  {
    name: "Login",
    path: "iniciar-sesion",
    meta: {
      forVisitors: true,
      can: true,
    },
  },
  {
    name: "Forgot",
    path: "olvide-mi-contrasena",
    meta: {
      forVisitors: true,
      can: true,
    },
  },
  {
    name: "Register",
    path: "registrarme",
    meta: {
      forVisitors: true,
      can: true,
    },
  },
  {
    name: "Reset",
    path: "restaurar-contrasena",
    meta: {
      forVisitors: true,
      can: true,
    },
  },
  {
    name: "Verify",
    path: "verificar-cuenta",
    meta: {
      requiresAuth: true,
      can: true,
    },
  },
];
