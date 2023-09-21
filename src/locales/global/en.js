import EnVuetify from "vuetify/lib/locale/es";
import EnValidation from "vee-validate/dist/locale/en.json";
export default {
  $vuetify: EnVuetify,
  validation: {
    password:
      "The {_field_} must contain lowercase and uppercase alphabetical character, numbers and especial characters",
    lat_long: "The {_field_} is not a valid latitude or longitude",
    any_number: "The {_field_} field may only contain numeric characters",
    alpha_dots:
      "The {_field_} field may only contain alphabetic characters as well as dots",
    date_format: "The {_field_} field is not a valid date",
    greater_than_or_equal_to:
      "The {_field_} field must be greater than or equal to {target}",
    greater_than: "The {_field_} field must be greater than {target}",
    less_than_or_equal_to:
      "The {_field_} field must be less than or equal to {target}",
    less_than: "The {_field_} field must be less than {target}",
    date_equal_to: "The {_field_} field must be equal to {target}",
    date_is_between: "The {_field_} field must be between {min} and {max}",
    ...EnValidation.messages,
  },
  pwa: {
    install: "Install Citizen Portal",
    "new-content-available":
      "🎉 New content is available. Click **Refresh** to update.",
    ignore: "Don't ask again",
    refresh: "Refresh",
  },
  footer: {
    text: "© {year}, made with {icon} by {link} for a better web",
    about: "About Us",
    social: "Follow Us",
    site: "Site",
    interest: "Links of interest",
  },
};
