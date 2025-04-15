
import { ReactNode, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuthContext } from '@/App';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogin={login} onLogout={logout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
