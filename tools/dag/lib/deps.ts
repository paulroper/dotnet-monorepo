import { readFile } from "fs/promises";
import glob from "glob";

import { Deps, DepsMap, ModuleName } from "../types/dag";

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

export const getDepsMap = async (): Promise<DepsMap> => {
  try {
    const files = await getDepsFiles();
    const depMaps = await Promise.all(files.map(loadDepsJson));

    return depMaps.reduce<DepsMap>((acc, map) => {
      return {
        ...acc,
        [map.module]: map.deps,
      };
    }, {});
  } catch (error) {
    console.error(error);
    throw error;
  }
};
