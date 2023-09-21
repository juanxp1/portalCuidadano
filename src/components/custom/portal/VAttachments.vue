<template>
  <v-data-iterator
    :options.sync="pagination"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="total"
    :items="items"
    item-key="id"
    :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
    :loading="loading"
  >
    <template #header>
      <app-card-toolbar
        :loading="loading"
        :requested-at="requested_at"
        :items="actions"
        menu-id="attach-menu"
      />
      <v-form-dialog
        use-i18n
        title="buttons.Upload"
        color="primary"
        ref="upload"
      >
        <v-form-template
          :form="form"
          :loading="loading"
          :sections="sections"
          i18n_path="portal.forms.files"
          method="storeWithFiles"
          @finished="onSuccess"
          reset-form
        />
      </v-form-dialog>
    </template>
    <template #default="{ items }">
      <v-row dense>
        <v-col v-for="item in items" :key="item.id" cols="12">
          <v-card flat color="transparent">
            <v-card-text>
              <v-list min-width="100%">
                <v-list-item
                  :disabled="loading"
                  @click="onDownload(item, false)"
                >
                  <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
                    <v-avatar :color="item.color">
                      <v-icon dark>mdi-file</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.file" />
                    <v-list-item-subtitle v-text="item.file_type" />
                    <v-list-item-subtitle>
                      <v-avatar size="15" :color="item.color" left />
                      {{ item.status }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <app-time-ago :date-time="item.created_at" />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action class="hidden-sm-and-down">
                    <v-menu offset-y left>
                      <template #activator="{ on: menu, attrs }">
                        <v-tooltip left>
                          <template #activator="{ on: tooltip }">
                            <v-btn
                              :aria-label="$t('buttons.MoreOptions')"
                              icon
                              v-bind="attrs"
                              v-on="{ ...menu, ...tooltip }"
                            >
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("buttons.MoreOptions") }}</span>
                        </v-tooltip>
                      </template>
                      <v-list dense>
                        <v-list-item @click="onDownload(item, false)">
                          <v-list-item-icon>
                            <v-icon>mdi-eye</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t("buttons.View") }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="onDownload(item)">
                          <v-list-item-icon>
                            <v-icon>mdi-cloud-download</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t("buttons.Download") }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions
              v-if="$vuetify.breakpoint.smAndDown"
              class="text-center"
            >
              <v-menu offset-y left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    :aria-label="$t('buttons.MoreOptions')"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>mdi-dots-vertical</v-icon>
                    {{ $t("buttons.MoreOptions") }}
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="onDownload(item, false)">
                    <v-list-item-icon>
                      <v-icon>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t("buttons.View") }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="onDownload(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-cloud-download</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      {{ $t("buttons.Download") }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-check-dialog
          ref="pdfDialog"
          :toolbar-color="selectedFile.color || 'primary'"
          :title="`${selectedFile.file}`"
          :show-btn="false"
          width="100%"
          fullscreen
        >
          <v-pdf
            style="height: 100vh"
            :file-name="selectedFile.file"
            :pdf="selectedFile.src"
            :config="config"
          />
        </v-check-dialog>
      </v-row>
    </template>
    <template #no-data>
      <v-empty-state
        icon="mdi-paperclip"
        :label="$t('portal.forms.states.Attachments')"
      >
        <v-card flat color="transparent">
          <v-card-text>
            <app-btn path="buttons.Upload" color="primary" @click="onTour" />
          </v-card-text>
        </v-card>
      </v-empty-state>
    </template>
    <template #loading>
      <v-skeleton-loader type="list-item-avatar-two-line@5" />
    </template>
  </v-data-iterator>
</template>

<script>
import FileSaver from "file-saver";
import Base64ToBlob from "@/util/Base64ToBlob";
import { Arrow } from "@/plugins/Arrow";
import { File } from "@/models/services/portal/File";
import { FileType } from "@/models/services/portal/FileType";
import VPdf from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";

export default {
  name: "VAttachments",
  components: { VPdf },
  props: {
    profileId: {
      type: [Number, String],
    },
  },
  watch: {
    profileId(val) {
      this.form = new File(val);
      this.getData();
    },
    "pagination.page"() {
      return this.form && this.getData();
    },
    itemsPerPage() {
      return this.form && this.getData();
    },
  },
  data: (vm) => ({
    requested_at: null,
    config: {
      sidebar: {
        viewThumbnail: true,
        viewOutline: true,
        viewAttachments: true,
      },
      secondaryToolbar: {
        secondaryPresentationMode: true,
        secondaryOpenFile: false,
        secondaryPrint: false,
        secondaryDownload: true,
        secondaryViewBookmark: false,
        firstPage: true,
        lastPage: true,
        pageRotateCw: true,
        pageRotateCcw: true,
        cursorSelectTool: true,
        cursorHandTool: true,
        scrollVertical: true,
        scrollHorizontal: true,
        scrollWrapped: true,
        spreadNone: true,
        spreadOdd: true,
        spreadEven: true,
        documentProperties: true,
      },
      toolbar: {
        toolbarViewerLeft: {
          findbar: true,
          previous: true,
          next: true,
          pageNumber: true,
        },
        toolbarViewerRight: {
          presentationMode: true,
          openFile: false,
          print: false,
          download: true,
          viewBookmark: false,
        },
        toolbarViewerMiddle: {
          zoomOut: true,
          zoomIn: true,
          scaleSelectContainer: true,
        },
      },
      errorWrapper: true,
    },
    arrow: new Arrow(window, window.document, "primary"),
    loading: false,
    form: new File(vm.profileId),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 30, 30, 50, 100],
    selectedFile: {},
    file_type: new FileType(),
    file_types: [],
  }),
  created() {
    this.getFileTypes();
  },
  methods: {
    getData() {
      this.loading = true;
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      };
      this.form
        .index({ params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onDownload(item, download = true) {
      this.loading = true;
      this.form
        .download(this.profileId, item.id)
        .then((response) => {
          if (download) {
            FileSaver.saveAs(
              new Base64ToBlob(response.data.file).blob(),
              response.data.name
            );
          } else {
            this.page = 1;
            this.rotate = 0;
            this.selectedFile = {
              ...item,
              name: response.data.name,
              src: response.data.file,
            };
          }
        })
        .then(() => {
          if (download) {
            this.arrow.show(6000);
          } else {
            this.$refs.pdfDialog.open().catch(() => {
              this.selectedFile = {};
            });
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onError() {
      this.$snackbar.error(this.$t("portal.forms.files.errorPreview"));
    },
    getFileTypes() {
      this.loading = true;
      this.file_type
        .index()
        .then((response) => {
          this.file_types = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onOpen() {
      this.$refs.upload.open();
    },
    onSuccess() {
      this.getData();
      this.$nextTick(function () {
        this.$refs.upload.close();
      });
    },
    onTour() {
      const tour = this.$shepherd({
        useModalOverlay: true,
      });
      tour.addStep({
        attachTo: { element: "#attach-menu", on: "top" },
        defaultStepOptions: {
          scrollTo: {
            behavior: "smooth",
            block: "center",
          },
          cancelIcon: {
            enabled: true,
          },
        },
        canClickTarget: false,
        title: "Menú de opciones",
        text: `<p>Al dar clic sobre el botón aparecerá una lista de opciones que permitirán realizar acciones dentro del sistema.</p>
            <ul style="margin-left: 20px; margin-top: 5px;">
              <li>Adjuntar un nuevo archivo</li>
              <li>Actualizar el listado de documentos</li>
            </ul>
          `,
        buttons: [
          {
            action() {
              return this.next();
            },
            text: "Entendido",
          },
        ],
      });
      tour.start();
    },
  },
  computed: {
    actions() {
      return [
        {
          icon: "mdi-paperclip",
          text: "buttons.Upload",
          action: this.onOpen,
        },
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.getData,
        },
      ];
    },
    sections() {
      return [
        {
          title: "",
          fields: [
            {
              name: "file_type_id",
              icon: "mdi-card-account-details",
              type: "select",
              rules: this.form.validations.input_number_required,
              flex: 12,
              values: this.file_types,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "file",
              icon: "mdi-paperclip",
              type: "dropzone",
              rules: this.form.validations.pdf_file_required,
              flex: 12,
              attrs: {
                // hint: "Archivo en formato PDF",
                // persistentHint: true,
                accept: "application/pdf",
                required: true,
              },
            },
          ],
        },
      ];
    },
  },
};
</script>
