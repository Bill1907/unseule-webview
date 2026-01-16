import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useState } from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreateChildMutation } from "@/hooks/use-graphql";

export const Route = createFileRoute("/account/children/new")({
  component: NewChildPage,
});

function NewChildPage() {
  return (
    <>
      <SignedIn>
        <NewChildContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

interface ChildFormData {
  name: string;
  birthDate: string;
  gender: string;
}

function NewChildContent() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ChildFormData>({
    name: "",
    birthDate: "",
    gender: "",
  });

  const { mutate, isPending } = useCreateChildMutation({
    onSuccess: (data) => {
      if (data.createChild.success) {
        navigate({ to: "/account" });
      } else {
        setError(data.createChild.errorMessage || "등록에 실패했습니다.");
      }
    },
    onError: () => {
      setError("네트워크 오류가 발생했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutate({
      input: {
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender || undefined,
      },
    });
  };

  const isValid = formData.name && formData.birthDate;

  return (
    <main className="flex-1 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/account" })}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">아이 등록</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>아이 정보 입력</CardTitle>
            <CardDescription>아이의 기본 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="아이 이름"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>성별</Label>
              <Select
                value={formData.gender || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value ?? "" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {formData.gender ? (formData.gender === "male" ? "남아" : "여아") : "성별 선택"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남아</SelectItem>
                  <SelectItem value="female">여아</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  등록 중...
                </>
              ) : (
                "등록하기"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
