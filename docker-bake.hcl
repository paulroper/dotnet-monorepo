variable "TAG" {
  default = "latest"
}

group "default" {
  targets = ["atlas", "centre", "hyper", "pure", "silver", "wallet"]
}

target "atlas" {
  args = {
    APP_NAME : "Atlas"
  }
  dockerfile = "./apps/Atlas/Dockerfile"
  context = "./"
  tags = ["atlas:${TAG}"]
}

target "centre" {
  args = {
    APP_NAME : "Centre"
  }
  dockerfile = "./apps/Centre/Dockerfile"
  context = "./"
  tags = ["centre:${TAG}"]
}

target "hyper" {
  args = {
    APP_NAME : "Hyper"
  }
  dockerfile = "./apps/Hyper/Dockerfile"
  context = "./"
  tags = ["hyper:${TAG}"]
}

target "pure" {
  args = {
    APP_NAME : "Pure"
  }
  dockerfile = "./apps/Pure/Dockerfile"
  context = "./"
  tags = ["pure:${TAG}"]
}

target "silver" {
  args = {
    APP_NAME : "Silver"
  }
  dockerfile = "./apps/Silver/Dockerfile"
  context = "./"
  tags = ["silver:${TAG}"]
}

target "wallet" {
  args = {
    APP_NAME : "Wallet"
  }
  dockerfile = "./apps/Wallet/Dockerfile"
  context = "./"
  tags = ["wallet:${TAG}"]
}
