// Flutter Channel 이름
export type FlutterChannel =
  | "BluetoothChannel"
  | "WifiChannel"
  | "DeviceChannel";

// Flutter 메시지 기본 구조
export interface FlutterMessage<T = unknown> {
  type: string;
  payload: T;
}

// Bluetooth 관련 타입
export interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
  isConnected: boolean;
}

export interface BluetoothDeviceInfo {
  deviceId: string;
  firmwareVersion: string;
  macAddress: string;
}

// WiFi 관련 타입
export interface WifiCredentials {
  ssid: string;
  password: string;
}

export interface WifiStatus {
  isConnected: boolean;
  ssid?: string;
}

// 메시지 타입 정의
export type BluetoothMessageType =
  | "DEVICE_FOUND"
  | "DEVICE_CONNECTED"
  | "DEVICE_DISCONNECTED"
  | "DEVICE_INFO"
  | "SCAN_STARTED"
  | "SCAN_STOPPED";

export type WifiMessageType = "WIFI_CONNECTED" | "WIFI_FAILED" | "WIFI_STATUS";
