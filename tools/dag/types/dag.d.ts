export type ModuleName = string;

export interface Deps {
  dependsOn: ModuleName[];
  name?: string;
}

export interface DepsMap {
  [path: string]: Deps;
}
