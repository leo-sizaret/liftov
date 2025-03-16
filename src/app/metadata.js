export const metadata = {
  title: 'Liftov - Workout Tracking',
  description: 'Track your workouts and progress with Liftov, a simple and effective workout tracking app',
  keywords: 'workout, tracking, fitness, exercise, gym, strength training, progressive overload',
  authors: [{ name: 'Liftov Team' }],
  creator: 'Liftov Team',
  publisher: 'Liftov',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://liftov.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Liftov - Workout Tracking',
    description: 'Track your workouts and progress with Liftov, a simple and effective workout tracking app',
    url: 'https://liftov.app',
    siteName: 'Liftov',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Liftov - Workout Tracking',
    description: 'Track your workouts and progress with Liftov, a simple and effective workout tracking app',
    creator: '@liftov',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};