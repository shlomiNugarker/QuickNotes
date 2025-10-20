import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Menu, X, FileText } from "lucide-react";
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
                className={`text-sm font-medium transition-colors hover:text-primary px-3 py-2 ${
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
            size="sm"
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
                  size="sm"
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
    <div className="sticky w-full z-50 top-0 bg-white border-b border-border">
      <header className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            QuickNotes
          </span>
        </Link>

        {/* User Info - Desktop */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-medium text-sm">
                {t("welcome")}
              </span>
              <span className="text-muted-foreground text-xs truncate max-w-[150px]">
                {user.email}
              </span>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          aria-label="Menu"
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-foreground hover:text-primary transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <NavigationMenu dir={i18n.dir()} className="hidden md:flex">
          <NavigationMenuList className="flex gap-2 items-center">
            {renderMenuItems()}
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-slideUp">
          <ul className="flex flex-col p-4 gap-2 items-stretch">
            {user && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-secondary mb-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-foreground font-medium text-sm">
                    {t("welcome")}
                  </span>
                  <span className="text-muted-foreground text-xs truncate">
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
