// import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {

  redirect('/dashboard/overview');
}
