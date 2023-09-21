import Auth from "@/package/auth";

export function useAuth(app, store) {
  app.use(Auth, store);
}
