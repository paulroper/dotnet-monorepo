import { DepsMap, ModuleName } from "../types/dag";

interface BuildMap {
  [moduleName: ModuleName]: boolean;
}

const moduleIsApp = (moduleName: string): boolean =>
  moduleName.startsWith("apps/");

const getDependentModules = (moduleName: string, depsMap: DepsMap): string[] =>
  Object.keys(depsMap)
    .map((dependentModule) =>
      depsMap[dependentModule].dependsOn.includes(moduleName)
        ? dependentModule
        : undefined
    )
    .filter((module): module is string => !!module);

const getBuildMapForModule = (
  moduleName: string,
  depsMap: DepsMap
): BuildMap => {
  const dependentModules = getDependentModules(moduleName, depsMap);

  let toCheck = [...dependentModules];
  let moduleList = [...dependentModules];

  let depth = 0;
  const maxDepth = 999;

  // Currently a loop as Node doesn't have tail recursion :(
  do {
    const nextLayer = toCheck.flatMap((module) =>
      getDependentModules(module, depsMap)
    );

    moduleList = [...moduleList, ...nextLayer];

    toCheck = nextLayer;
    depth++;
  } while (toCheck.length > 0 && depth <= maxDepth);

  if (depth >= maxDepth) {
    console.warn(
      "Max depth of",
      maxDepth,
      "reached while checking dependencies!"
    );
  }

  return moduleList.reduce<BuildMap>(
    (map, module) => (moduleIsApp(module) ? { ...map, [module]: true } : map),
    {}
  );
};

export const getModulesToBuild = (
  depsMap: DepsMap,
  filteredChangedFiles: string[]
) => {
  return filteredChangedFiles.reduce<BuildMap>((acc, path) => {
    // 1. Match the file change against a module
    const moduleMatch = /(?:apps|libs)\/[a-zA-Z._]+[^\/]/.exec(path);
    if (!moduleMatch || moduleMatch.length > 1) {
      console.warn("Bad module match detected. Got:", moduleMatch);
      return acc;
    }

    const moduleName = moduleMatch[0];

    // 2. For an app change, check if the app is already marked for build
    const isApp = moduleIsApp(moduleName);
    if (isApp && acc[moduleMatch[0]]) {
      console.info("App", moduleName, "is already marked for build");
      return acc;
    }

    // 3. If the change is for a module, find all dependent apps and mark them for rebuild
    if (!isApp) {
      const moduleBuildMap = getBuildMapForModule(moduleName, depsMap);
      console.info("Build map for lib", moduleName, "is", moduleBuildMap);

      return {
        ...acc,
        ...moduleBuildMap,
      };
    }

    // 4. The app has not yet been marked for build
    console.log("New app to build detected:", moduleName);

    return {
      ...acc,
      [moduleName]: true,
    };
  }, {});
};
