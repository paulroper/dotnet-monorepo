Param (
  [Parameter(ValueFromPipelineByPropertyName)]
  [string] $AppName,
  [boolean] $DebugMode
)

$lowered = $AppName.ToLower()
$tag = "${lowered}:latest"

if ($DebugMode) {
  docker build . -f ./apps/$AppName/Dockerfile -t $tag --progress=plain --no-cache --build-arg APP_NAME=$AppName
  return
}

docker build . -f ./apps/$AppName/Dockerfile -t $tag --build-arg APP_NAME=$AppName
