open Dag.Application

[<EntryPoint>]
let main argv =
    let installed = Git.checkifgitinstalled () |> Async.RunSynchronously
    0
