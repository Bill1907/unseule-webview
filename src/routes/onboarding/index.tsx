import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ChevronRight,
  Check,
  Baby,
  User,
  Sparkles,
  Bluetooth,
  Wifi,
  Signal,
} from "lucide-react";
import {
  useUpdateMeMutation,
  useCreateChildMutation,
  useRegisterDeviceMutation,
} from "@/hooks/use-graphql";
import { flutter } from "@/lib/flutter/bridge";
import { useBluetoothStore } from "@/stores/bluetooth.store";
import { useOnboardingStore } from "@/stores/onboarding.store";
import type { WifiStatus } from "@/lib/flutter/types";

export const Route = createFileRoute("/onboarding/")({
  beforeLoad: requireAuth,
  component: OnboardingPage,
});

type Step = "welcome" | "profile" | "device" | "child" | "complete";

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [error, setError] = useState<string | null>(null);
  const { pendingDevice, reset: resetOnboarding } = useOnboardingStore();

  const updateMeMutation = useUpdateMeMutation({
    onSuccess: (data) => {
      if (data.updateMe.success) {
        setError(null);
        setStep("device");
      } else {
        setError(data.updateMe.errorMessage || "프로필 저장에 실패했습니다.");
      }
    },
    onError: () => {
      setError("네트워크 오류가 발생했습니다.");
    },
  });

  const registerDeviceMutation = useRegisterDeviceMutation({
    onSuccess: (data) => {
      if (data.registerDevice.success) {
        resetOnboarding();
        setStep("complete");
      } else {
        // 디바이스 등록 실패해도 complete로 이동 (나중에 재시도 가능)
        setError(
          data.registerDevice.errorMessage || "디바이스 등록에 실패했습니다."
        );
        setStep("complete");
      }
    },
    onError: () => {
      setError("디바이스 등록 중 오류가 발생했습니다.");
      setStep("complete");
    },
  });

  const createChildMutation = useCreateChildMutation({
    onSuccess: (data) => {
      if (data.createChild.success && data.createChild.child) {
        setError(null);
        const childId = data.createChild.child.id;

        // 디바이스 정보가 있으면 등록
        if (pendingDevice) {
          registerDeviceMutation.mutate({
            input: {
              serialNumber: pendingDevice.serialNumber,
              deviceSecret: pendingDevice.deviceSecret,
              deviceType: pendingDevice.deviceType,
              firmwareVersion: pendingDevice.firmwareVersion,
              childId: childId,
            },
          });
        } else {
          setStep("complete");
        }
      } else {
        setError(data.createChild.errorMessage || "아이 등록에 실패했습니다.");
      }
    },
    onError: () => {
      setError("네트워크 오류가 발생했습니다.");
    },
  });

  const isPending =
    createChildMutation.isPending || registerDeviceMutation.isPending;

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen">
      {/* Progress Bar */}
      <StepProgress currentStep={step} />

      {step === "welcome" && <WelcomeStep onNext={() => setStep("profile")} />}
      {step === "profile" && (
        <ProfileStep
          onSubmit={(data) => {
            setError(null);
            updateMeMutation.mutate({
              input: { phone: data.phone || undefined },
            });
          }}
          error={error}
          isPending={updateMeMutation.isPending}
        />
      )}
      {step === "device" && (
        <DeviceStep
          onComplete={() => setStep("child")}
          onSkip={() => setStep("child")}
        />
      )}
      {step === "child" && (
        <ChildStep
          onSubmit={(data) => {
            setError(null);
            createChildMutation.mutate({
              input: {
                name: data.name,
                birthDate: data.birthDate,
                gender: data.gender || undefined,
              },
            });
          }}
          error={error}
          isPending={isPending}
        />
      )}
      {step === "complete" && (
        <CompleteStep
          onNext={() => navigate({ to: "/account" })}
          deviceError={error}
        />
      )}
    </main>
  );
}

function StepProgress({ currentStep }: { currentStep: Step }) {
  const steps: Step[] = ["welcome", "profile", "device", "child", "complete"];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex gap-2 mb-6 w-full max-w-md">
      {steps.map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded ${
            i <= currentIndex ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="size-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">윤슬에 오신 것을 환영합니다!</CardTitle>
        <CardDescription className="text-base">
          아이와 함께하는 특별한 대화, 윤슬이 함께합니다.
          <br />
          서비스 이용을 위해 간단한 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={onNext}>
          시작하기
          <ChevronRight className="size-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ProfileFormData {
  phone: string;
}

function ProfileStep({
  onSubmit,
  error,
  isPending,
}: {
  onSubmit: (data: ProfileFormData) => void;
  error: string | null;
  isPending: boolean;
}) {
  const form = useForm({
    defaultValues: { phone: "" } as ProfileFormData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>보호자 정보</CardTitle>
              <CardDescription>연락처를 입력해주세요.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form.Field name="phone">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>전화번호</Label>
                <Input
                  id={field.name}
                  type="tel"
                  placeholder="010-1234-5678"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    다음
                    <ChevronRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  );
}

type DeviceSubStep =
  | "scanning"
  | "connecting"
  | "wifi-setup"
  | "wifi-connecting"
  | "done";

function DeviceStep({
  onComplete,
  onSkip,
}: {
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [subStep, setSubStep] = useState<DeviceSubStep>("scanning");
  const [wifiError, setWifiError] = useState<string | null>(null);
  const { isScanning, discoveredDevices, connectedDevice, deviceInfo } =
    useBluetoothStore();
  const { setPendingDevice, setWifiConfigured } = useOnboardingStore();

  // 스캔 시작
  useEffect(() => {
    flutter.bluetooth.startScan();
    return () => {
      flutter.bluetooth.stopScan();
    };
  }, []);

  // 디바이스 연결 완료 시 정보 요청
  useEffect(() => {
    if (connectedDevice && subStep === "connecting") {
      flutter.bluetooth.getDeviceInfo();
    }
  }, [connectedDevice, subStep]);

  // 디바이스 정보 수신 시 임시 저장 및 WiFi 설정 단계로 이동
  useEffect(() => {
    if (deviceInfo && connectedDevice) {
      setPendingDevice({
        serialNumber: deviceInfo.macAddress,
        deviceSecret: deviceInfo.deviceId,
        deviceType: "doll",
        firmwareVersion: deviceInfo.firmwareVersion,
      });
      setSubStep("wifi-setup");
    }
  }, [deviceInfo, connectedDevice, setPendingDevice]);

  // WiFi 상태 이벤트 리스닝
  useEffect(() => {
    const handleWifiStatus = (e: Event) => {
      const customEvent = e as CustomEvent<WifiStatus>;
      if (customEvent.detail.isConnected) {
        setWifiConfigured(true);
        setSubStep("done");
      } else {
        setWifiError("WiFi 연결에 실패했습니다. 다시 시도해주세요.");
        setSubStep("wifi-setup");
      }
    };
    window.addEventListener("wifi-status", handleWifiStatus);
    return () => window.removeEventListener("wifi-status", handleWifiStatus);
  }, [setWifiConfigured]);

  const handleConnect = (deviceId: string) => {
    flutter.bluetooth.stopScan();
    flutter.bluetooth.connect(deviceId);
    setSubStep("connecting");
  };

  const handleWifiSubmit = (ssid: string, password: string) => {
    setWifiError(null);
    flutter.wifi.configure({ ssid, password });
    setSubStep("wifi-connecting");
  };

  if (subStep === "scanning") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bluetooth className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>디바이스 연결</CardTitle>
              <CardDescription>윤슬 인형을 연결해주세요.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isScanning ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                디바이스 검색 중...
              </span>
            </div>
          ) : discoveredDevices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bluetooth className="size-12 mx-auto mb-4 opacity-50" />
              <p>발견된 디바이스가 없습니다.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => flutter.bluetooth.startScan()}
              >
                다시 검색
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {discoveredDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Signal className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{device.name}</p>
                      {device.rssi && (
                        <p className="text-xs text-muted-foreground">
                          신호 강도: {device.rssi}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleConnect(device.id)}>
                    연결
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onSkip}>
            나중에 연결하기
          </Button>
          {!isScanning && discoveredDevices.length > 0 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => flutter.bluetooth.startScan()}
            >
              다시 검색
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  if (subStep === "connecting") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="size-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">디바이스에 연결 중...</p>
            <p className="text-sm text-muted-foreground mt-2">
              잠시만 기다려주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subStep === "wifi-setup" || subStep === "wifi-connecting") {
    return (
      <WifiSetupCard
        onSubmit={handleWifiSubmit}
        error={wifiError}
        isPending={subStep === "wifi-connecting"}
        onSkip={() => {
          // WiFi 스킵 시에도 디바이스 정보는 저장된 상태로 진행
          onComplete();
        }}
      />
    );
  }

  if (subStep === "done") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="size-8 text-green-600" />
            </div>
            <p className="text-lg font-medium">디바이스 연결 완료!</p>
            <p className="text-sm text-muted-foreground mt-2">
              인형이 성공적으로 연결되었습니다.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onComplete}>
            다음
            <ChevronRight className="size-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

function WifiSetupCard({
  onSubmit,
  error,
  isPending,
  onSkip,
}: {
  onSubmit: (ssid: string, password: string) => void;
  error: string | null;
  isPending: boolean;
  onSkip: () => void;
}) {
  const form = useForm({
    defaultValues: { ssid: "", password: "" },
    onSubmit: async ({ value }) => {
      onSubmit(value.ssid, value.password);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wifi className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>WiFi 설정</CardTitle>
              <CardDescription>
                인형이 인터넷에 연결되도록 WiFi를 설정해주세요.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form.Field
            name="ssid"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "WiFi 이름을 입력해주세요." : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>WiFi 이름 *</Label>
                <Input
                  id={field.name}
                  placeholder="WiFi 이름 입력"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "비밀번호를 입력해주세요." : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>비밀번호 *</Label>
                <Input
                  id={field.name}
                  type="password"
                  placeholder="WiFi 비밀번호 입력"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onSkip}
            disabled={isPending}
          >
            나중에 설정
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit]) => (
              <Button
                type="submit"
                className="flex-1"
                disabled={!canSubmit || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    연결 중...
                  </>
                ) : (
                  "연결하기"
                )}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  );
}

interface ChildFormData {
  name: string;
  birthDate: string;
  gender: string;
}

function ChildStep({
  onSubmit,
  error,
  isPending,
}: {
  onSubmit: (data: ChildFormData) => void;
  error: string | null;
  isPending: boolean;
}) {
  const { pendingDevice } = useOnboardingStore();
  const form = useForm({
    defaultValues: { name: "", birthDate: "", gender: "" } as ChildFormData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Baby className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle>아이 정보</CardTitle>
              <CardDescription>첫 번째 아이 정보를 등록해주세요.</CardDescription>
            </div>
          </div>
          {pendingDevice && (
            <div className="mt-3 p-2 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
              <Check className="size-4" />
              <span>디바이스가 연결되었습니다.</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "이름을 입력해주세요." : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>이름 *</Label>
                <Input
                  id={field.name}
                  placeholder="아이 이름"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="birthDate"
            validators={{
              onChange: ({ value }) =>
                !value ? "생년월일을 입력해주세요." : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>생년월일 *</Label>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
              </div>
            )}
          </form.Field>
          <form.Field name="gender">
            {(field) => (
              <div className="space-y-2">
                <Label>성별</Label>
                <Select
                  value={field.state.value || undefined}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {field.state.value
                        ? field.state.value === "male"
                          ? "남아"
                          : "여아"
                        : "성별 선택"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남아</SelectItem>
                    <SelectItem value="female">여아</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  <>
                    완료
                    <Check className="size-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  );
}

function CompleteStep({
  onNext,
  deviceError,
}: {
  onNext: () => void;
  deviceError?: string | null;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto size-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="size-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">가입 완료!</CardTitle>
        <CardDescription className="text-base">
          윤슬 서비스 이용 준비가 완료되었습니다.
          <br />
          이제 아이와 특별한 대화를 시작해보세요.
        </CardDescription>
        {deviceError && (
          <p className="text-sm text-amber-600 mt-4">
            {deviceError}
            <br />
            설정에서 다시 시도할 수 있습니다.
          </p>
        )}
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={onNext}>
          시작하기
        </Button>
      </CardFooter>
    </Card>
  );
}
