import { $ } from "../deps.ts";

export async function copyTemplate(srcPath: URL, destPath: URL) {
  await $.fs.ensureDir(destPath);
  await $.fs.copy(srcPath, destPath, { overwrite: true });
}
