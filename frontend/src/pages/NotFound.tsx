import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="mb-2 text-7xl font-bold text-blue-600">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-6 text-sm text-muted-foreground">The page you're looking for doesn't exist at Augustine's Collections.</p>
        <a href="/" className="text-blue-600 underline hover:text-blue-800 font-medium">
          Return to Shop
        </a>
      </div>
    </div>
  );
};

export default NotFound;