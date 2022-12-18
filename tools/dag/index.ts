import glob from "glob";
import { readFile, writeFile } from "fs/promises";

import { getChangedFiles } from "./lib/git";

type ModuleName = string;

interface Deps {
  dependsOn: ModuleName[];
  name?: string;
}

interface DepsMap {
  [path: string]: Deps;
}

const loadDepsJson = async (
  path: string
): Promise<{ module: ModuleName; path: string; deps: Deps }> => {
  const file = await readFile(path, { encoding: "utf-8" });

  try {
    const deps = JSON.parse(file) as Deps;
    return { module: path.replace("/deps.json", ""), deps, path };
  } catch (error) {
    console.error(`Failed to parse ${path}`, error);
    throw error;
  }
};

const getDepsFiles = (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    glob("**/deps.json", {}, (error, matches) => {
      if (error) {
        console.error(error);
        return reject(error);
      }

      console.log("Found some deps!", matches);
      console.log();

      resolve(matches);
    });
  });

(async () => {
  process.chdir("../../");

  let changedFiles: string[] = [];

  try {
    changedFiles = await getChangedFiles();

    console.log("Found some changed files", changedFiles);
    console.log();
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  const filteredChangedFiles = changedFiles.filter(
    (path) => path.startsWith("apps/") || path.startsWith("lib/")
  );

  console.log("Changes affecting build are", filteredChangedFiles);
  console.log();

  let depsMap: DepsMap = {};

  try {
    const files = await getDepsFiles();
    const depMaps = await Promise.all(files.map(loadDepsJson));

    depsMap = depMaps.reduce<DepsMap>((acc, map) => {
      return {
        ...acc,
        [map.module]: map.deps,
      };
    }, {});
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  console.log("Deps map is", depsMap);
  console.log();

  const toBuild = filteredChangedFiles.reduce<{ [moduleName: ModuleName]: boolean }>((acc, path) => {
    const moduleMatch = /(?:apps|libs)\/\w+/.exec(path);
    if (!moduleMatch || moduleMatch.length > 1) {
      console.warn('Bad module match detected. Got:', moduleMatch);
      return acc;
    }

    const moduleName = moduleMatch[0];

    const isApp = moduleName.startsWith('apps/');
    if (isApp && acc[moduleMatch[0]]) {
      console.info('App', moduleName, 'is already marked for build');
      return acc;
    }

    if (!isApp) {
      // TODO: Need to do a search on the DAG to work out which apps to build
      console.info("Module -> app resolution not yet implemented");
      return acc;
    }

    console.log("New app to build detected:", moduleName);

    return {
      ...acc,
      [moduleName]: true
    };
  }, {});

  console.log();
  console.log('Modules to build are', toBuild);

  await writeFile('./toBuild.json', JSON.stringify(toBuild, null, 2));
})();
