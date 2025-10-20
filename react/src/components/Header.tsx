import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Menu, X, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      requireAuth: true,
    },
  ];

  const authItems = [
    {
      label: t("login_page"),
      path: "/login",
    },
    {
      label: t("register_page"),
      path: "/register",
    },
  ];

  const renderMenuItems = (isMobile: boolean = false) => (
    <>
      <li>
        <LanguageToggle changeLanguage={changeLanguage} />
      </li>
      {menuItems
        .filter((item) => !item.requireAuth || user)
        .map((item, index) => (
          <NavigationMenuItem key={index} asChild>
            <li>
              <Link
                to={item.path}
                className={`text-base font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/20 backdrop-blur-sm truncate ${
                  isMobile ? "text-center w-full block" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          </NavigationMenuItem>
        ))}

      {user ? (
        <NavigationMenuItem>
          <Button
            onClick={logout}
            variant="destructive"
            className="bg-gradient-2 hover:shadow-glow"
          >
            {t("logout")}
          </Button>
        </NavigationMenuItem>
      ) : (
        authItems.map((item, index) => (
          <NavigationMenuItem key={index} asChild>
            <li>
              <Link to={item.path}>
                <Button
                  variant={index === 0 ? "outline" : "default"}
                  className={index === 0 ? "glass text-white hover:bg-white/20" : "bg-white text-primary hover:bg-white/90"}
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          </NavigationMenuItem>
        ))
      )}
    </>
  );

  return (
    <div className="sticky w-full z-50 top-0 glass shadow-lg border-b border-white/20">
      <header className="container mx-auto flex justify-between items-center p-4 text-white">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-1 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-heading font-bold hidden sm:block">
            QuickNotes
          </span>
        </Link>

        {/* User Info - Desktop */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-3 text-white flex items-center justify-center font-bold text-sm shadow-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm">
                {t("welcome")}
              </span>
              <span className="text-white/80 text-xs truncate max-w-[150px]">
                {user.email}
              </span>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          aria-label="Menu"
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white hover:scale-110 transition-transform"
        >
          {isMenuOpen ? (
            <X className="h-7 w-7" />
          ) : (
            <Menu className="h-7 w-7" />
          )}
        </button>

        {/* Desktop Navigation */}
        <NavigationMenu dir={i18n.dir()} className="hidden md:flex">
          <NavigationMenuList className="flex gap-4 items-center">
            {renderMenuItems()}
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 animate-slideUp">
          <ul className="flex flex-col p-4 gap-3 items-stretch">
            {user && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-3 text-white flex items-center justify-center font-bold shadow-lg">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-white font-semibold">
                    {t("welcome")}
                  </span>
                  <span className="text-white/80 text-sm truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            {renderMenuItems(true)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
