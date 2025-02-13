import Banner from '@/components/Banner';
import LoginPage from '@/app/pages/LoginPage';
import BgLogin from '@/components/BgLogin';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Banner */}
      <Banner />
      
      {/* Background Image */}
      <BgLogin className="absolute top-0 left-0 right-0 bottom-0 z-0" />
      
      {/* Login Page */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center">
        <LoginPage />
      </div>
    </div>
  );
}
