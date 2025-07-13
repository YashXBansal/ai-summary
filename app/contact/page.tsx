"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message cannot be empty"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const res = await response.json();

      if (res.success) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error("Failed to send message. Try again later.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the message.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 py-20 px-4 sm:px-6 lg:px-16">
      <section className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          We’d love to hear from you. Whether you have a question, feedback, or
          just want to say hello — our inbox is always open.
        </p>
      </section>

      <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Contact Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium text-sm">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <Input id="name" placeholder="Jane Doe" className="pl-10" {...register("name")} />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium text-sm">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <Input id="email" placeholder="jane@example.com" className="pl-10" {...register("email")} />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block font-medium text-sm">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="pl-10 pt-2.5"
                  {...register("message")}
                />
              </div>
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:scale-105 transition disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        We typically respond within 24–48 hours.
      </p>
    </main>
  );
}