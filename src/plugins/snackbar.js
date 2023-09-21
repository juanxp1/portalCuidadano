import SnackbarQueue from "@/package/snackbar";

export function useSnackbarQueue(app) {
  app.use(SnackbarQueue);
}
