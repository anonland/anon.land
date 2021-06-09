#!/bin/bash

# Simple init build script.
# Give it chmod +x permissions.

set -o errexit
set -o nounset

npm install
cd site/
npm install
npm run build
cd ..
