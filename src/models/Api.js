const auth = process.env.VUE_APP_AUTH_SERVER;
const portal = process.env.VUE_APP_PORTAL;
const dashboard = process.env.VUE_APP_PSE_API;
// const dashboard = "https://sim.idrd.gov.co/base-ldap/public";
const orfeo = process.env.VUA_APP_ORFEO_ENDPOINT;

import portalEP from "@/models/routes/portal";

export const Api = {
  COOKIE: process.env.VUE_APP_COOKIE,
  END_POINTS: {
    USER: () => `${auth}/api/user`,
    PROFILES: () => `${auth}/api/profiles`,
    LOGIN: () => `${auth}/api/login`,
    PRE_REGISTER: () => `${auth}/api/pre-register`,
    PRE_REGISTER_VALIDATION: () =>
      `${auth}/api/email/pre-register-verification`,
    SOCIAL: () => `${auth}/oauth/token`,
    REGISTER: () => `${auth}/api/register`,
    FORGOT_PASSWORD: () => `${auth}/api/password/forgot`,
    RESET_PASSWORD: () => `${auth}/api/password/reset`,
    CHANGE_PASSWORD: () => `${auth}/api/password/change`,
    CHANGE_EMAIL: () => `${auth}/api/email/change`,
    CONFIRM_CHANGE_EMAIL: () => `${auth}/api/email/confirm-change`,
    RESEND_CONFIRM_CHANGE_EMAIL: () =>
      `${auth}/api/email/resend-confirm-change`,
    RESEND_VERIFICATION_EMAIL: () => `${auth}/api/email/resend`,
    VERIFY_VERIFICATION_EMAIL: (id) => `${auth}/api/email/verify/${id}`,
    LOGOUT: () => `${auth}/api/logout`,
    LOGOUT_ALL_DEVICES: () => `${auth}/api/logout-all-devices`,
    CSFR: () => `${auth}/csfr-cookie`,

    //Parks
    PARKS: () => `${auth}/api/parks`,
    PARKS_ENDOWMENTS: (parkId, endowmentId) =>
      `${auth}/api/parks/${parkId}/endowments/${endowmentId}`,
    PARKS_DETAILS: (id) => `${auth}/api/parks/${id}/details`,
    PARKS_SECTORS: (id) => `${auth}/api/parks/${id}/sectors`,
    PARKS_ESRI_CONFIG: () => `${portal}/api/esri/config`,
    PARKS_EQUIPMENT: (park_id, equipment_id) =>
      `${auth}/api/parks/${park_id}/equipment/${equipment_id}`,
    SYNTHETIC: () => `${auth}/api/parks/synthetic-fields`,
    GRILLS: () => `${auth}/api/parks/grills`,
    BOOK_SCHEDULES: (id) => `${auth}/api/parks/schedules/${id}`,
    BOOK_PAYMENT: (id) => `${auth}/api/parks/schedules/${id}/payment`,
    DIAGRAMS: () => `${auth}/api/parks/diagrams`,
    PSE_PARKS: () => `${dashboard}/api/payment-gateway/parks`,
    PSE_SERVICES: (pseParkId) =>
      `${dashboard}/api/payment-gateway/services/${pseParkId}`,
    PSE_BANKS: () => `${dashboard}/api/payment-gateway/banks`,
    PSE_TRANSFER_BANKS: () => `${dashboard}/api/payment-gateway/transferBank`,
    PSE_TRANSFER_STATUS: (status) =>
      `${dashboard}/api/payment-gateway/status/${status}`,
    RESERVE_EXTERNAL: (endowment_id) =>
      `${process.env.VUE_APP_EXTERNAL_BOOKING}${endowment_id}`,
    //Recreation
    ACTIVITIES: (park_id) => `${auth}/api/recreation/${park_id}/calendar`,
    OTHERS_ACTIVITIES: () => `${auth}/api/recreation/others`,
    // Events
    IDRD_EVENTS: () => process.env.VUE_APP_EVENTOS_IDRD,
    //Recreation
    CITIZEN_PORTAL: () => `${auth}/api/citizen-portal/public-schedules`,
    CITIZEN_PORTAL_CATEGORIES: () =>
      `${auth}/api/citizen-portal/schedules/categories`,
    LATEST_BOOKINGS: () => `${auth}/api/citizen-portal/bookings`,
    //Social Management
    SOCIAL_PROGRAMS: (park_id) =>
      `${auth}/api/social-management/${park_id}/history`,
    // General
    LOCATION: () => `${auth}/api/localities`,
    SCALES: () => `${auth}/api/scales`,
    // Orfeo
    ORFEO: () => `${dashboard}/api/orfeo/exposed/filed`,
    ORFEO_CLUBES: () => `${auth}/api/orfeo-clubes`,
    ORFEO_ATTACHMENT: () => `${auth}/api/orfeo/attachments`,
    ORFEO_SPORTS: () => `${auth}/api/orfeo/sports`,
    ORFEO_HISTORY: () => `${auth}/api/orfeo/history`,
    ORFEO_AUTOCOMPLETE: () => `${auth}/api/orfeo/autocomplete`,
    // Portal
    ...portalEP,
  },
};
