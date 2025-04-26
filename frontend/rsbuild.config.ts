import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    tags: [
      {
        tag: "script",
        attrs: {
          src: "https://umami.torrtle.co/umami.js",
          "data-website-id": "1d97a601-d42e-4262-b48e-a8f00ed4fb7b",
          async: true,
          defer: true,
        },
      },
    ],
  },
});
