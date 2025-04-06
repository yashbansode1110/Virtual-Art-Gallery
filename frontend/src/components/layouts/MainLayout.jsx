import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

function MainLayout({ darkMode, toggleDarkMode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default MainLayout; 