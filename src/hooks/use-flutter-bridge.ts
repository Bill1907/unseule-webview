import { useEffect } from "react";
import { initFlutterBridge, flutter } from "@/lib/flutter/bridge";

let initialized = false;

export function useFlutterBridge() {
  useEffect(() => {
    if (!initialized) {
      initFlutterBridge();
      initialized = true;
    }
  }, []);

  return flutter;
}
