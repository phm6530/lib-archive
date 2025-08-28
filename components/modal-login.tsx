"use client";
import { ReactNode, useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircleIcon, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react"; // Import useState for error message and dialog control
import { Skeleton } from "./ui/skeleton";

export const loginSchema = z.object({
  user_id: z
    .string()
    .min(1, { message: "필수항목 입니다." })
    .pipe(z.email({ message: "이메일 형식이 아닙니다." })),
  user_password: z.string().min(1, { message: "필수항목 입니다." }),
});

export default function SignIn({ children }: { children: ReactNode }) {
  const id = useId();
  const { data: session, status } = useSession();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control dialog open/close

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      user_id: "",
      user_password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmitHandler = async (loginData: z.infer<typeof loginSchema>) => {
    setLoginError(null);
    const result = await signIn("credentials", {
      email: loginData.user_id,
      password: loginData.user_password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setLoginError(
          `이메일 또는 비밀번호가 올바르지 않습니다. ${result.error}`
        );
      }
    } else {
      reset();
      setIsModalOpen(false); // Close the modal on successful login
      alert("로그인 완료");
    }
  };

  const errorArr = Object.entries(errors);

  if (status === "loading") {
    return <Skeleton className="h-9 w-9 rounded-md" />;
  }

  if (status === "authenticated") {
    return (
      <Button
        variant={"outline"}
        onClick={() => signOut()}
        size={"icon"}
        className="text-muted-foreground hover:text-primary cursor-pointer bg-transparent"
      >
        <LogOut className="size-4" />
      </Button>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
        {children}
      </DialogTrigger>{" "}
      {/* Open modal on trigger click */}
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center text-2xl pt-10 pb-10">
              Ny lib Acarhive
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              권한이 있는 사용자 이외 접근이 불가합니다
            </DialogDescription>
          </DialogHeader>
        </div>
        {(errorArr[0] || loginError) && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle className="text-xs">
              {errorArr[0] ? errorArr[0][1].message : loginError}
            </AlertTitle>
          </Alert>
        )}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Admin</Label>
              <Input
                id={`${id}-email`}
                disabled={isSubmitting}
                placeholder="Admin"
                {...register("user_id")}
              />
            </div>
            <div className="not-first:mt-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                disabled={isSubmitting}
                type="password"
                {...register("user_password")}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
