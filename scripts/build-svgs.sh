#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

scriptPath=${0%/*}

GITLAB_SVG_VERSION=$(cat "$scriptPath/gitlab_svgs_version")


function download_icons {

  echo "Download gitlab-svgs Icons"
  
  # Cleanup previous downloads
  rm -rf gitlab-svgs-* sprite_icons/*.svg gitlab_icons.zip

  # Download and unpack specified versions gitlab_svgs_version
  curl --location --output gitlab_icons.zip \
    "https://gitlab.com/gitlab-org/gitlab-svgs/-/archive/$GITLAB_SVG_VERSION/gitlab-svgs-$GITLAB_SVG_VERSION.zip"
  unzip gitlab_icons.zip


  cp -rf gitlab-svgs-$GITLAB_SVG_VERSION/sprite_icons ./
  rm -rf gitlab_icons.zip  gitlab-svgs-$GITLAB_SVG_VERSION
}

download_icons


echo "Starting SVG Build (combining sprites and minifying assets)"
node "$scriptPath/main.mjs"


