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

  Copy-Item ../../Dockerfile .
  Copy-Item ../../.dockerignore .

  Set-Location ../../
}
