// Spanish
import EsGlobal from "./global/es";
import EsRoutes from "./routes/es";
import EsButtons from "./buttons/es";
import EsAuth from "./pages/auth/es";
import EsDash from "./pages/dashboard/es";
import EsLanding from "./pages/landing/es";
import EsInputs from "./forms/inputs/es";
import EsPortal from "./forms/portal/es";
import EsPayment from "./forms/payment/es";
import EsOrfeo from "./orfeo/es";
// English
import EnGlobal from "./global/en";
export default {
  es: {
    ...EsGlobal,
    ...EsRoutes,
    ...EsButtons,
    ...EsAuth,
    ...EsInputs,
    ...EsLanding,
    dashboard: EsDash,
    portal: EsPortal,
    payment: EsPayment,
    orfeo: EsOrfeo,
  },
  en: {
    ...EnGlobal,
  },
}