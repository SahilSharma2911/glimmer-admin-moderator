import { AuthBrandPanel } from "./components/AuthBrandPanel";
import { LoginForm } from "./components/LoginForm";

/**
 * The full login screen: brand panel (left) + sign-in form (right).
 * `font-hanken` is applied on <main> so every descendant (brand panel +
 * form) inherits Hanken Grotesk.
 */
export function LoginPage() {
  return (
    <main className="font-hanken-grotesk grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel className="hidden lg:flex" />
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <LoginForm />
      </div>
    </main>
  );
}
