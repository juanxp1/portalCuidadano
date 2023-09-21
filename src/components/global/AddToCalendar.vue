<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :aria-label="$t('buttons.AddToCalendar')"
        :class="classes"
        v-bind="{ ...$attrs, ...attrs }"
        v-on="on"
      >
        <v-icon left>mdi-calendar</v-icon>
        {{ $t("buttons.AddToCalendar") }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :href="calendarUrl(item)"
        target="_blank"
      >
        <v-list-item-title class="text-capitalize" v-text="item" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { has } from "lodash";
const calendars = {
  google: {
    url: "http://www.google.com/calendar/render?action=TEMPLATE&trp=false",
    parameters(title, location, details, start, end) {
      const parameters = {
        text: title,
        location: location,
        details: details,
      };

      if (start && end) {
        parameters.dates = `${start}/${end}`;
      }

      return parameters;
    },
  },

  microsoft: {
    url: "https://outlook.live.com/owa/?rru=addevent",
    parameters(title, location, details, start, end) {
      return {
        subject: title,
        location: location,
        body: details,
        startdt: start,
        enddt: end,
      };
    },
  },

  office365: {
    url: "https://outlook.office.com/owa/?path=/calendar/action/compose&rru=addevent",
    parameters(title, location, details, start, end) {
      return {
        subject: title,
        location: location,
        body: details,
        startdt: start,
        enddt: end,
      };
    },
  },
};

export default {
  name: "AddToCalendar",
  props: {
    /**
     * Event class.
     * @var string
     */
    classes: {
      type: String,
      default: "",
    },
    /**
     * Event title.
     * @var string
     */
    title: {
      type: String,
      default: "",
    },

    /**
     * Event location.
     * @var string
     */
    location: {
      type: String,
      default: "",
    },

    /**
     * Event details.
     * @var string
     */
    details: {
      type: String,
      default: "",
    },

    /**
     * Event start.
     * @var date
     */
    start: {
      type: String,
      default: null,
    },

    /**
     * Event end.
     * @var date
     */
    end: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    items: ["google", "microsoft", "office365"],
    calendars,
  }),
  methods: {
    /**
     * Returns generated calendar url.
     *
     * @param calendar.
     */
    calendarUrl(calendar) {
      let url = this.calendars[calendar].url;
      const parameters = this.calendars[calendar].parameters(
        this.formatString(this.title),
        this.formatString(this.location),
        this.formatString(this.details),
        this.formatDate(this.start),
        this.formatDate(this.end)
      );
      for (const key in parameters) {
        if (has(parameters, key) && parameters[key]) {
          url += `&${key}=${parameters[key]}`;
        }
      }
      return url;
    },

    formatString(string) {
      return encodeURIComponent(string).replace(/%20/g, "+");
    },

    formatDate(date) {
      return date
        ? this.$moment(date)
            .toISOString()
            .replace(/-|:|\.\d+/g, "")
        : null;
    },
  },
};
</script>

<style scoped></style>
