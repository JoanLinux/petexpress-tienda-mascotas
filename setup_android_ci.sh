#!/usr/bin/env bash
set -euo pipefail
APP_NAME="Casa Beatricita"; APP_ID_DEFAULT="com.casabeatricita.app"; WORKFLOW_PATH=".github/workflows/android-capacitor.yml"
say(){ printf "\n\033[1;96m[INFO]\033[0m %s\n" "$*"; }; warn(){ printf "\n\033[1;93m[WARN]\033[0m %s\n" "$*"; }; err(){ printf "\n\033[1;91m[ERR ]\033[0m %s\n" "$*"; }
say "Verificando raíz del proyecto…"; [ -f package.json ] || { err "No hay package.json aquí."; exit 1; }
[ -f vite.config.ts ] || [ -f vite.config.js ] || warn "No veo vite.config.*"
say "Instalando dependencias de Capacitor…"; npm i -D @capacitor/cli >/dev/null 2>&1 || npm i -D @capacitor/cli; npm i @capacitor/core @capacitor/android >/dev/null 2>&1 || npm i @capacitor/core @capacitor/android
say "Asegurando script build en package.json…"
node - <<'NODE'
const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.scripts=p.scripts||{};if(!p.scripts.build)p.scripts.build='vite build';fs.writeFileSync('package.json',JSON.stringify(p,null,2));console.log(p.scripts);
NODE
say "Ajustando capacitor.config.ts…"
if [ -f capacitor.config.ts ]; then
node - <<'NODE'
const fs=require('fs');const path='capacitor.config.ts';let t=fs.readFileSync(path,'utf8');
t=t.replace(/appId:\s*['"][^'"]+['"]/,"appId: 'com.casabeatricita.app'");
t=t.replace(/appName:\s*['"][^'"]+['"]/,"appName: 'Casa Beatricita'");
if(/webDir:\s*['"][^'"]+['"]/.test(t)){ t=t.replace(/webDir:\s*['"][^'"]+['"]/,"webDir: 'dist'"); } else { t=t.replace(/(appName:\s*['"][^'"]+['"]\s*,?)/,"$1\n  webDir: 'dist',"); }
fs.writeFileSync(path,t); console.log('capacitor.config.ts actualizado');
NODE
else
cat > capacitor.config.ts <<EOF
import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = { appId: '${APP_ID_DEFAULT}', appName: '${APP_NAME}', webDir: 'dist', bundledWebRuntime: false };
export default config;
EOF
fi
say "Build Vite…"; (npm ci || npm i) && npm run build
if [ ! -d android ]; then say "Agregando plataforma Android…"; npx cap add android --yes --verbose; else say "android/ ya existe."; fi
say "Sync Capacitor…"; npx cap copy android; npx cap sync android
say "Creando/actualizando workflow…"; mkdir -p .github/workflows
cat > "${WORKFLOW_PATH}" <<'YAML'
name: Vite + Capacitor → APK
on: { push: { branches: [ "main" ] }, pull_request: { branches: [ "main" ] } }
jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Assert android dir exists
        run: test -d android || (echo "ERROR: android/ no existe" && exit 1)
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - name: Install deps
        run: npm ci
      - name: Build web (Vite)
        run: npm run build
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21', cache: gradle }
      - uses: android-actions/setup-android@v3
      - name: Sync Capacitor
        run: |
          npx cap copy android
          npx cap sync android
      - name: Build Release APK
        working-directory: android
        run: |
          chmod +x gradlew
          ./gradlew assembleRelease --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: app-release-apk
          path: |
            android/app/build/outputs/apk/release/app-release.apk
            android/app/build/outputs/apk/release/app-release-unsigned.apk
YAML
say "Git commit & push…"; git add capacitor.config.ts package.json android "${WORKFLOW_PATH}" >/dev/null 2>&1 || true
git commit -m "chore(android): ensure Capacitor android & CI (Java 21) + sync" >/dev/null 2>&1 || say "Nada que commitear."
git push origin main || warn "Push no realizado (configura PAT/SSH y repite: git push origin main)"
say "Checks:"
[ -d android ] && echo "  ✔ android/ existe" || echo "  ✖ android/ NO"
[ -f android/gradlew ] && echo "  ✔ gradlew" || echo "  ✖ sin gradlew"
[ -f android/app/build/outputs/apk/release/app-release.apk ] && echo "  ✔ APK local" || echo "  ℹ Sin APK local (ver Artifact en Actions)"
