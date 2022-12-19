$ErrorActionPreference = "Stop"

Set-Location ./tools/dag
yarn start
Set-Location ../../

if (-Not (Test-Path toBuild)) {
  Write-Output 'No toBuild file created, nothing to do'
  Exit
}

$appsToBuild = Get-Content toBuild
Write-Output $appsToBuild

if ([string]::IsNullOrEmpty($appsToBuild)) {
  Write-Output 'toBuild is empty, nothing to do'
  Exit
}

docker buildx bake $appsToBuild.Split(";")
