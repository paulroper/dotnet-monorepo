$apps = (
  'Atlas',
  'Centre',
  'Hyper',
  'Pure',
  'Silver',
  'Wallet'
)

foreach ($app in $apps) {
  Copy-Item ./Dockerfile ./apps/$app/ -Force
  Copy-Item ./.dockerignore ./apps/$app/ -Force
}
