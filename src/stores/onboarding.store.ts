import { create } from "zustand";

export interface PendingDeviceInfo {
  serialNumber: string;
  deviceSecret: string;
  deviceType: string;
  firmwareVersion: string;
}

interface OnboardingState {
  pendingDevice: PendingDeviceInfo | null;
  wifiConfigured: boolean;

  setPendingDevice: (device: PendingDeviceInfo | null) => void;
  setWifiConfigured: (configured: boolean) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  pendingDevice: null,
  wifiConfigured: false,

  setPendingDevice: (device) => set({ pendingDevice: device }),
  setWifiConfigured: (configured) => set({ wifiConfigured: configured }),
  reset: () => set({ pendingDevice: null, wifiConfigured: false }),
}));
