import { Capacitor } from '@capacitor/core';

// True for both the browser web build and the Capacitor (Android) build —
// anything that isn't the Electron desktop app. Use this to hide desktop-only
// controls (local daemon/binary management, system tray, custom titlebar).
export const isWeb = !!import.meta.env.VITE_WEB;

// True only inside the Capacitor native shell. Use this where web (browser)
// and native (Capacitor) need to diverge, e.g. networking (rpc-client.js).
export const isNative = isWeb && Capacitor.isNativePlatform();
