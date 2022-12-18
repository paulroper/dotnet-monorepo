import { ModuleName } from "../types/dag";

export const getModulesToBuild = (filteredChangedFiles: string[]) => {
  return filteredChangedFiles.reduce<{ [moduleName: ModuleName]: boolean }>((acc, path) => {
    // 1. Match the file change against a module
    const moduleMatch = /(?:apps|libs)\/\w+/.exec(path);
    if (!moduleMatch || moduleMatch.length > 1) {
      console.warn('Bad module match detected. Got:', moduleMatch);
      return acc;
    }

    const moduleName = moduleMatch[0];

    // 2. For an app change, check if the app is already marked for build
    const isApp = moduleName.startsWith('apps/');
    if (isApp && acc[moduleMatch[0]]) {
      console.info('App', moduleName, 'is already marked for build');
      return acc;
    }

    // 3. If the change is for a module, find all dependent apps and mark them for rebuild
    if (!isApp) {
      // TODO: Need to do a search on the DAG to work out which apps to build
      console.info("Module -> app resolution not yet implemented");
      return acc;
    }

    // 4. The app has not yet been marked for build
    console.log("New app to build detected:", moduleName);

    return {
      ...acc,
      [moduleName]: true
    };
  }, {});
};
