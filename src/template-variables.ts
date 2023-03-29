export const TEMPLATE_FILES = [
  "README.md",
  "package.json",
];

export const TEMPLATE_VARIABLES = [
  "QUACKWARE_PACKAGE_NAME",
  "QUACKWARE_PACKAGE_DESCRIPTION",
] as const;
export type TemplateVariable = typeof TEMPLATE_VARIABLES[number];

export function replaceTemplateVariables(src: string, variable: TemplateVariable, value: string) {
  return src.replaceAll(`$${variable}`, value);
}
