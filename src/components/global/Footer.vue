<template>
  <v-footer id="landing-core-footer" v-bind="$attrs" color="transparent">
    <v-container>
      <v-row v-if="!hideExtended" justify="start" align="start" no-gutters>
        <v-col cols="12" sm="12" md="4" class="pa-1">
          <i18n tag="h5" class="display-serif-1 mb-3" path="footer.about" />
          <v-list class="mx-auto" color="transparent" dense>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-domain</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                Instituto Distrital de Recreación y Deporte - IDRD
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-pin</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                Dirección: Calle 63 # 59A - 06 Bogotá - Colombia
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-phone</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                Teléfono: +57 (601) 6605400 Ext.251, 252 y 265, Línea gratuita:
                01-8000-113199
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                Horario de atención: lunes a viernes de 8:00 a.m. a 1:00 p.m. y
                de 2:00 p.m. a 4:30 p.m.
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                atncliente@idrd.gov.co
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                Correo electrónico para notificaciones judiciales:
                notificaciones.judiciales@idrd.gov.co
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon class="text-center mr-2">
                <v-icon small dark>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="caption font-weight-light">
                Radicación virtual: idrdcorrespondencia@idrd.gov.co
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" sm="12" md="2" class="pa-1">
          <i18n tag="h5" class="display-serif-1 mb-3" path="footer.site" />
          <ul class="links-vertical">
            <li v-for="(link, i) in links" :key="i">
              <router-link
                text
                class="text-uppercase grey--text text-md-left text-sm-center font-weight-bold"
                style="text-decoration: none"
                v-text="link.text"
                :to="link.href"
              />
            </li>
          </ul>
        </v-col>
        <v-col cols="12" sm="12" md="3" class="pa-1">
          <i18n tag="h5" class="display-serif-1 mb-3" path="footer.interest" />
          <ul class="links-vertical">
            <li v-for="(interest, i) in interests" :key="i">
              <v-divider v-if="interest.divider" class="my-2"></v-divider>
              <a
                v-else
                class="text-uppercase grey--text text-md-left text-sm-center font-weight-bold"
                style="text-decoration: none"
                :href="interest.href"
                target="_blank"
                v-text="interest.text"
              />
            </li>
          </ul>
        </v-col>
        <v-col cols="12" sm="12" md="3" class="pa-1">
          <i18n tag="h5" path="footer.social" class="display-serif-1 mb-3" />
          <v-btn
            v-for="s in social"
            :key="s.key"
            :aria-label="s.alt"
            :color="s.color"
            dark
            large
            icon
            min-width="0"
            :class="s.class"
            :href="s.link"
            target="_blank"
          >
            <v-icon :aria-label="s.alt" :color="s.color" v-text="s.icon" />
          </v-btn>
          <h5 class="display-serif-1 mb-3">Colombia</h5>
          <h4 class="display-serif-1 mb-3">
            <a href="https://www.colombia.co/" target="_blank">
              <v-icon aria-label="Colombia" size="80" right>
                $vuetify.icons.colombia
              </v-icon>
            </a>
            <a href="https://idrd.gov.co" target="_blank">
              <v-icon aria-label="IDRD" size="80" right>
                $vuetify.icons.bogota
              </v-icon>
            </a>
          </h4>
          <h5 class="display-serif-1 mb-3">Legal</h5>
          <ul class="links-vertical">
            <li>
              <a
                href="https://www.idrd.gov.co/transparencia-acceso-informacion-publica/normativa/politicas-lineamientos-manuales"
                target="_blank"
                class="text-uppercase grey--text text-md-left text-sm-center font-weight-bold"
                style="text-decoration: none"
              >
                Políticas
              </a>
            </li>
            <li>
              <a
                href="https://www.idrd.gov.co/terminos-y-condiciones"
                target="_blank"
                class="text-uppercase grey--text text-md-left text-sm-center font-weight-bold"
                style="text-decoration: none"
              >
                Términos y Condiciones
              </a>
            </li>
          </ul>
          <h5 class="display-serif-1 mt-3">Descarga la App</h5>
          <h4 class="display-serif-1 mb-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.eventos_idrd"
              target="_blank"
            >
              <v-icon aria-label="Andriod" size="90" right>
                $vuetify.icons.android
              </v-icon>
            </a>
            <a
              href="https://apps.apple.com/co/app/agenda-idrd/id1573422708"
              target="_blank"
            >
              <v-icon aria-label="ios" size="90" right>
                $vuetify.icons.ios
              </v-icon>
            </a>
          </h4>
        </v-col>
      </v-row>
      <v-divider class="my-4" light></v-divider>
      <v-row class="mt-6" align="center" justify="center" no-gutters>
        <v-col cols="12" md="auto">
          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
            <i18n path="footer.text">
              <template #year>
                {{ $moment().year() }}
              </template>
              <template #icon>
                <v-icon size="20"> mdi-heart </v-icon>
              </template>
              <template #link>
                <a :href="href" target="_blank" v-text="name" />
              </template>
            </i18n>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
  props: {
    hideExtended: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    social: [
      {
        alt: "Twitter",
        link: "https://twitter.com/IDRD",
        color: "#55ACEE",
        class: "v-btn--twitter",
        icon: "mdi-twitter",
      },
      {
        alt: "Facebook",
        link: "https://www.facebook.com/IDRDBogota",
        color: "#3B5998",
        class: "v-btn--facebook",
        icon: "mdi-facebook",
      },
      {
        alt: "YouTube",
        link: "https://www.youtube.com/user/PrensaIDRD",
        color: "#E52D27",
        class: "v-btn--youtube",
        icon: "mdi-youtube",
      },
      {
        alt: "Instagram",
        link: "https://www.instagram.com/idrdbogota/",
        color: "#35465C",
        class: "v-btn--tumblr",
        icon: "mdi-instagram",
      },
    ],
    interests: [
      {
        href: "https://sim.idrd.gov.co/reserva-salon/",
        text: "Reserva Salón Presidente",
      },
      {
        href: "https://sim.idrd.gov.co/pasaporte-vital-en-linea/",
        text: "Pasaporte Vital en Línea",
      },
      {
        href: "https://mapas.bogota.gov.co/#",
        text: "Mapas Bogotá",
      },
      {
        divider: true,
      },
      {
        href: "https://bogota.gov.co/",
        text: "Portal Bogotá",
      },
      {
        href: "https://www.gobiernoenlinea.com.co/",
        text: "Gobierno en Línea",
      },
      {
        href: "https://www.presidencia.gov.co/",
        text: "Presidencia de la República",
      },
      {
        href: "https://www.mintic.gov.co/portal/inicio/",
        text: "MinTIC",
      },
      {
        href: "https://www.procuraduria.gov.co/portal/",
        text: "Procuraduría General de la Nación",
      },
      {
        href: "https://www.contraloria.gov.co/",
        text: "Contraloría General de la República",
      },
      {
        href: "https://www.personeriabogota.gov.co/",
        text: "Personería Distrital",
      },
      {
        href: "https://concejodebogota.gov.co/cbogota/site/edic/base/port/inicio.php",
        text: "Concejo de Bogotá",
      },
      {
        href: "http://www.veeduriadistrital.gov.co/",
        text: "Veeduría Distrital",
      },
    ],
  }),
  computed: {
    href() {
      return process.env.VUE_APP_FOOTER_LINK;
    },
    name() {
      return process.env.VUE_APP_FOOTER_LINK_NAME;
    },
    links() {
      return [
        {
          href: { name: "Home" },
          text: this.$t("menu.home"),
        },
        {
          href: { name: "Login" },
          text: this.$t("menu.login"),
        },
        {
          href: { name: "Register" },
          text: this.$t("menu.register"),
        },
        {
          href: { name: "Search" },
          text: this.$t("menu.search"),
        },
        {
          href: { name: "Map" },
          text: this.$t("router.map"),
        },
        {
          href: { name: "SyntheticFields" },
          text: this.$t("menu.syntheticfields"),
        },
        {
          href: { name: "Grills" },
          text: this.$t("menu.grills"),
        },
        {
          href: { name: "CitizenActivities" },
          text: this.$t("menu.citizenactivities"),
        },
        {
          href: { name: "ParkDiagrams" },
          text: this.$t("router.parkdiagrams"),
        },
        {
          href: {
            name: "ParkLocalities",
            props: {
              showLocationsFirst: true,
            },
          },
          text: this.$t("menu.searchlocality"),
        },
        {
          href: {
            name: "SearchType",
            props: {
              showTypesFirst: true,
            },
          },
          text: this.$t("menu.searchtype"),
        },
      ];
    },
  },
};
</script>

<style lang="sass">
.theme--dark
  #landing-core-footer
    a
      color: #FFFFFF
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
.theme--light
  #landing-core-footer
    a
      color: #616161
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase

footer ul.links-vertical li
  display: block
  margin-left: -30px
footer ul.links-vertical li a
  padding: 5px
</style>
