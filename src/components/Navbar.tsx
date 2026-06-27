'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const navLinks = [
    { href: '/', label: 'About' },
    { href: '/algorithms1', label: 'Algorithms' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <>
      <nav className="w-full bg-white">
        <div className="max-w-[599px] mx-auto px-4 py-3 md:py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-start relative no-underline transition-transform duration-150 active:translate-y-px">
            <div className="relative">
              <h1 
                className="font-bold text-lg md:text-xl lg:text-2xl text-black m-0"
                style={{ fontFamily: 'var(--font-prompt)' }}
              >
                GENOMIX
              </h1>
              <Image
                src="/Vector.svg"
                alt=""
                width={3}
                height={3}
                className="absolute -top-0.5 -right-2.5 md:w-[4px] md:h-[4px]"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-sm lg:text-base text-black py-2 px-3 hover:bg-gray-100 rounded transition-all no-underline active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.12)]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 -mr-2 transition-transform duration-150 active:translate-y-px active:opacity-80"
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* Close Button */}
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="ml-auto block p-2 -mr-2 -mt-2 transition-transform duration-150 active:translate-y-px active:opacity-80"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Drawer Links */}
          <nav className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className="font-medium text-base text-black py-3 px-4 hover:bg-gray-100 rounded transition-all no-underline active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.12)]"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
