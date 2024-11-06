"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

const Login = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // useEffect(() => {
    //     const data = localStorage.getItem("user");
    //     if (data) {
    //         router.push("/");
    //     }
    //   }, []);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const url = "http://localhost/pet-adoption-api/auth.php";

      const jsonData = {
        email: data.email,
        password: data.password,
      };

      const requestData = new FormData();
      requestData.append("operation", "adopterLogin");
      requestData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 200) {
        setIsSubmitting(false);
        alert("Status error: " + response.statusText);
        return;
      }

      if (response.data.success) {
        setIsSubmitting(false);
        localStorage.setItem("user", JSON.stringify(response.data.success));
        router.push("/pet");
      } else {
        setIsSubmitting(false);
        alert(`${response.data.error}`);
      }

    } catch (error) {
      setIsSubmitting(false);
      alert(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="grid w-full h-full grid-cols-1 md:grid-cols-2">
        <div className="bg-[#FAF9F6] flex flex-col items-center justify-center p-10">
          <div>
            <div className="my-6">
                <div className="flex items-center mb-4">
                    <Image
                        src="/images/logo.png"
                        height={64}
                        width={64}
                        alt="Pet Adoption logo"
                        className="h-16 w-fit me-4"
                    />
                    <h1 className="text-3xl font-semibold text-slate-800">
                    Welcome Back
                    </h1>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                Log in to connect with lovable pets in need of a home and give
                them the love they deserve.
                </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  variant="lime"
                  className="w-full mb-3"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Log in"}
                </Button>
              </form>
            </Form>
            <p className="text-sm text-center text-gray-700 mt-4">
                Don't have an account?
                <Link href="/signup" className="text-sky-500 hover:underline ms-2">Signup</Link>
            </p>
          </div>
        </div>
        <div className="relative hidden md:block">
          <Image
            className="object-cover"
            fill={true}
            src="/images/bg1.png"
            alt="bg-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
