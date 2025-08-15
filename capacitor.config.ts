import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1f7ed2449c654b4db95b6bac485740e3',
  appName: 'PetExpress',
  webDir: 'dist',
  server: {
    url: "https://1f7ed244-9c65-4b4d-b95b-6bac485740e3.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;