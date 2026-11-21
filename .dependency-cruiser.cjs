// Les règles de la Clean Architecture, vérifiées automatiquement (pnpm depcruise, et en CI).
const notTests = "\\.test\\.ts$";

module.exports = {
  forbidden: [
    {
      name: "domain-pur",
      comment: "Le domaine ne dépend de rien : ni Prisma, ni Next.js, ni des autres couches.",
      severity: "error",
      from: { path: "^packages/domain/src", pathNot: notTests },
      to: { pathNot: "^packages/domain/src" },
    },
    {
      name: "application-sans-technique",
      comment: "L'application ne connaît que le domaine. Prisma reste dans infra.",
      severity: "error",
      from: { path: "^packages/application/src", pathNot: notTests },
      to: { pathNot: "^packages/(application|domain)/src" },
    },
    {
      name: "web-sans-prisma",
      comment: "La présentation n'importe jamais le client Prisma.",
      severity: "error",
      from: { path: "^apps/web" },
      to: { path: "^packages/db" },
    },
    {
      name: "infra-seulement-dans-le-container",
      comment: "Seul le composition root choisit les implémentations concrètes.",
      severity: "error",
      from: { path: "^apps/web/src", pathNot: "^apps/web/src/container" },
      to: { path: "^packages/infra" },
    },
    {
      name: "pas-de-cycle",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(node_modules|/generated/|\\.next)" },
    tsConfig: { fileName: "apps/web/tsconfig.json" }, // pour l'alias « @/… » de l'app web
    enhancedResolveOptions: { exportsFields: ["exports"], conditionNames: ["import", "require", "default"] },
  },
};
