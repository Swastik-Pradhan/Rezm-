import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root to dashboard (if authenticated, dashboard handles it, else dashboard redirects to login)
  redirect('/dashboard');
}
