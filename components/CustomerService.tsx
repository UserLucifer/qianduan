"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export function CustomerService() {
  const pathname = usePathname();
  
  // Do not show customer service on admin pages
  if (pathname?.startsWith('/admins')) {
    return null;
  }
  
  return (
    <Script
      src="https://plugin-code.salesmartly.com/js/project_692700_714414_1777010586.js"
      strategy="lazyOnload"
    />
  );
}
