
import StyleGuide from '@/components/StyleGuide';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary"></div>
          <span className="font-semibold text-lg">Design System</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Components</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Tokens</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Github</a>
        </nav>
      </header>
      
      <main>
        <StyleGuide />
      </main>
      
      <footer className="border-t py-12 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Design System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
