"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});


const ContactsPage = () => {

  const url = "http://localhost/pet-adoption-api/main.php";
  
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const { reset, formState } = form;
  const { isSubmitting } = formState; 

  const onSubmit = async (data) => {
    try {
      const jsonData = { ...data };

      const response = await axios.get(url, {
        params: { json: JSON.stringify(jsonData), operation: "" },
      });

      reset();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <div className="flex justify-center">
        {/* BOX CONTAINER */}
        <div className="w-full lg:w-[80%]">
          <div className="p-6 flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Contact Us
            </h2>
            <p className="text-sm text-muted-foreground">
              Get in touch with our adoption team or ask any questions.
            </p>
            <div className="flex justify-center p-6">
              <div className="h-72 w-full">
                <img
                  src="/images/L2.png"
                  alt="Pet adoption logo"
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col">
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What can we help you with?</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter message here"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="aroma"
                      className="w-full md:w-1/5"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Send us a message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactsPage;
