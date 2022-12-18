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
  Copy-Items ./deps.json ./apps/$app/ -Force
}
