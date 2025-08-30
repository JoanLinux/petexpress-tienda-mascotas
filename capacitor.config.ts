// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.casabeatricita.app',   // <-- SIN guiones, 2+ segmentos, solo alfanumérico/underscore
  appName: 'Casa Beatricita',
  webDir: 'dist',
  bundledWebRuntime: false,
};

export default config;
