import resolve from "@rollup/plugin-node-resolve";
export default [
  {
    input: "./src/index.js",
    output: [
      {
        file: "./dist/index.js",
        format: "cjs",
      },
      {
        file: "./dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [resolve()],
  },
];
