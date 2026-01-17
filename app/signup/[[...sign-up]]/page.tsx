import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-grid-zinc-900/50">
      <div className="absolute inset-0 bg-zinc-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-md relative">
        <SignUp
          routing="path"
          path="/signup"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-teal-500 hover:bg-teal-600 text-white text-sm normal-case",
              card: "bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-zinc-400",
              socialButtonsBlockButton:
                "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
              socialButtonsBlockButtonText: "text-white",
              formFieldLabel: "text-zinc-400",
              formFieldInput:
                "bg-zinc-800 border-zinc-700 text-white focus:border-teal-500",
              footerActionLink: "text-teal-400 hover:text-teal-300",
            },
            layout: {
              socialButtonsPlacement: "top",
            },
          }}
          // @ts-expect-error - Localization prop is supported but types are missing
          localization={{
            signUp: {
              start: {
                title: "Join Aganya AI",
                subtitle: "Create an account to start predicting",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
