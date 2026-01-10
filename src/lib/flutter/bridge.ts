import { useBluetoothStore } from "@/stores/bluetooth.store";
import type {
  FlutterChannel,
  FlutterMessage,
  BluetoothDevice,
  BluetoothDeviceInfo,
  WifiCredentials,
  WifiStatus,
} from "./types";

// Flutter -> WebView 메시지 핸들러
function handleBluetoothMessage(message: FlutterMessage) {
  const store = useBluetoothStore.getState();

  switch (message.type) {
    case "DEVICE_FOUND":
      store.addDevice(message.payload as BluetoothDevice);
      break;
    case "DEVICE_CONNECTED":
      store.setConnectedDevice(message.payload as BluetoothDevice);
      break;
    case "DEVICE_DISCONNECTED":
      store.setConnectedDevice(null);
      break;
    case "DEVICE_INFO":
      store.setDeviceInfo(message.payload as BluetoothDeviceInfo);
      break;
    case "SCAN_STARTED":
      store.setScanning(true);
      break;
    case "SCAN_STOPPED":
      store.setScanning(false);
      break;
  }
}

function handleWifiMessage(message: FlutterMessage) {
  const status = message.payload as WifiStatus;
  window.dispatchEvent(
    new CustomEvent("wifi-status", { detail: status })
  );
}

// 메시지 라우터
function handleFlutterMessage(channel: FlutterChannel, message: FlutterMessage) {
  switch (channel) {
    case "BluetoothChannel":
      handleBluetoothMessage(message);
      break;
    case "WifiChannel":
      handleWifiMessage(message);
      break;
  }
}

// Flutter Bridge 초기화
export function initFlutterBridge() {
  (window as unknown as Record<string, unknown>).onFlutterMessage = (
    channel: string,
    message: string
  ) => {
    try {
      const parsed: FlutterMessage = JSON.parse(message);
      handleFlutterMessage(channel as FlutterChannel, parsed);
    } catch (e) {
      console.error("[FlutterBridge] Failed to parse message:", e);
    }
  };

  console.log("[FlutterBridge] Initialized");
}

// WebView -> Flutter 메시지 전송
export function sendToFlutter<T>(channel: FlutterChannel, message: FlutterMessage<T>) {
  const handler = (window as unknown as Record<string, { postMessage?: (msg: string) => void }>)[channel];
  if (handler?.postMessage) {
    handler.postMessage(JSON.stringify(message));
  } else {
    console.warn(`[FlutterBridge] Channel ${channel} not available`);
  }
}

// 편의 함수 모음
export const flutter = {
  bluetooth: {
    startScan: () => {
      sendToFlutter("BluetoothChannel", { type: "START_SCAN", payload: null });
    },
    stopScan: () => {
      sendToFlutter("BluetoothChannel", { type: "STOP_SCAN", payload: null });
    },
    connect: (deviceId: string) => {
      sendToFlutter("BluetoothChannel", { type: "CONNECT", payload: { deviceId } });
    },
    disconnect: () => {
      sendToFlutter("BluetoothChannel", { type: "DISCONNECT", payload: null });
    },
    getDeviceInfo: () => {
      sendToFlutter("BluetoothChannel", { type: "GET_DEVICE_INFO", payload: null });
    },
  },

  wifi: {
    configure: (credentials: WifiCredentials) => {
      sendToFlutter("WifiChannel", { type: "CONFIGURE_WIFI", payload: credentials });
    },
    getStatus: () => {
      sendToFlutter("WifiChannel", { type: "GET_STATUS", payload: null });
    },
  },
};
