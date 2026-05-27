"use client";

import { ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ImageTabs from "@/components/image-tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {" "}
        {/* Hero section */}
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-black mb-6 text-6xl font-bold">
              A better way to track your job application
            </h1>
            <p className="text-gray-700 mb-10 text-xl">
              Capture, orgaize, and stay on top of your job search in one place.
            </p>
            <div className="flx flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg font-medium">
                  start for free <ArrowRight className="ml-2" />
                </Button>
              </Link>

              <p className="text-sm text-gray-700">
                free forever. No credit card required.
              </p>
            </div>
          </div>
        </section>
        {/*Hero Images Section with taps */}
        <ImageTabs />
        {/* feature section */}
        <section className="border-t bg-white py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[#f76382]" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  Organize Application
                </h3>
                <p className="text-gray-700">
                  Create custom boards and columns to track your job
                  applications at every stage of the process.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[#f76382]" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  Track Progress
                </h3>
                <p className="text-gray-700">
                  Monitor your application status from applied to interview to
                  offer with visual kanban boards.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[#f76382]" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  Stay Organized
                </h3>
                <p className="text-gray-700">
                  Never lose track of an application. keep all your job search
                  in one centralized place
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
