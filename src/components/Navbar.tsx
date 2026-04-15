import { Button } from "@/components/ui/button";
import { Anvil } from "lucide-react";
import { Link } from "react-router-dom";

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Anvil className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">AIForge<span className="text-primary"> Refactor</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" onClick={scrollTo("features")} className="hover:text-foreground transition-colors">Features</a>
          <a href="#architecture" onClick={scrollTo("architecture")} className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#preview" onClick={scrollTo("preview")} className="hover:text-foreground transition-colors">Preview</a>
        </div>
        <Link to="/dashboard">
          <Button size="sm">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
