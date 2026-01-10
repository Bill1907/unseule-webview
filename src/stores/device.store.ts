import { create } from "zustand";

export interface Device {
  id: string;
  name: string;
  macAddress: string;
  firmwareVersion: string;
  isOnline: boolean;
  wifiConnected: boolean;
  lastOnline?: string;
  childId?: string;
  childName?: string;
}

interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;

  // Actions
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  selectDevice: (device: Device | null) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  selectedDevice: null,

  setDevices: (devices) => set({ devices }),

  addDevice: (device) =>
    set((state) => ({
      devices: [...state.devices, device],
    })),

  updateDevice: (id, updates) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  removeDevice: (id) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
      selectedDevice:
        state.selectedDevice?.id === id ? null : state.selectedDevice,
    })),

  selectDevice: (device) => set({ selectedDevice: device }),
}));
