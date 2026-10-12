import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center bg-background p-margin-mobile md:p-0">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center rounded-xl border border-outline-variant bg-surface p-stack-lg text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="mb-stack-lg flex flex-col items-center">
            <div className="mb-stack-md flex h-16 w-16 items-center justify-center rounded-lg bg-surface-container-high">
              <span className="material-symbols-outlined text-4xl text-primary">
                hub
              </span>
            </div>
            <h1 className="mb-stack-sm text-headline-lg text-text-primary">
              Project Nexus Hub
            </h1>
            <p className="text-body-lg text-text-secondary">
              Stakeholder AI Assistant
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant bg-surface px-4 py-3 text-label-md text-text-primary shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors duration-200 hover:bg-surface-container-low active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="mt-stack-lg flex items-center justify-center gap-2 text-text-secondary">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="text-label-sm">Secure Enterprise Portal</span>
          </div>
        </div>

        <div className="mt-stack-md flex justify-center gap-gutter text-label-sm text-text-secondary">
          <a className="transition-colors hover:text-primary" href="#">
            Privacy Policy
          </a>
          <a className="transition-colors hover:text-primary" href="#">
            Terms of Service
          </a>
        </div>
      </div>
    </main>
  );
}
