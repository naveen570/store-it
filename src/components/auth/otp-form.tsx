"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendEmailOTP, verifyOTP } from "@/lib/actions/user-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
type OTPFormProps = {
  email: string;
  isOpen: boolean;
  toggle: () => void;
  accountId: string;
};
const OTPFormSchema = z.object({
  otp: z.string().min(6, "OTP is required"),
});
export const OTPForm = ({ email, isOpen, toggle, accountId }: OTPFormProps) => {
  const otpForm = useForm<z.infer<typeof OTPFormSchema>>({
    defaultValues: { otp: "" },
    resolver: zodResolver(OTPFormSchema),
  });
  const router = useRouter();
  const { executeAsync, isPending } = useAction(verifyOTP);
  const { executeAsync: resendOTP, isPending: isPendingOTP } =
    useAction(sendEmailOTP);
  const onSubmit = async (values: z.infer<typeof OTPFormSchema>) => {
    const result = await executeAsync({
      accountId: accountId,
      otp: values.otp,
    });
    if (result?.data?.sessionId) {
      toggle();
      router.push("/");
    }
  };
  const handleResend = async () => {
    await resendOTP({ email });
  };
  const isLoading = isPending || otpForm.formState.isSubmitting;
  return (
    <AlertDialog open={isOpen} onOpenChange={toggle}>
      <AlertDialogContent className="shad-alert-dialog sm:max-w-[600px]">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2">Enter OTP</AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2">
            We&apos;ve sent a code to{" "}
            <span className="text-brand pl-1">{email}</span>
          </AlertDialogDescription>
          <Image
            src="/assets/icons/close-dark.svg"
            alt="Close"
            width={20}
            height={20}
            className="otp-close-button cursor-pointer"
            onClick={toggle}
          />
        </AlertDialogHeader>
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onSubmit)}
            className="flex w-full flex-col space-y-8 lg:mx-auto lg:max-w-lg"
          >
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field: { ...field } }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="w-full justify-center gap-3 rounded-[12px]">
                        <InputOTPSlot
                          index={0}
                          className="text-brand shad-otp-slot size-10 rounded-[12px] text-4xl font-medium md:h-[80px] md:w-[70px]"
                        />
                        <InputOTPSlot
                          index={1}
                          className="text-brand shad-otp-slot size-10 rounded-[12px] text-4xl font-medium md:h-[80px] md:w-[70px]"
                        />
                        <InputOTPSlot
                          index={2}
                          className="text-brand shad-otp-slot size-10 rounded-[12px] text-4xl font-medium md:h-[80px] md:w-[70px]"
                        />
                        <InputOTPSlot
                          index={3}
                          className="text-brand shad-otp-slot size-10 rounded-[12px] text-4xl font-medium md:h-[80px] md:w-[70px]"
                        />
                        <InputOTPSlot
                          index={4}
                          className="text-brand shad-otp-slot size-10 rounded-[12px] text-4xl font-medium md:h-[80px] md:w-[70px]"
                        />
                        <InputOTPSlot
                          index={5}
                          className="text-brand shad-otp-slot size-10 rounded-[12px] text-4xl font-medium md:h-[80px] md:w-[70px]"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
            <div className="flex w-full flex-col gap-4">
              <Button type="submit" disabled={isLoading} className="h-12">
                Submit
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loading"
                    width={24}
                    height={24}
                    className="size-5 animate-spin"
                  />
                )}
              </Button>
              <div className="body-2 text-light-100 flex items-center justify-center gap-1">
                <p>Didn’t get a code?</p>
                <Button
                  className="text-brand h-auto p-0"
                  variant={"link"}
                  disabled={isPendingOTP}
                  onClick={handleResend}
                >
                  Click to resend
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
