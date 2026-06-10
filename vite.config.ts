import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/reflex-sprint-protoype/",
  plugins: [react()],
});
