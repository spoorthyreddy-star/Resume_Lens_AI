
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  FileText, 
  User, 
  LogIn, 
  LogOut, 
  PlusCircle, 
  Home 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, onLogin, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">Resume AI Nexus</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-foreground/80 hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-primary transition-colors">
            Pricing
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {/* Display user initials or generic avatar */}
                    U
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={onLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild variant="default">
                <Link to="/register">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Home
              </div>
            </Link>
            <Link 
              to="/features" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Features
              </div>
            </Link>
            <Link 
              to="/pricing" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-foreground/80 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </div>
                </Link>
                <div className="flex items-center space-x-2 py-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" onClick={onLogout} className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link 
                  to="/register" 
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
