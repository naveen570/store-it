"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createAccount } from "@/actions/user-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { OTPForm } from "./otp-form";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

type AuthFormProps = {
  type: "sign-in" | "sign-up";
};
const authFormSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    fullName:
      type === "sign-up"
        ? z.string().min(1, "Full name is required").max(50)
        : z.string().optional(),
    email: z.string().email("Invalid email").min(1, "Email is required"),
  });
type AuthFormValues = z.infer<ReturnType<typeof authFormSchema>>;
export const AuthForm = ({ type }: AuthFormProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  async function onSubmit(values: AuthFormValues) {
    try {
      setErrorMessage("");
      if (type === "sign-up") {
        const result = await createAccount({
          email: values.email,
          fullName: values.fullName ?? "",
        });
        if (result?.data?.accountId) {
          setAccountId(result.data.accountId);
          setIsOpen(true);
        } else {
          setErrorMessage("Failed to create account");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to submit form");
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-8 lg:mx-auto lg:max-w-lg"
        >
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field: { ...field } }) => (
                <FormItem className="shad-form-item">
                  <FormLabel className="shad-form-label">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-[66px]"
            disabled={form.formState.isSubmitting}
          >
            Submit
            {form.formState.isSubmitting && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loading"
                width={24}
                height={24}
                className="size-5 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="body-2 flex justify-center gap-1">
            <p>
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="text-brand"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      <OTPForm
        email={form.getValues("email")}
        isOpen={isOpen}
        toggle={() => setIsOpen((x) => !x)}
        accountId={accountId ?? ""}
      />
    </>
  );
};
