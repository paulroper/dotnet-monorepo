namespace Dag.Application

open System.Diagnostics

module Git =
    let checkifgitinstalled () : Async<bool> =
        async {
            let startInfo =
                ProcessStartInfo(
                    Arguments = "--version",
                    FileName = "git",
                    RedirectStandardError = true,
                    RedirectStandardOutput = true,
                    UseShellExecute = false
                )

            use gitProcess = new Process(StartInfo = startInfo)

            gitProcess.Start() |> ignore

            let! output = gitProcess.StandardOutput.ReadToEndAsync() |> Async.AwaitTask
            let! errors = gitProcess.StandardError.ReadToEndAsync() |> Async.AwaitTask

            match (output, errors) with
            | (output, errors) when output.Length > 0 && errors.Length < 1 ->
                printfn $"Git install detected: {output}"
                return true
            | _ ->
                printfn $"Git not detected, please install it first"
                return false
        }

    let getchangedfiles () : string list = []
