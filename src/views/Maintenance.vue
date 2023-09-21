<template>
  <v-main style="background: #594d95">
    <v-container fluid class="fill-height">
      <v-row dense>
        <v-col cols="12" md="6" sm="12" class="mx-auto">
          <v-card flat color="transparent" class="justify-center align-center">
            <v-card-title class="text-center">
              <v-avatar size="80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 202.24 202.24"
                >
                  <g id="alert" data-name="alert">
                    <path
                      fill="#fff"
                      d="M101.12,0A101.12,101.12,0,1,0,202.24,101.12,101.12,101.12,0,0,0,101.12,0ZM159,148.76H43.28a11.57,11.57,0,0,1-10-17.34L91.09,31.16a11.57,11.57,0,0,1,20.06,0L169,131.43a11.57,11.57,0,0,1-10,17.34Z"
                    />
                    <path
                      fill="#fff"
                      d="M101.12,36.93h0L43.27,137.21H159L101.13,36.94Zm0,88.7a7.71,7.71,0,1,1,7.71-7.71A7.71,7.71,0,0,1,101.12,125.63Zm7.71-50.13a7.56,7.56,0,0,1-.11,1.3l-3.8,22.49a3.86,3.86,0,0,1-7.61,0l-3.8-22.49a8,8,0,0,1-.11-1.3,7.71,7.71,0,1,1,15.43,0Z"
                    />
                  </g>
                </svg>
              </v-avatar>
            </v-card-title>
            <v-card-title
              tag="h1"
              class="white--text text-center display-serif-2"
            >
              Volveremos Pronto
            </v-card-title>
            <v-card-text class="mt-4">
              <h3 class="white--text">
                El sitio está en mantenimiento, pronto serán restablecidos
                los servicios.<br />
                Agradecemos tu comprensión.<br />
                Gracias.
              </h3>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "MaintenanceView",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,700");
.cls-1 {
  fill: #fff;
}
</style>
