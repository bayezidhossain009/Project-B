import { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AccountSetup } from './components/AccountSetup';
import { IssueForm } from './components/IssueForm';
import { DepositForm } from './components/DepositForm';
import { Dashboard } from './components/Dashboard';
import { RecordsList } from './components/RecordsList';
import { Settings } from './components/Settings';
import { BottomNav, Page } from './components/BottomNav';
import { UserInfo } from './types';
import { storage } from './utils/storage';

type AppState = 'splash' | 'setup' | 'main';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [recordsFilter, setRecordsFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const existingUser = storage.getUserInfo();
    if (existingUser) {
      setUser(existingUser);
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    const existingUser = storage.getUserInfo();
    if (existingUser) {
      setUser(existingUser);
      setAppState('main');
    } else {
      setAppState('setup');
    }
  }, []);

  const handleAccountComplete = (userInfo: UserInfo) => {
    storage.setUserInfo(userInfo);
    setUser(userInfo);
    setAppState('main');
    storage.setSplashShown();
  };

  const handleUserUpdate = (updatedUser: UserInfo) => {
    storage.setUserInfo(updatedUser);
    setUser(updatedUser);
  };

  const handleViewRecords = (filter: 'all' | 'active' | 'closed') => {
    setRecordsFilter(filter);
    setCurrentPage('records');
  };

  const navigateTo = (page: Page) => {
    if (page === 'settings') {
      setRecordsFilter('all');
    }
    setCurrentPage(page);
  };

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'setup') {
    return <AccountSetup onComplete={handleAccountComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onViewRecords={handleViewRecords} />;
      case 'issue':
        return <IssueForm onSaved={() => setRefreshTrigger((r) => r + 1)} />;
      case 'deposit':
        return <DepositForm onSaved={() => setRefreshTrigger((r) => r + 1)} refreshTrigger={refreshTrigger} />;
      case 'records':
        return (
          <RecordsList
            initialFilter={recordsFilter}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'settings':
        return (
          <Settings
            userInfo={user!}
            onUserUpdate={handleUserUpdate}
            onNavigateToProfile={() => setAppState('setup')}
          />
        );
      default:
        return <Dashboard onViewRecords={handleViewRecords} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderPage()}
      <BottomNav currentPage={currentPage} onNavigate={navigateTo} />
    </div>
  );
}
