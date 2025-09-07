import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Calendar, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, profile, signOut, loading } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Patient Portal", href: "/patient-dashboard" },
    { name: "Practitioner Portal", href: "/practitioner-dashboard" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" }
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Ayursutra</h1>
              <p className="text-xs text-muted-foreground">Panchakarma Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{profile?.full_name || user.email}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={signOut}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAuth(true)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:shadow-glow"
                      onClick={() => setShowAuth(true)}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-lg font-medium text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                 <div className="mt-8 space-y-4">
                   {!loading && (
                     <>
                       {user ? (
                         <Button 
                           variant="outline" 
                           className="w-full"
                           onClick={signOut}
                         >
                           <LogOut className="h-4 w-4 mr-2" />
                           Sign Out
                         </Button>
                       ) : (
                         <>
                           <Button 
                             variant="outline" 
                             className="w-full"
                             onClick={() => setShowAuth(true)}
                           >
                             <User className="h-4 w-4 mr-2" />
                             Login
                           </Button>
                           <Button 
                             className="w-full bg-gradient-primary hover:shadow-glow"
                             onClick={() => setShowAuth(true)}
                           >
                             Get Started
                           </Button>
                         </>
                       )}
                     </>
                   )}
                 </div>
              </nav>
            </SheetContent>
          </Sheet>
         </div>
       </div>

       <Dialog open={showAuth} onOpenChange={setShowAuth}>
         <DialogContent className="sm:max-w-md">
           <AuthForm onSuccess={() => setShowAuth(false)} />
         </DialogContent>
       </Dialog>
     </nav>
  );
};