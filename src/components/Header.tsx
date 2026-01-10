import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Wind,
  Map,
  BarChart3,
  AlertCircle,
  FileText,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationCenter } from '@/components/NotificationCenter';
import { GlobalSearch } from '@/components/GlobalSearch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/map', label: 'Map View', icon: Map },
  { path: '/alerts', label: 'Alerts', icon: AlertCircle },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">

          {/* LEFT: Logo + Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent"
              >
                <Wind className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">
                  VayuWatch
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-1">
                  India Air Quality Monitor
                </p>
              </div>
            </Link>

            <Badge
              variant="outline"
              className="hidden sm:flex items-center px-2 py-0.5 bg-warning/10 text-warning border-warning/30 text-xs"
            >
              🚀 Beta v1.0
            </Badge>
          </div>

          {/* CENTER: Search */}
          <div className="hidden md:flex flex-1 justify-center max-w-md">
            <GlobalSearch />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2 ml-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 ml-auto">
            <NotificationCenter />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.name || user?.phone}
                </span>
                <Button size="sm" variant="ghost" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button size="sm" variant="secondary">
                  <User className="w-4 h-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary"
              >
                <User className="w-5 h-5" />
                Login / Sign Up
              </Link>
            )}
          </motion.nav>
        )}
      </div>
    </header>
  );
}
