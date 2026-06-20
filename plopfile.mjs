/**
 * Plop generators for The Content Architecture starter.
 * Run: pnpm plop
 */

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function toSchemaName(value) {
  const camel = toCamelCase(value);
  return camel.endsWith("Section") ? camel : `${camel}Section`;
}

function toPascalSectionName(value) {
  const schemaName = toSchemaName(value);
  return schemaName.charAt(0).toUpperCase() + schemaName.slice(1);
}

export default function (plop) {
  plop.setHelper("schemaName", (name) => toSchemaName(name));
  plop.setHelper("pascalSectionName", (name) => toPascalSectionName(name));

  plop.setGenerator("page-builder-section", {
    description:
      "Scaffold a new page-builder section (schema + component + registries)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Section name (kebab-case, e.g. text-banner):",
        validate: (v) => (v ? true : "Required"),
      },
      {
        type: "input",
        name: "title",
        message: "Studio title:",
        default: (answers) =>
          answers.name
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ") + " Section",
      },
      {
        type: "list",
        name: "icon",
        message: "Sanity icon:",
        choices: [
          "BlockElementIcon",
          "DocumentIcon",
          "ImageIcon",
          "RocketIcon",
          "TextIcon",
        ],
        default: "BlockElementIcon",
      },
    ],
    actions: (data) => {
      const fileBase = data.name;
      const schemaName = toSchemaName(data.name);
      const pascalName = toPascalSectionName(data.name);

      return [
        {
          type: "add",
          path: "sanity/schemas/page-sections/{{fileBase}}-section.ts",
          templateFile: "templates/page-builder-section/schema.ts.hbs",
          data: { schemaName, fileBase, title: data.title, icon: data.icon },
        },
        {
          type: "add",
          path: "features/page-builder/sections/{{fileBase}}-section.tsx",
          templateFile: "templates/page-builder-section/component.tsx.hbs",
          data: { pascalName },
        },
        {
          type: "append",
          path: "sanity/schemas/page-sections/index.ts",
          pattern: "// PLOP: Add Import",
          template: `import { {{schemaName}} } from './{{fileBase}}-section'`,
          data: { schemaName, fileBase },
        },
        {
          type: "append",
          path: "sanity/schemas/page-sections/index.ts",
          pattern: "// PLOP: Add Export",
          template: "  {{schemaName}},",
          data: { schemaName },
        },
        {
          type: "append",
          path: "sanity/schemas/index.ts",
          pattern: "// PLOP: Add Section Import",
          template: `import { {{schemaName}} } from './page-sections/{{fileBase}}-section'`,
          data: { schemaName, fileBase },
        },
        {
          type: "append",
          path: "sanity/schemas/index.ts",
          pattern: "// PLOP: Add Section Export",
          template: "  {{schemaName}},",
          data: { schemaName },
        },
        {
          type: "append",
          path: "features/page-builder/page-sections.tsx",
          pattern: "// PLOP: Add Import",
          template: `  {{schemaName}}: dynamic(() =>
    import('~/features/page-builder/sections/{{fileBase}}-section').then((m) => m.{{pascalName}}),
  ),`,
          data: { schemaName, fileBase, pascalName },
        },
        {
          type: "append",
          path: "features/sanity/queries.ts",
          pattern: "// PLOP: Add Section Projection",
          template: `  _type == "{{schemaName}}" => {
    headline,
    subheadline
  },`,
          data: { schemaName },
        },
      ];
    },
  });
}
