import { writeFile } from "fs/promises";

import { getChangedFiles } from "./lib/git";
import { getDepsMap } from "./lib/deps";
import { getModulesToBuild } from "./lib/modules";
import type { DepsMap } from "./types/dag";

(async () => {
  process.chdir("../../");

  // Step one - Pull all the file changes on this branch from Git
  let changedFiles: string[] = [];

  try {
    changedFiles = await getChangedFiles();

    console.log("Found some changed files", changedFiles);
    console.log();
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  // Step two - Filter the changes to code in apps or libs
  // TODO: The paths to check can be moved into config
  const filteredChangedFiles = changedFiles.filter(
    (path) => path.startsWith("apps/") || path.startsWith("libs/")
  );

  console.log("Changes affecting build are", filteredChangedFiles);
  console.log();

  // Step three - Load all the deps files in the repo so we have a full list of modules and their deps
  let depsMap: DepsMap = {};
  try {
    depsMap = await getDepsMap();
  } catch (error) {
    return process.exit(1);
  }

  console.log("Deps map is", depsMap);
  console.log();

  // Step four - Work out what we need to build
  const toBuild = getModulesToBuild(filteredChangedFiles);

  console.log();
  console.log('Modules to build are', toBuild);

  // Step five - Write the build list to a file ready to be passed to docker buildx bake
  await writeFile('./toBuild.json', JSON.stringify(toBuild, null, 2));
})();
