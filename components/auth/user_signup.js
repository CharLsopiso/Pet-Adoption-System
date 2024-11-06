"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

const FormSchema = z .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    contactNum: z.string().min(1, "Contact number is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    username: z.string().min(1, "Username is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[\d]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPass: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPass, {
    path: ["confirmPass"],
    message: "Passwords do not match",
  });

const Signup = () => {
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
        firstName: "",
        lastName: "",
        contactNum: "",
        email: "",
        address: "",
        username: "",
        password: "",
        },
    });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const url = "http://localhost/pet-adoption-api/auth.php";

      const jsonData = {
        firstName: data.firstName,
        lastName: data.lastName,
        contactNum: data.contactNum,
        email: data.email,
        address: data.address,
        username: data.username,
        password: data.password,
      };

      const response = await axios.get(url, {
        params: { json: JSON.stringify(jsonData), operation: "adopterSignup" },
      });

      console.log(response);

      if (response.status !== 200) {
        setIsSubmitting(false);
        alert("Status error: " + response.statusText);
        return;
      }

      if (response.data.success) {
        setIsSubmitting(false);
        localStorage.setItem("user", JSON.stringify(response.data.success));
        router.push("/login");
      } else {
        setIsSubmitting(false);
        alert(response.data.error);
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
                    Sign up
                    </h1>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                Sign up to connect with lovable pets in need of a home and give
                them the love they deserve.
                </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                    control={form.control}
                    name="contactNum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
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

                  <FormField
                    control={form.control}
                    name="confirmPass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
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
                  {isSubmitting ? "Submitting..." : "Sign up"}
                </Button>
              </form>
            </Form>
            <p className="text-sm text-center text-gray-700 mt-4">
              Already have an account?
              <Link
                href="/login"
                className="text-sky-500 hover:underline ms-2"
              >
                Login
              </Link>
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

export default Signup;
