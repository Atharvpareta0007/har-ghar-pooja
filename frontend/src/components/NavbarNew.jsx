import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare, User, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from './ui/ButtonNew';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/#home' },
    { name: 'Services', path: '/#services' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'pandit') return '/pandit';
    return '/dashboard';
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🕉️</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Har Ghar Pooja</span>
              <span className="text-xs text-primary-600 -mt-1">AsthaSetu</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`font-medium text-gray-700 hover:text-primary-600 transition-colors ${
                  location.pathname + location.hash === link.path ? 'text-primary-600 font-semibold' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="tel:+919999999999" 
              className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="h-5 w-5 mr-1" />
              <span>+91 99999 99999</span>
            </a>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  as={Link} 
                  to={getDashboardPath()} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button as={Link} to="/login" size="sm" className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-2 border-t border-gray-100">
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      as={Link} 
                      to={getDashboardPath()} 
                      variant="outline" 
                      fullWidth
                      className="justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      variant="ghost"
                      fullWidth
                      className="justify-center text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    as={Link} 
                    to="/login" 
                    fullWidth 
                    className="justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login / Register
                  </Button>
                )}
                
                <a
                  href="tel:+919999999999"
                  className="mt-3 flex items-center justify-center px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Us: +91 99999 99999
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
