$libs = (
  'Shared.Entities'
)

foreach ($lib in $libs) {
  mkdir libs/$lib
  Set-Location "libs/$lib"

  dotnet new classlib -f net6.0

  Set-Location ../../
}

$apps = (
  'Atlas',
  'Centre',
  'Hyper',
  'Pure',
  'Silver',
  'Wallet'
)

foreach ($app in $apps) {
  mkdir "apps/$app/$app.Application"
  Set-Location "apps/$app/$app.Application"

  dotnet new web -f net6.0
  Set-Location ../

  dotnet new sln
  dotnet sln add ./$app.Application
  dotnet sln add ../../libs/Shared.Entities

  Copy-Item ../../Dockerfile .
  Copy-Item ../../deps.json.example ./deps.json

  Set-Location ../../
}
