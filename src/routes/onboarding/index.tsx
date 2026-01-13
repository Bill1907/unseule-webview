import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth";
import { useState } from "react";
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
import { Loader2, ChevronRight, Check, Baby, User, Sparkles } from "lucide-react";
import { useUpdateMeMutation, useCreateChildMutation } from "@/hooks/use-graphql";

export const Route = createFileRoute("/onboarding/")({
  beforeLoad: requireAuth,
  component: OnboardingPage,
});

type Step = "welcome" | "profile" | "child" | "complete";

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [error, setError] = useState<string | null>(null);

  const updateMeMutation = useUpdateMeMutation({
    onSuccess: (data) => {
      if (data.updateMe.success) {
        setError(null);
        setStep("child");
      } else {
        setError(data.updateMe.errorMessage || "프로필 저장에 실패했습니다.");
      }
    },
    onError: () => {
      setError("네트워크 오류가 발생했습니다.");
    },
  });

  const createChildMutation = useCreateChildMutation({
    onSuccess: (data) => {
      if (data.createChild.success) {
        setError(null);
        setStep("complete");
      } else {
        setError(data.createChild.errorMessage || "아이 등록에 실패했습니다.");
      }
    },
    onError: () => {
      setError("네트워크 오류가 발생했습니다.");
    },
  });

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen">
      {step === "welcome" && (
        <WelcomeStep onNext={() => setStep("profile")} />
      )}
      {step === "profile" && (
        <ProfileStep
          onSubmit={(data) => {
            setError(null);
            updateMeMutation.mutate({
              input: { name: data.name, phone: data.phone || undefined },
            });
          }}
          error={error}
          isPending={updateMeMutation.isPending}
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
          isPending={createChildMutation.isPending}
        />
      )}
      {step === "complete" && (
        <CompleteStep onNext={() => navigate({ to: "/account" })} />
      )}
    </main>
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
  name: string;
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
    defaultValues: { name: "", phone: "" } as ProfileFormData,
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
              <CardDescription>보호자 정보를 입력해주세요.</CardDescription>
            </div>
          </div>
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
                  placeholder="홍길동"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
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
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || isPending}>
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
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || isPending}>
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

function CompleteStep({ onNext }: { onNext: () => void }) {
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
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={onNext}>
          시작하기
        </Button>
      </CardFooter>
    </Card>
  );
}
