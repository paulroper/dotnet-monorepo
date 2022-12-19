Set-Location ./tools/dag
yarn start
Set-Location ../../

$appsToBuild = Get-Content toBuild
Write-Output $appsToBuild

docker buildx bake $appsToBuild.Split(";")
