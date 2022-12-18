import { EOL } from "os";
import { spawn } from "node:child_process";

const checkIfGitInstalled = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      const git = spawn("git", ["--version"]);

      git.stdout.on("data", (data) => {
        console.log("Git install detected:", (data as Buffer).toString());
        return resolve(true);
      });

      git.stderr.on("data", (data) => {
        console.error("Git not detected, please install it first", data);
        return reject(false);
      });
    } catch (error) {
      console.error("Git not detected, please install it first", error);
      return reject(false);
    }
  });

export const getChangedFiles = async (): Promise<string[]> =>
  new Promise(async (resolve, reject) => {
    const gitInstalled = await checkIfGitInstalled();
    if (!gitInstalled) {
      return [];
    }

    // TODO: Need to diff against the branch this was based off to get a full list of changes
    const command = spawn("git", ["diff", "--name-only"]);

    command.stdout.on("data", (data) => {
      const lines = (data as Buffer)
        .toString()
        .split(EOL)
        .filter((x) => x && !x.startsWith("warning: CRLF") && !x.startsWith("The file will"));

      return resolve(lines);
    });

    command.stderr.on("data", (data) => {
      const string = (data as Buffer).toString();
      console.error(string);

      if (string.startsWith("warning: CRLF")) {
        return;
      }

      return reject("Failed to load changes");
    });

    return [];
  });
