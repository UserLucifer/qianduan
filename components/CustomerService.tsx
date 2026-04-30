"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export function CustomerService() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Do not show customer service on admin pages or before mounted
  if (!mounted || pathname?.startsWith('/admins')) {
    return null;
  }
  
  return (
    <Script
      src="https://plugin-code.salesmartly.com/js/project_692700_714414_1777010586.js"
      strategy="lazyOnload"
    />
  );
}
