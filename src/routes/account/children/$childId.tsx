import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";
import { useState } from "react";
import { useChildQuery, useDeleteChildMutation } from "@/hooks/use-graphql";
import { ConnectionStatus } from "@/generated/graphql";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Smartphone,
  Battery,
  Wifi,
  Loader2,
  RefreshCw,
  Bluetooth,
  Pencil,
  Trash2,
} from "lucide-react";
import { flutter } from "@/lib/flutter/bridge";

export const Route = createFileRoute("/account/children/$childId")({
  beforeLoad: requireAuth,
  component: ChildDetailPage,
});

function ChildDetailPage() {
  const { childId } = Route.useParams();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useChildQuery({ id: childId });

  const { mutate: deleteChild, isPending: isDeleting } = useDeleteChildMutation({
    onSuccess: (result) => {
      if (result.deleteChild.success) {
        navigate({ to: "/account" });
      } else {
        setDeleteError(result.deleteChild.errorMessage || "삭제에 실패했습니다.");
      }
    },
    onError: () => {
      setDeleteError("네트워크 오류가 발생했습니다.");
    },
  });

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error || !data?.child) {
    return (
      <main className="flex-1 p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              아이 정보를 불러올 수 없습니다.
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: "/account" })}
              >
                <ArrowLeft className="size-4 mr-2" />
                돌아가기
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => refetch()}
              >
                <RefreshCw className="size-4 mr-2" />
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const child = data.child;
  const device = child.device;

  return (
    <main className="flex-1 p-4 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/account" })}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold">{child.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate({
                to: "/account/children/$childId/edit",
                params: { childId },
              })
            }
          >
            <Pencil className="size-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>아이 정보 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  {child.name}의 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수
                  없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {deleteError && (
                <p className="text-sm text-destructive">{deleteError}</p>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteChild({ childId })}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "삭제"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* 아이 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="이름" value={child.name} />
          <InfoRow label="나이" value={`${child.age}세`} />
          <InfoRow label="성별" value={formatGender(child.gender)} />
          <InfoRow label="생년월일" value={formatDate(child.birthDate)} />
        </CardContent>
      </Card>

      {/* 연결된 디바이스 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="size-4 text-muted-foreground" />
            <CardTitle>연결된 인형</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {device ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{device.deviceType}</span>
                <Badge
                  variant={
                    device.connectionStatus === ConnectionStatus.Online
                      ? "default"
                      : "outline"
                  }
                >
                  {formatConnectionStatus(device.connectionStatus)}
                </Badge>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Battery className="size-4" />
                  <span>{device.batteryLevel ?? "-"}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="size-4" />
                  <span>v{device.firmwareVersion}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                S/N: {device.serialNumber}
              </p>
              {device.pairedAt && (
                <p className="text-xs text-muted-foreground">
                  연결일: {formatDate(device.pairedAt)}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bluetooth className="size-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-3">
                연결된 인형이 없습니다.
              </p>
              <Button
                variant="outline"
                onClick={() => flutter.bluetooth.startScan()}
              >
                <Bluetooth className="size-4 mr-2" />
                인형 연결하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR");
}

function formatGender(gender: string | null | undefined): string {
  if (!gender) return "-";
  return gender === "male" ? "남아" : "여아";
}

function formatConnectionStatus(status: ConnectionStatus): string {
  switch (status) {
    case ConnectionStatus.Online:
      return "연결됨";
    case ConnectionStatus.Offline:
      return "오프라인";
    case ConnectionStatus.Sleep:
      return "대기중";
    default:
      return "알 수 없음";
  }
}
