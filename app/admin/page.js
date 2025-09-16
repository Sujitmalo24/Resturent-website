import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Server-side redirect to login page
  redirect('/admin/login');
}
