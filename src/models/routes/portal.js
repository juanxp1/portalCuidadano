const auth = process.env.VUE_APP_AUTH_SERVER;
const data = process.env.VUE_APP_PSE_API;
export default {
  // ================================================ START UPDATE ================================================
  PORTAL_PROFILES_LIST: () => `${auth}/api/profiles/list`,
  PORTAL_PROFILES_SUBS: () => `${auth}/api/profiles/subscriptions`,
  PORTAL_PROFILES_SCHEDULES: (id) => `${auth}/api/profiles/${id}/schedules`,
  PORTAL_PROFILES_SCHEDULES_SUBSCRIBE: (profile_id, schedule_id) =>
    `${auth}/api/profiles/${profile_id}/schedules/${schedule_id}`,
  PORTAL_PROFILES_OBSERVATIONS: (id) =>
    `${auth}/api/profiles/${id}/observations`,
  PORTAL_PROFILES_FILES: (id) => `${auth}/api/profiles/${id}/files`,
  PORTAL_DOCUMENT_TYPES: () => `${data}/api/document-types`,
  PORTAL_PROFILES_NOTIFICATIONS: () => `${auth}/api/notifications`,
  // Files Types
  PORTAL_FILES: () => `${auth}/api/files`,
  // Countries, states, cities
  PORTAL_COUNTRIES: () => `${data}/api/countries`,
  PORTAL_STATES: (countryId) => `${data}/api/countries/${countryId}/states`,
  PORTAL_CITIES: (countryId, stateId) =>
    `${data}/api/countries/${countryId}/states/${stateId}/cities`,
  // Localidades
  PORTAL_LOCALITIES: () => `${data}/api/localities`,
  PORTAL_REGISTER_STATUS: () => `${auth}/api/register-status`,
  PORTAL_UPZ: (locationId) => `${data}/api/localities/${locationId}/upz`,
  PORTAL_NEIGHBORHOODS: (locationId, upzId) =>
    `${data}/api/localities/${locationId}/upz/${upzId}/neighborhoods`,
  PORTAL_PAYMENTS: () => `${auth}/api/citizen-portal/payments`,
  PORTAL_PAYMENTS_STATUS: (payment) =>
    `${auth}/api/payments/status/${payment}/schedule`,
  PORTAL_PAYMENTS_UPDATE: (scheduleId, reference) =>
    `${auth}/api/citizen-portal/payments/activities/${scheduleId}/${reference}`,
  PORTAL_PAYMENTS_COMPLETE: () =>
    `${auth}/api/citizen-portal/payments/autocomplete`,
  PORTAL_PROGRAMS: () => `${auth}/api/citizen-portal/programs`,
  PORTAL_PENDING_TO_PAY: () => `${auth}/api/citizen-portal/pending-to-pay`,
  PORTAL_STAGES: () => `${auth}/api/citizen-portal/stages`,
  PORTAL_GENDER: () => `${data}/api/sex`,
  PORTAL_DISABILITY: () => `${data}/api/disabilities`,
  PORTAL_RH: () => `${data}/api/blood-types`,
  PORTAL_ETHNIC_GROUP: () => `${data}/api/ethnic-groups`,
  PORTAL_POPULATION_GROUP: () => `${data}/api/population-groups`,
  PORTAL_EPS: () => `${auth}/api/eps`,
  PORTAL_GENDER_IDENTITY: () => `${data}/api/gender-identities`,
  PORTAL_SEXUAL_ORIENTATION: () => `${data}/api/sexual-orientation`,
  PORTAL_PRIVACY_TERMS: () => `${auth}/api/terms-and-conditions`,
  PORTAL_PRIVACY_CONSENT: () => `${auth}/api/informed-consent`,
  // ================================================ END UPDATE ================================================
};
