import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sigin-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default async function Page() {
  let stars = 3000; // Default value

  try {
    const response = await fetch(
      'https://github.com/namph-hanoi',
      {
        next: { revalidate: 3600 }
      }
    );

    if (response.ok) {
      const data = await response.json();
      stars = data.stargazers_count || stars; // Update stars if API response is valid
    }
  } catch (error) {
    // Error fetching GitHub stars, using default value
  }
  return <SignInViewPage stars={stars} />;
}
