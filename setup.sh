#!/bin/bash
set -e

cd /app

# Clean up
rm -rf node_modules package-lock.json
mkdir -p node_modules/.bin

# Install packages one at a time to avoid OOM
echo "=== Installing packages one by one ==="

npm install --no-package-lock react 2>&1 | tail -1
echo "react OK"

npm install --no-package-lock react-dom 2>&1 | tail -1
echo "react-dom OK"

npm install --no-package-lock react-router-dom 2>&1 | tail -1
echo "react-router-dom OK"

npm install --no-package-lock lucide-react 2>&1 | tail -1
echo "lucide-react OK"

npm install --no-package-lock @supabase/supabase-js 2>&1 | tail -1
echo "@supabase/supabase-js OK"

npm install --no-package-lock tailwindcss 2>&1 | tail -1
echo "tailwindcss OK"

npm install --no-package-lock @types/react 2>&1 | tail -1
echo "@types/react OK"

npm install --no-package-lock @types/react-dom 2>&1 | tail -1
echo "@types/react-dom OK"

npm install --no-package-lock @vitejs/plugin-react 2>&1 | tail -1
echo "@vitejs/plugin-react OK"

npm install --no-package-lock typescript 2>&1 | tail -1
echo "typescript OK"

npm install --no-package-lock esbuild 2>&1 | tail -1
echo "esbuild OK"

npm install --no-package-lock rollup 2>&1 | tail -1
echo "rollup OK"

npm install --no-package-lock postcss 2>&1 | tail -1
echo "postcss OK"

npm install --no-package-lock enhanced-resolve 2>&1 | tail -1
echo "enhanced-resolve OK"

npm install --no-package-lock jiti 2>&1 | tail -1
echo "jiti OK"

# Now manually install vite
echo "=== Installing vite ==="
npm pack vite@5.4.0 2>&1 | tail -1
tar -xzf vite-5.4.0.tgz -C node_modules/ && mv node_modules/package node_modules/vite
rm -f vite-5.4.0.tgz
ln -sf ../vite/bin/vite.js node_modules/.bin/vite
echo "vite OK"

# Manually install @tailwindcss/vite and its deps
echo "=== Installing @tailwindcss/vite ==="
npm pack @tailwindcss/vite@4.1.18 2>&1 | tail -1
tar -xzf tailwindcss-vite-4.1.18.tgz -C node_modules/ && mv node_modules/package node_modules/@tailwindcss/vite
rm -f tailwindcss-vite-4.1.18.tgz
echo "@tailwindcss/vite OK"

npm pack @tailwindcss/node@4.1.18 2>&1 | tail -1
mkdir -p node_modules/@tailwindcss
tar -xzf tailwindcss-node-4.1.18.tgz -C node_modules/@tailwindcss/ && mv node_modules/@tailwindcss/package node_modules/@tailwindcss/node
rm -f tailwindcss-node-4.1.18.tgz
echo "@tailwindcss/node OK"

npm pack @tailwindcss/oxide@4.1.18 2>&1 | tail -1
tar -xzf tailwindcss-oxide-4.1.18.tgz -C node_modules/@tailwindcss/ && mv node_modules/@tailwindcss/package node_modules/@tailwindcss/oxide
rm -f tailwindcss-oxide-4.1.18.tgz
echo "@tailwindcss/oxide OK"

npm pack @tailwindcss/oxide-linux-x64-gnu@4.1.18 2>&1 | tail -1
tar -xzf tailwindcss-oxide-linux-x64-gnu-4.1.18.tgz -C node_modules/@tailwindcss/ && mv node_modules/@tailwindcss/package node_modules/@tailwindcss/oxide-linux-x64-gnu
rm -f tailwindcss-oxide-linux-x64-gnu-4.1.18.tgz
echo "@tailwindcss/oxide-linux-x64-gnu OK"

npm pack lightningcss@1.29.3 2>&1 | tail -1
tar -xzf lightningcss-1.29.3.tgz -C node_modules/ && mv node_modules/package node_modules/lightningcss
rm -f lightningcss-1.29.3.tgz
echo "lightningcss OK"

npm pack lightningcss-linux-x64-gnu@1.29.3 2>&1 | tail -1
tar -xzf lightningcss-linux-x64-gnu-1.29.3.tgz -C node_modules/ && mv node_modules/package node_modules/lightningcss-linux-x64-gnu
rm -f lightningcss-linux-x64-gnu-1.29.3.tgz
echo "lightningcss-linux-x64-gnu OK"

# Verify
echo "=== Verification ==="
ls node_modules/.bin/vite 2>/dev/null && echo "vite binary: OK" || echo "vite binary: MISSING"
ls node_modules/vite/package.json 2>/dev/null && echo "vite package: OK" || echo "vite package: MISSING"
ls node_modules/react/package.json 2>/dev/null && echo "react: OK" || echo "react: MISSING"
ls node_modules/@tailwindcss/vite/package.json 2>/dev/null && echo "@tailwindcss/vite: OK" || echo "@tailwindcss/vite: MISSING"

echo "=== Setup complete! ==="