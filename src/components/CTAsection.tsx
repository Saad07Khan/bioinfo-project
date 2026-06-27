import Image from "next/image";
import Link from "next/link";

const CTASection: React.FC = () => {
  return (
    <section 
      className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 mt-[120px] md:mt-[160px] lg:mt-[200px]"
    >
      {/* Container */}
      <div className="relative w-full max-w-[673px] md:max-w-[900px] lg:max-w-[1200px] xl:max-w-[1350px] mx-auto h-[290px] md:h-[400px] lg:h-[500px] xl:h-[580px]">
        
        {/* Background Image - cyan2_pic.png */}
        <div 
          className="absolute rounded-[11px] md:rounded-[15px] lg:rounded-[19px] overflow-hidden"
          style={{
            top: '6.5%',
            left: '2.8%',
            width: '94.5%',
            height: '87%'
          }}
        >
          <Image
            src="/cyan2_pic.webp"
            alt="DNA visualization background"
            fill
            className="object-cover"
          />
          
          {/* Glassmorphism Overlay Card - Centered */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[7px] md:rounded-[10px] lg:rounded-[12px] p-[15px] md:p-[20px] lg:p-[25px] xl:p-[30px] flex flex-col items-center justify-center gap-[15px] md:gap-[20px] lg:gap-[25px] xl:gap-[30px]"
            style={{
              width: '95.8%',
              height: '92.6%',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'inset 0.23px 0.23px 0.23px 0px rgba(255, 255, 255, 0.95), inset -0.47px -0.47px 0.47px 0px rgba(255, 255, 255, 0.65)'
            }}
          >
            {/* Heading Text */}
            <h2 
              className="text-center text-[20px] md:text-[32px] lg:text-[44px] xl:text-[52px] leading-[120%] max-w-[408px] md:max-w-[550px] lg:max-w-[700px] xl:max-w-[820px]"
              style={{ 
                fontFamily: 'Inter Display, sans-serif', 
                fontWeight: 500,
                color: '#2C2C2C'
              }}
            >
              Compare sequences
with proven algorithms
            </h2>
            
            {/* CTA Button */}
            <Link
              href="/algorithms1"
              className="rounded-[33px] px-[11px] md:px-[15px] lg:px-[18px] xl:px-[22px] py-[7px] md:py-[9px] lg:py-[11px] xl:py-[13px] text-black text-[11px] md:text-[14px] lg:text-[17px] xl:text-[20px] leading-[120%] transition-all duration-200 hover:opacity-80 active:scale-95 no-underline inline-block"
              style={{
                fontFamily: 'Inter Display, sans-serif',
                fontWeight: 500,
                background: '#FFFFFF'
              }}
            >
              Launch tool
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default CTASection;