import { ExampleForm } from "@/components/common/example-form";

export const metadata = {
  title: "Demo Shadcn UI Form Components - Badminton Shop Admin",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Shadcn UI Form Components Showcase
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Components dùng chung: FormInput (Label + Input + Error Message) &amp; Button tích hợp React Hook Form + Zod.
          </p>
        </div>

        <ExampleForm />
      </div>
    </div>
  );
}
