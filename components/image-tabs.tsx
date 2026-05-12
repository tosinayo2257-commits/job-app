"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { useState } from "react";

export default function ImageTabs() {
  const [activeTab, setActiveTab] = useState("Organize");
  return (
    <section className="boreder-t bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Tabs */}
          <div className="flex gap-2 justify-center mb-8">
            <Button
              onClick={() => setActiveTab("organize")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "organize" ? "bg-[#f76382] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Organize Applications
            </Button>
            <Button
              onClick={() => setActiveTab("hired")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "hired" ? "bg-[#f76382] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Get Hired
            </Button>
            <Button
              onClick={() => setActiveTab("boards")}
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === "border" ? "bg-[#f76382] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Manage Boards
            </Button>
          </div>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
            {activeTab === "organize" && (
              <Image
                src="/hero.png"
                alt="Organize Applications"
                width={900}
                height={300}
              />
            )}
            {activeTab === "hired" && (
              <Image
                src="/hero2.png"
                alt="Organize Applications"
                width={900}
                height={300}
              />
            )}
            {activeTab === "boards" && (
              <Image
                src="/hero3.png"
                alt="Organize Applications"
                width={900}
                height={0}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
