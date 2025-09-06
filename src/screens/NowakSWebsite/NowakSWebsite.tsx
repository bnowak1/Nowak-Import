import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

// Declare Resy widget types
declare global {
  interface Window {
    ResyWidget?: {
      addButton: (element: HTMLElement, config: { venueId: number; apiKey: string; replace?: boolean }) => void;
    };
    resyWidget?: {
      addButton: (element: HTMLElement, config: { venueId: number; apiKey: string; replace?: boolean }) => void;
    };
    resy?: {
      init: () => void;
    };
  }
}

export const NowakSWebsite = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on escape key or when window resizes to desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Add immediate logging outside of any hooks
  console.log('🔥 IMMEDIATE LOG: NowakSWebsite component file loaded');

  // Add immediate logging to check if component is mounting
  console.log('🔥 NowakSWebsite component rendered, currentPage:', currentPage);

  const resyInitRef = useRef(false);
  const resyLoadPromise = useRef<Promise<void> | null>(null);

  const ensureResyScriptLoaded = (): Promise<void> => {
    if ((window as any).resyWidget || window.ResyWidget) {
      return Promise.resolve();
    }
    if (!resyLoadPromise.current) {
      resyLoadPromise.current = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src="https://widgets.resy.com/embed.js"]') as HTMLScriptElement | null;
        if (existing && ((window as any).resyWidget || window.ResyWidget)) {
          resolve();
          return;
        }
        const script = existing || document.createElement('script');
        script.src = 'https://widgets.resy.com/embed.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Resy script'));
        if (!existing) document.head.appendChild(script);
      });
    }
    return resyLoadPromise.current;
  };

  // Elfsight script loader
  const ensureElfsightScriptLoaded = (): void => {
    const existing = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]') as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    ensureElfsightScriptLoaded();
  }, []);

  // Resy button component
  const ResyButton = ({ children, className, phoneSize = 'lg', phoneAlign = 'left' }: { children: React.ReactNode; className: string; phoneSize?: 'lg' | 'md'; phoneAlign?: 'left' | 'center' }) => {
    const [showPhone, setShowPhone] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const el = e.currentTarget as HTMLButtonElement;
      const y = window.scrollY;

      if (el.dataset.resyInitialized === 'true') {
        setShowPhone(true);
        setTimeout(() => {
          el.click();
          setTimeout(() => window.scrollTo(0, y), 0);
        }, 0);
        return;
      }
      try {
        await ensureResyScriptLoaded();
        const api = (window as any).resyWidget || window.ResyWidget;
        if (api && typeof api.addButton === 'function') {
          api.addButton(el as unknown as HTMLElement, {
            venueId: 70082,
            apiKey: "JlDuswwB8HfUYHxXVETZGCxJBUW8sUP1",
            replace: true,
          });
          el.dataset.resyInitialized = 'true';
          setShowPhone(true);
          setTimeout(() => {
            el.click();
            setTimeout(() => window.scrollTo(0, y), 0);
          }, 0);
        } else {
          console.error('Resy widget API not available');
        }
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="flex flex-col items-start">
        <button
          type="button"
          className={cn("inline-flex items-center justify-center leading-none", className)}
          data-resy-button="true"
          onClick={handleClick}
        >
          {children}
        </button>
        {showPhone && (
          <div className={cn(
            "mt-2 [font-family:'Gentium_Book_Plus',Helvetica] font-bold text-white",
            phoneSize === 'lg' ? 'text-2xl leading-8' : 'text-xl leading-7',
            phoneAlign === 'center' ? 'self-center text-center' : 'self-start text-left'
          )}>
            <span>or call </span>
            <a href="tel:4049803638" className="text-white">404-980-3638</a>
          </div>
        )}
      </div>
    );
  };

  const navigationItems = [
    { id: "menu", label: "Menu" },
    { id: "about", label: "About" },
    { id: "private-dining", label: "Private Dining" },
    { id: "contact", label: "Contact Us" },
  ];

  const highlightCards = [
    {
      image: "/images/dining.png",
      title: "Dining",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets%2F2edaa8d02eb843e397032edf5f1682f1%2F305dddb3784e4221a3aa2e83c6d4b8e5?format=webp&width=800",
      title: "Bar",
    },
    {
      image: "/images/private-dining.png",
      title: "Private Dining",
    },
    {
      image: "/images/seafood-bar.png",
      title: "Seafood Bar",
    },
  ];

  const contactFormFields = [
    { id: "name", label: "Name", placeholder: "Your Name", type: "input" },
    { id: "email", label: "Email", placeholder: "Your Email", type: "input" },
    { id: "phone", label: "Phone", placeholder: "Your Phone", type: "input" },
    { id: "subject", label: "Subject", placeholder: "Subject", type: "input" },
    { id: "message", label: "Message", placeholder: "", type: "textarea" },
  ];

  const footerLinks = [
    { id: "reservations", label: "Reserve" },
    { id: "contact", label: "Contact Us" },
    { id: "menu", label: "Menu" },
    { id: "privacy-policy", label: "Privacy Policy" },
    { id: "terms-of-service", label: "Terms of Service" },
  ];


  const Header = () => (
    <header className="min-h-[80px] md:h-[121px] flex flex-col md:flex-row items-center justify-between px-4 md:px-10 py-3 border-b border-solid border-[#3d332d] bg-black translate-y-[-1rem] animate-fade-in opacity-0">
      {/* Mobile Layout */}
      <div className="w-full flex items-center justify-between md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-[44px] min-h-[44px] p-2 text-white hover:text-[#e0c4b7] transition-colors focus-visible border-none outline-none"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          style={{ border: 'none', outline: 'none' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <a
          href="#"
          aria-label="Go to homepage"
          onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
          className="flex justify-center items-center"
        >
          <img
            className="w-52 h-20 object-contain"
            alt="Nowak's Steakhouse Logo"
            src="/images/logo.png"
            loading="eager"
            decoding="sync"
            width="208"
            height="80"
          />
        </a>

        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      {/* Desktop Logo */}
      <a
        href="#"
        aria-label="Go to homepage"
        onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
        className="hidden md:flex w-52 h-20 justify-center items-center"
      >
        <img
          className="w-52 h-20 object-contain"
          alt="Nowak's Steakhouse Logo"
          src="/images/logo.png"
          loading="eager"
          decoding="sync"
          width="208"
          height="80"
        />
      </a>

      {/* Mobile Reservation Button - Always visible on mobile */}
      <div className="w-full flex items-center justify-between mt-5 md:hidden">
        <div className="w-8"></div> {/* Left spacer to match hamburger button width */}
        <ResyButton className="w-48 h-10 px-4 bg-[#e0c4b7] hover:bg-[#d4b5a6] [font-family:'Noto_Serif',Helvetica] font-bold text-[#1e1614] text-sm transition-colors rounded-md">
          Make a Reservation
        </ResyButton>
        <div className="w-8"></div> {/* Right spacer for balance */}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="[font-family:'Noto_Serif',Helvetica] font-medium text-white text-sm tracking-[0] leading-[21px] hover:text-[#e0c4b7] transition-colors h-auto p-2"
            onClick={() => setCurrentPage(item.id)}
          >
            {item.label}
          </Button>
        ))}

        <ResyButton className="min-w-[140px] h-10 px-4 bg-[#e0c4b7] hover:bg-[#d4b5a6] [font-family:'Noto_Serif',Helvetica] font-bold text-[#1e1614] text-sm transition-colors rounded-md">
          Make a Reservation
        </ResyButton>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="w-full md:hidden mt-4 pb-4 border-t border-[#3d332d]" role="menu">
          <nav className="flex flex-col space-y-2 pt-4" aria-label="Mobile navigation">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                role="menuitem"
                className="[font-family:'Noto_Serif',Helvetica] font-medium text-white text-base tracking-[0] leading-[21px] hover:text-[#e0c4b7] transition-colors min-h-[44px] p-3 justify-start focus-visible"
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );

  const Footer = () => (
    <footer className="flex items-start justify-center bg-black">
      <div className="w-full max-w-[960px] flex flex-col items-start">
        <div className="flex flex-col items-start gap-6 px-4 md:px-5 py-8 md:py-10 self-stretch w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 md:gap-6 self-stretch w-full">
            {footerLinks.map((link, index) => (
              <div key={index} className="w-32 md:w-40 flex flex-col items-center">
                {link.id === "reservations" ? (
                  <ResyButton phoneSize="md" phoneAlign="center" className="[font-family:'Noto_Serif',Helvetica] font-normal text-[#baa8a0] text-sm md:text-base text-center tracking-[0] leading-6 hover:text-white transition-colors h-auto p-0 bg-transparent">
                    {link.label}
                  </ResyButton>
                ) : (
                  <Button
                    variant="ghost"
                    className="[font-family:'Noto_Serif',Helvetica] font-normal text-[#baa8a0] text-sm md:text-base text-center tracking-[0] leading-6 hover:text-white transition-colors h-auto p-0"
                    onClick={() => setCurrentPage(link.id)}
                  >
                    {link.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center self-stretch w-full">
            <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-[#baa8a0] text-sm md:text-base text-center tracking-[0] leading-6 px-4">
              @2025 Nowak's Steakhouse - All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );

  const HomePage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-col items-start self-stretch w-full">
            <div className="flex flex-col items-start p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              <div className="w-full h-[300px] md:h-[400px] lg:h-[480px] rounded overflow-hidden relative">
                <img
                  src="/images/hero-background.png"
                  alt="Elegant dining room at Nowak's Steakhouse"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                  width="960"
                  height="480"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="max-w-[896px] text-center mb-6 md:mb-8 px-4 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
                    <h1 className="[font-family:'Gentium_Book_Plus',Helvetica] font-bold text-white text-2xl md:text-4xl lg:text-5xl tracking-[-0.96px] leading-tight md:leading-[60px] mb-3 md:mb-4 text-overlay">
                      THE BEST STEAKS IN ATLANTA
                    </h1>
                    <p className="[font-family:'Gentium_Book_Plus',Helvetica] font-normal text-white text-lg md:text-2xl lg:text-[34px] tracking-[-0.48px] leading-relaxed md:leading-[60px] mb-3 md:mb-4 text-overlay">
                      "A neighborhood steakhouse with something for everyone!"
                    </p>
                    <p className="[font-family:'Gentium_Book_Basic',Helvetica] font-normal text-white text-base md:text-xl lg:text-[28px] text-center tracking-[0] leading-relaxed text-overlay">
                      Best Steaks, Seafood, Chicken, Pasta & More
                    </p>
                  </div>

                  {/* Desktop-only Reservation Button in Hero */}
                  <div className="hidden md:block">
                    <ResyButton className="min-w-[84px] max-w-[480px] h-12 px-6 bg-[#e0c4b7] hover:bg-[#d4b5a6] text-[#1e1614] text-base font-bold transition-colors rounded-md translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms] focus-visible">
                      Make a Reservation
                    </ResyButton>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start pt-5 pb-3 px-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
            <h2 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-7">
              Overview
            </h2>
          </div>

          <div className="flex flex-col items-start pt-1 pb-3 px-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
            <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-white text-[17px] tracking-[0] leading-6">
              Nowak's is a modern steakhouse that offers a sophisticated dining
              experience. Our menu features a wide selection of steaks, fresh
              seafood, and an array of classic and contemporary dishes. The
              restaurant boasts a stylish interior, a lively bar, a seafood bar,
              and large private dining room for business or personal special
              occasions.
            </p>
          </div>

          <div className="flex flex-col items-start pt-5 pb-3 px-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1200ms]">
            <h2 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-7">
              Highlights
            </h2>
          </div>

          <div className="flex flex-col items-start gap-3 p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1400ms]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 self-stretch w-full">
              {highlightCards.map((card, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-start gap-3 pt-0 pb-3 px-0 bg-transparent border-none"
                >
                  <CardContent className="p-0 w-full">
                    <div className="w-full h-40 md:h-[223px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="223"
                        height="223"
                      />
                    </div>
                    <div className="flex flex-col items-start mt-3 w-full">
                      <h3 className="[font-family:'Noto_Serif',Helvetica] font-medium text-white text-sm md:text-lg tracking-[0] leading-6">
                        {card.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1600ms]">
            <div className="flex flex-col items-center justify-end gap-6 md:gap-8 px-4 md:px-10 py-12 md:py-20 self-stretch w-full">
              <div className="flex flex-col items-center gap-2 self-stretch w-full">
                <div className="flex flex-col max-w-[720px] items-center px-4">
                  <h2 className="[font-family:'Noto_Serif',Helvetica] font-black text-white text-2xl md:text-3xl lg:text-[38px] text-center tracking-[-1.00px] leading-tight md:leading-[45px]">
                    Stay in the Know
                  </h2>
                </div>
                <div className="flex flex-col items-center self-stretch w-full px-4">
                  <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-white text-base md:text-lg text-center tracking-[0] leading-6 max-w-[600px]">
                    Sign up for our newsletter to receive updates on special
                    events, new menu items, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-center self-stretch w-full px-4">
                <div className="flex flex-col min-w-40 max-w-[480px] w-full h-16 items-start">
                  <div className="flex flex-col md:flex-row items-start self-stretch w-full rounded">
                    <div className="flex pl-4 pr-2 py-2 flex-1 rounded-t md:rounded-l md:rounded-tr-none bg-[#3d332d] items-center w-full">
                      <Input
                        placeholder="Email Address"
                        className="bg-transparent border-none text-[#baa8a0] [font-family:'Noto_Serif',Helvetica] font-normal text-base p-0 h-auto focus-visible:ring-0 w-full"
                      />
                    </div>
                    <div className="flex justify-center pl-2 pr-2 py-0 rounded-b md:rounded-r md:rounded-bl-none items-center bg-[#3d332d] w-full md:w-auto">
                      <Button className="min-w-[84px] w-full md:w-auto h-12 bg-[#e0c4b7] hover:bg-[#d4b5a6] text-[#1e1614] font-bold text-base transition-colors">
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start p-4 self-stretch w-full mb-[50px]">
            <div className="w-full h-[800px]">
              <div className="elfsight-app-0494fcef-0f65-4d6a-aea0-36e32e465344" data-elfsight-app-lazy></div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );

  const AboutPage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-start w-full translate-y-[-1rem] animate-fade-in opacity-0">
          </div>

          <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10 mr-auto px-4">
            About Us
          </h1>

          <div className="flex flex-col items-start self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0">
            <div className="flex flex-col items-start p-4 self-stretch w-full">
              <div className="w-full h-64 md:h-[332px] rounded overflow-hidden relative">
                <img
                  src="/images/about-background.png"
                  alt="About Nowak's Steakhouse"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="928"
                  height="332"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-[rgba(31,23,20,0.6)]"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <div className="flex flex-col items-start p-4 self-stretch w-full">
              <div className="flex flex-col items-start self-stretch w-full">
                <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-[23px] mb-4 text-left">
                  Nowak's Steakhouse
                </h1>
                <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-white text-[19px] tracking-[0] leading-6 w-full text-left">
                  "A neighborhood steakhouse with something for everyone!"
                  <br />
                  <br />
                  Freshest Fish & Seafoods, Pastas, Chicken, Burger, &
                  Sandwiches
                  <br />
                  <br />
                  Nowak's Steakhouse since 2018, opened by Blaiss Nowak, son
                  of famed Atlanta Restauranteur Hal Nowak of Hal's "The
                  Steakhouse". Blaiss, a 36 year resident of Sandy Springs opened Nowak's
                  Steakhouse as a place for friends and family to gather for
                  all occasions especially great food and even better service.
                  Blaiss created an atmosphere that blends great service,
                  food, and music in a sexy clubby setting.
                  <br />
                  <br />
                  <br />
                  <br />
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full items-start rounded translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <div className="w-full md:w-[519px] h-64 md:h-[437px] rounded overflow-hidden">
              <img
                src="/images/perfect-sear.png"
                alt="Perfect sear on steak - culinary excellence"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width="519"
                height="437"
              />
            </div>

            <div className="flex flex-col w-full md:w-[409px] items-start justify-center gap-1 p-4">
              <div className="flex flex-col items-start self-stretch w-full">
                <h2 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-xl md:text-2xl tracking-[0] leading-[23px]">
                  The Perfect Sear
                </h2>
              </div>

              <div className="flex w-full items-start justify-around gap-3">
                <div className="flex flex-col w-full items-start">
                  <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-[#ededed] text-base md:text-[19px] tracking-[0] leading-6">
                    <br />
                    Achieving the perfect sear is an art form. Our chefs employ
                    a combination of high heat and precise timing to create a
                    beautiful crust on each steak. This sear not only adds a
                    delightful textural contrast but also locks in the juices,
                    ensuring a succulent and flavorful experience with every
                    bite. It's the hallmark of a truly exceptional steak.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  const ContactPage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-start w-full translate-y-[-1rem] animate-fade-in opacity-0">
          </div>

          <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10 mr-auto px-4">
            Contact Us
          </h1>

          <div className="flex flex-col items-start p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <div className="[font-family:'Gentium_Book_Plus',Helvetica] font-bold text-white text-2xl tracking-[0] leading-8 mb-4">
              Call us at 404-980-3638
            </div>

            <div className="[font-family:'Gentium_Book_Plus',Helvetica] font-normal text-white text-lg tracking-[0] leading-6 mb-6">
              Nowak's Steakhouse<br />
              6690 Roswell Road<br />
              Sandy Springs, Georgia 30328
            </div>

            <p className="[font-family:'Noto_Serif',Helvetica] font-medium text-white text-base tracking-[0] leading-6">
              For any inquiries or messages, please fill out the form below.
              We will get back to you as soon as possible.
            </p>
          </div>

          <form className="flex flex-col gap-4 max-w-[480px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            {contactFormFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-wrap max-w-[480px] items-end gap-4 px-4 py-3"
              >
                <div className="flex flex-col min-w-40 items-start flex-1">
                  <Label className="[font-family:'Noto_Serif',Helvetica] font-medium text-white text-base tracking-[0] leading-6 mb-2">
                    {field.label}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      className="min-h-36 bg-[#2b2321] border-[#59473f] text-[#baa8a0] [font-family:'Noto_Serif',Helvetica] font-normal text-base"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <Input
                      className="h-14 bg-[#2b2321] border-[#59473f] text-[#baa8a0] [font-family:'Noto_Serif',Helvetica] font-normal text-base"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              </div>
            ))}

            <Button
              type="submit"
              className="min-w-[84px] max-w-[480px] h-10 bg-[#e0c4b7] hover:bg-[#d4b5a6] text-[#1e1614] font-bold text-sm transition-colors"
            >
              Submit
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );

  const PrivateDiningPage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-start w-full translate-y-[-1rem] animate-fade-in opacity-0">
          </div>

          <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10 mr-auto px-4">
            Private Dining
          </h1>

          <div className="flex flex-col items-start p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <div className="flex flex-col md:flex-row items-start self-stretch w-full rounded">
              <div className="w-full md:flex-1 h-64 rounded overflow-hidden">
                <img
                  src="/images/private-dining-background.png"
                  alt="Private dining room at Nowak's Steakhouse"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="480"
                  height="256"
                />
              </div>

              <div className="w-full md:min-w-72 md:flex-1 flex flex-col items-start justify-center gap-1 p-4">
                <h2 className="[font-family:'Noto_Serif',Helvetica] font-normal text-white text-lg md:text-xl tracking-[0] leading-[23px] mb-4 md:mb-5">
                  Your Special Event
                </h2>

                <div className="flex items-end justify-around gap-3 self-stretch w-full">
                  <div className="flex flex-col items-start flex-1">
                    <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-[#eaeaea] text-sm md:text-base tracking-[0] leading-6">
                      Our private dining room is sophisticated and sexy — the
                      perfect backdrop for any occasion.
                      <br />
                      <br />
                      With space for 12–48 guests, it's ideal for business
                      dinners, celebrations, and holiday parties. Expect
                      polished service, chef-driven menus, and a vibe that makes
                      every event unforgettable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-8" />

          <img
            className="w-full max-w-[944px] h-96 md:h-[629px] object-cover translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]"
            alt="Private Events at Nowak's"
            src="/images/private-events.png"
            loading="lazy"
            decoding="async"
            width="944"
            height="629"
          />
        </div>
      </main>

      <Footer />
    </div>
  );

  const MenuPage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-start w-full translate-y-[-1rem] animate-fade-in opacity-0">
          </div>

          <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10 mr-auto px-4">
            Menu
          </h1>

          <div className="flex flex-col items-start p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <div className="flex items-start self-stretch w-full rounded">
              <div className="flex flex-col min-w-72 items-start justify-center gap-1 p-4 flex-1">
                <div className="flex items-end justify-around gap-3 self-stretch w-full">
                  <div className="flex flex-col items-start flex-1">
                    <p className="[font-family:'Noto_Serif',Helvetica] font-normal text-[#baa8a0] text-base tracking-[0] leading-6">
                      Our menu features premium steaks, fresh seafood, and seasonal specialties crafted with the finest ingredients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="self-stretch w-full flex justify-center bg-white translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <iframe
              src="https://cdn.builder.io/o/assets%2F2edaa8d02eb843e397032edf5f1682f1%2F09400ffa91a34100bd26503b2d4baa0e?alt=media&token=f567720a-eafe-4075-96ca-8651f0ddcaa8&apiKey=2edaa8d02eb843e397032edf5f1682f1#toolbar=0&navpanes=0&scrollbar=0&view=FitV"
              className="w-full max-w-[960px] h-[800px] md:h-[1240px]"
              style={{ border: 'none' }}
              title="Nowak's Menu"
              scrolling="no"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  const ReservationsPage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0">
            <div className="flex flex-col w-72 items-start">
              <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10">
                Make a Reservation
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-[480px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <div className="p-4 text-center">
              <ResyButton className="inline-block px-6 py-3 bg-[#d4af37] text-black font-semibold rounded hover:bg-[#b8941f] transition-colors">
                Book your Nowak's Steakhouse reservation on Resy
              </ResyButton>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  const PrivacyPolicyPage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0">
            <div className="flex flex-col w-full items-start">
              <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10 mb-8">
                Privacy Policy
              </h1>
              
              <div className="[font-family:'Noto_Serif',Helvetica] font-normal text-white text-base tracking-[0] leading-6 space-y-6">
                <p className="text-[#baa8a0] text-sm">
                  Last updated: January 2025
                </p>

                <div>
                  <h2 className="font-bold text-xl mb-3">Information We Collect</h2>
                  <p>
                    At Nowak's Steakhouse, we collect information you provide directly to us, such as when you make a reservation, sign up for our newsletter, or contact us. This may include your name, email address, phone number, and dining preferences.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">How We Use Your Information</h2>
                  <p>
                    We use the information we collect to provide, maintain, and improve our services, including processing reservations, sending newsletters about special events and menu updates, and responding to your inquiries.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Contact Information</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:<br />
                    Nowak's Steakhouse<br />
                    6690 Roswell Road<br />
                    Sandy Springs, Georgia 30328<br />
                    Phone: 404-980-3638
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  const TermsOfServicePage = () => (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-40 py-5 flex items-start justify-center">
        <div className="w-full max-w-[960px] flex flex-col items-start">
          <div className="flex flex-wrap items-start justify-around gap-3 p-4 self-stretch w-full translate-y-[-1rem] animate-fade-in opacity-0">
            <div className="flex flex-col w-full items-start">
              <h1 className="[font-family:'Noto_Serif',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-10 mb-8">
                Terms of Service
              </h1>
              
              <div className="[font-family:'Noto_Serif',Helvetica] font-normal text-white text-base tracking-[0] leading-6 space-y-6">
                <p className="text-[#baa8a0] text-sm">
                  Last updated: January 2025
                </p>

                <div>
                  <h2 className="font-bold text-xl mb-3">Acceptance of Terms</h2>
                  <p>
                    By accessing and using Nowak's Steakhouse services, including making reservations and dining at our restaurant, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Reservation Policy</h2>
                  <p>
                    Reservations are subject to availability. We request at least 24 hours notice for cancellations. Large parties (8+ guests) may require a deposit and are subject to a cancellation fee if cancelled less than 48 hours in advance.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Dining Policies</h2>
                  <p>
                    We maintain a smart casual dress code. We reserve the right to refuse service to anyone. Gratuity may be automatically added to parties of 6 or more. We are not responsible for lost or stolen items.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Private Dining</h2>
                  <p>
                    Private dining reservations require a signed agreement and deposit. Cancellation policies for private events differ from regular dining reservations and will be outlined in your private dining contract.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Limitation of Liability</h2>
                  <p>
                    Nowak's Steakhouse shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our services or inability to use our services.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-xl mb-3">Contact Information</h2>
                  <p>
                    For questions regarding these Terms of Service, please contact us at:<br />
                    Nowak's Steakhouse<br />
                    6690 Roswell Road<br />
                    Sandy Springs, Georgia 30328<br />
                    Phone: 404-980-3638
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "private-dining":
        return <PrivateDiningPage />;
      case "menu":
        return <MenuPage />;
      case "reservations":
        return <ReservationsPage />;
      case "privacy-policy":
        return <PrivacyPolicyPage />;
      case "terms-of-service":
        return <TermsOfServicePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-white grid justify-items-center w-screen">
      {renderCurrentPage()}
    </div>
  );
};
