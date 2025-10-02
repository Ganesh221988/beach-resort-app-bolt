import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { SignupPage } from './components/auth/SignupPage';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { BrokerDashboard } from './components/dashboard/BrokerDashboard';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';

type AppView = 'landing' | 'login' | 'signup' | 'dashboard';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = React.useState<AppView>('landing');

  console.log('App State:', { user, isLoading, currentView });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
            <span className="text-white font-bold text-lg">ECR</span>
          </div>
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'login') {
      return (
        <LoginPage 
          onBackToLanding={() => setCurrentView('landing')}
          onSwitchToSignup={() => setCurrentView('signup')}
        />
      );
    }
    
    if (currentView === 'signup') {
      return (
        <SignupPage
          onSignup={async (userData) => {
            console.log('Signup attempt:', userData);
            setCurrentView('dashboard');
            return true;
          }}
          onBackToLanding={() => setCurrentView('landing')}
          onSwitchToLogin={() => setCurrentView('login')}
          isLoading={false}
        />
      );
    }
    
    return (
      <LandingPage
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'owner':
        return <OwnerDashboard />;
      case 'broker':
        return <BrokerDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {renderDashboard()}
    </div>
  );
}

function App() {
  console.log('App component rendering');

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;