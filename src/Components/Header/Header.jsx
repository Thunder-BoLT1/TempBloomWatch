import { NavLink } from "react-router-dom"; // Link is no longer needed
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- NEW FUNCTION TO HANDLE SCROLLING TO TOP ---
  const handleScrollToTop = () => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  // --- END NEW FUNCTION ---

  return (
    <>
      <header className={`${styles.headerContainer} ${isScrolled ? styles.headerHidden : ""}`}>
        {/* All original header content stays inside */}
        <NavLink className={styles.headerContaine} to="/">
          <div className={styles.logoContainer}>
            <h1 className={styles.logoName}>Bee-yond Sights</h1>
          </div>
        </NavLink>

        <button
          className={styles.burgerMenu}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`${styles.burgerLine} ${
              mobileMenuOpen ? styles.burgerLineOpen : ""
            }`}
          ></span>
          <span
            className={`${styles.burgerLine} ${
              mobileMenuOpen ? styles.burgerLineOpen : ""
            }`}
          ></span>
          <span
            className={`${styles.burgerLine} ${
              mobileMenuOpen ? styles.burgerLineOpen : ""
            }`}
          ></span>
        </button>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink to="/" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/Dashboard" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/Storytelling" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Storytelling
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/DataExplorer" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Data Explorer
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/HealthPollen" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Health & Pollen
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/DesertRisk" className={({isActive}) => (isActive ? styles.ActiveLink: "")} onClick={() => setMobileMenuOpen(false)}>
                Desert Risk
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      
      {/* --- MOON ICON CHANGED FROM LINK TO BUTTON --- */}
      <button 
        onClick={handleScrollToTop} 
        className={`${styles.moonIcon} ${isScrolled ? styles.moonIconVisible : ""}`} 
        aria-label="Scroll to top"
      >
        🌙
      </button>
      {/* --- END OF CHANGE --- */}
    </>
  );
}

export default Header;