import { create } from "zustand";
import type { BluetoothDevice, BluetoothDeviceInfo } from "@/lib/flutter/types";

interface BluetoothState {
  // 스캔 상태
  isScanning: boolean;
  discoveredDevices: BluetoothDevice[];

  // 연결된 디바이스
  connectedDevice: BluetoothDevice | null;
  deviceInfo: BluetoothDeviceInfo | null;

  // Actions
  setScanning: (isScanning: boolean) => void;
  addDevice: (device: BluetoothDevice) => void;
  clearDevices: () => void;
  setConnectedDevice: (device: BluetoothDevice | null) => void;
  setDeviceInfo: (info: BluetoothDeviceInfo | null) => void;
  reset: () => void;
}

export const useBluetoothStore = create<BluetoothState>((set) => ({
  isScanning: false,
  discoveredDevices: [],
  connectedDevice: null,
  deviceInfo: null,

  setScanning: (isScanning) => set({ isScanning }),

  addDevice: (device) =>
    set((state) => {
      // 중복 체크
      const exists = state.discoveredDevices.some((d) => d.id === device.id);
      if (exists) {
        // 기존 디바이스 업데이트
        return {
          discoveredDevices: state.discoveredDevices.map((d) =>
            d.id === device.id ? device : d
          ),
        };
      }
      return {
        discoveredDevices: [...state.discoveredDevices, device],
      };
    }),

  clearDevices: () => set({ discoveredDevices: [] }),

  setConnectedDevice: (device) => set({ connectedDevice: device }),

  setDeviceInfo: (info) => set({ deviceInfo: info }),

  reset: () =>
    set({
      isScanning: false,
      discoveredDevices: [],
      connectedDevice: null,
      deviceInfo: null,
    }),
}));
