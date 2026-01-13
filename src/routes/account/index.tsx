import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";
import { useMeQuery } from "@/hooks/use-graphql";
import { ConnectionStatus } from "@/generated/graphql";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Baby,
  Smartphone,
  CreditCard,
  ChevronRight,
  Loader2,
  Settings,
  RefreshCw,
  UserPlus,
} from "lucide-react";

export const Route = createFileRoute("/account/")({
  beforeLoad: requireAuth,
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useMeQuery();

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              데이터를 불러오는 중 오류가 발생했습니다.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => refetch()}
            >
              <RefreshCw className="size-4 mr-2" />
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const user = data?.me;
  if (!user) {
    navigate({ to: "/onboarding" });
    return null;
  }

  return (
    <main className="flex-1 p-4 space-y-4">
      {/* 프로필 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>{user.name || "사용자"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {user.emailVerified && (
              <Badge variant="secondary">이메일 인증됨</Badge>
            )}
            {user.isActive && <Badge variant="default">활성</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* 구독 정보 */}
      {user.subscription && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">구독 정보</CardTitle>
              </div>
              <Badge
                variant={user.subscription.isExpired ? "destructive" : "default"}
              >
                {formatSubscriptionStatus(user.subscription.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">플랜</span>
                <span className="font-medium">
                  {formatPlanType(user.subscription.planType)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">만료일</span>
                <span>{formatDate(user.subscription.expiresAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">자동 갱신</span>
                <span>{user.subscription.autoRenew ? "켜짐" : "꺼짐"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 아이 목록 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">아이 목록</CardTitle>
            </div>
            <Badge variant="outline">{user.children?.length || 0}명</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {user.children && user.children.length > 0 ? (
            user.children.map((child) => (
              <Link
                key={child.id}
                to="/account/children/$childId"
                params={{ childId: child.id }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{child.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {child.age}세 · {formatGender(child.gender)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {child.device && (
                    <Badge
                      variant={
                        child.device.connectionStatus === ConnectionStatus.Online
                          ? "default"
                          : "secondary"
                      }
                      className="gap-1"
                    >
                      <Smartphone className="size-3" />
                      {formatConnectionStatus(child.device.connectionStatus)}
                    </Badge>
                  )}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <UserPlus className="size-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-3">
                등록된 아이가 없습니다.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/account/children/new" })}
              >
                <UserPlus className="size-4 mr-2" />
                아이 등록하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* 설정 링크 - TODO: 라우트 추가 후 활성화 */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-between" disabled>
          <span className="flex items-center gap-2">
            <Settings className="size-4" />
            계정 설정
          </span>
          <ChevronRight className="size-4" />
        </Button>
        <Button variant="outline" className="w-full justify-between" disabled>
          <span className="flex items-center gap-2">
            <Smartphone className="size-4" />
            디바이스 관리
          </span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </main>
  );
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatGender(gender: string | null | undefined): string {
  if (!gender) return "";
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

function formatSubscriptionStatus(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "활성";
    case "CANCELLED":
      return "취소됨";
    case "EXPIRED":
      return "만료됨";
    case "TRIAL":
      return "체험중";
    default:
      return status;
  }
}

function formatPlanType(planType: string): string {
  switch (planType) {
    case "FREE":
      return "무료";
    case "BASIC":
      return "기본";
    case "PREMIUM":
      return "프리미엄";
    default:
      return planType;
  }
}
