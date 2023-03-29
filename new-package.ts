#!/usr/bin/env -S deno run -A --unstable --no-check --no-config

import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { $ } from "./deps.ts";
import { replaceTemplateVariables, TEMPLATE_FILES } from "./src/template-variables.ts";
import { copyTemplate } from "./src/template.ts";

const TEMPLATE_DIRECTORY = new URL("./__templates__/repo-package", import.meta.url);

async function newPackage() {
  const { options } = await new Command().name("new-package").description("Create a new package").option(
    "--name=[name:string]",
    "Package Name",
    { required: true },
  ).option("--description=[description:string]", "Package Description", { required: true }).parse(Deno.args);

  const { name, description } = options;

  const destinationDirectory = new URL(`../${name}`, import.meta.url);
  await copyTemplate(TEMPLATE_DIRECTORY, destinationDirectory);

  for await (const entry of $.fs.walk(destinationDirectory, { includeDirs: false })) {
    if (TEMPLATE_FILES.includes(entry.name)) {
      let src = await Deno.readTextFile(entry.path);
      src = replaceTemplateVariables(src, "QUACKWARE_PACKAGE_NAME", `@quackware/${name}`);
      src = replaceTemplateVariables(src, "QUACKWARE_PACKAGE_DESCRIPTION", description as string);
      await Deno.writeTextFile(entry.path, src);
    }
  }

  $.cd(destinationDirectory);
  await $`git init && git add -A . && git ci -m "Init"`;
}

newPackage().catch(console.error);
