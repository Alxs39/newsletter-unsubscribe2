#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
corepack enable
cd "$(dirname "$0")/apps/frontend"
npx tsc --noEmit
