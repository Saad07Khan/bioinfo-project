import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  const navLinks = [
    { name: "About", href: "/" },
    { name: "Algorithms", href: "/algorithms1" },
    { name: "Contact Us", href: "/contact" }
  ];

  return (
    <footer className="w-full bg-white mt-[80px] md:mt-[120px] lg:mt-[160px] pb-[30px] md:pb-[40px] lg:pb-[50px]">
      {/* Upper Footer Section */}
      <div className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 pt-[18px] md:pt-[24px] lg:pt-[30px] pb-[25px] md:pb-[35px] lg:pb-[45px]">
        <div className="flex flex-col items-center gap-[11px] md:gap-[15px] lg:gap-[18px]">
          
          {/* Logo Section - Matching navbar exactly */}
          <div className="relative">
            <h2 
              className="text-[18px] md:text-[22px] lg:text-[26px] leading-[120%] font-bold text-black m-0"
              style={{ 
                fontFamily: 'var(--font-prompt)'
              }}
            >
              GENOMIX
            </h2>
            <Image
              src="/Vector.svg"
              alt=""
              width={3}
              height={3}
              className="absolute -top-0.5 -right-2.5 md:w-[4px] md:h-[4px]"
            />
          </div>

          {/* Navigation Links - Increased gap */}
          <nav className="flex items-center gap-[14px] md:gap-[20px] lg:gap-[28px]">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[14px] md:text-[16px] lg:text-[18px] leading-[120%] text-gray-700 hover:opacity-70 transition-all active:translate-y-px"
                style={{ 
                  fontFamily: 'var(--font-poppins)', 
                  fontWeight: 500 
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

        </div>
      </div>

      {/* Bottom Footer Section - border inside max-width container */}
      <div className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8">
        <div 
          className="w-full flex items-center justify-between pt-[18px] md:pt-[22px] lg:pt-[26px] pb-[11px] md:pb-[14px] lg:pb-[16px] border-t"
          style={{ borderColor: '#D9D9D9', borderTopWidth: '0.5px' }}
        >
          {/* Copyright Text */}
          <p 
            className="text-black text-[7px] md:text-[9px] lg:text-[11px] leading-[150%]"
            style={{ 
              fontFamily: 'var(--font-poppins)', 
              fontWeight: 500 
            }}
          >
            ©2025 GENOMIX. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-[14px] md:gap-[18px] lg:gap-[21px]">
            <Link
              href="#terms"
              className="text-black text-[7px] md:text-[9px] lg:text-[11px] leading-[120%] hover:opacity-70 transition-all whitespace-nowrap active:translate-y-px"
              style={{ 
                fontFamily: 'var(--font-poppins)', 
                fontWeight: 500 
              }}
            >
              Terms and Conditions
            </Link>
            <Link
              href="#privacy"
              className="text-black text-[7px] md:text-[9px] lg:text-[11px] leading-[120%] hover:opacity-70 transition-all whitespace-nowrap active:translate-y-px"
              style={{ 
                fontFamily: 'var(--font-poppins)', 
                fontWeight: 500 
              }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
