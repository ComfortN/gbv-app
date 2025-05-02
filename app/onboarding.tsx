import { useRouter } from 'expo-router';
import OnboardingScreen from '../src/screens/Onboarding';

export default function Onboarding() {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    // Navigate to main app when onboarding is complete
    router.push('/');
  };

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}