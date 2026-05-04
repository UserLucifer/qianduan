'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiArrowRight, FiInfo, FiGlobe, FiBriefcase, FiFileText, FiActivity } from 'react-icons/fi';
import './ProductMegaMenu.css';

const companyItems = [
  { name: '关于我们', href: '/about' },
  { name: '可持续发展', href: '/sustainability' },
  { name: '企业解决方案', href: '/enterprise' }
];

export default function CompanyMegaMenu() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="mega-menu"
    >
      <div className="mega-menu__inner" style={{ gridTemplateColumns: '1fr', minWidth: '320px', width: 'fit-content', minHeight: 'auto' }}>
        <main className="mega-menu__main" style={{ padding: '24px' }}>
          <div className="mega-menu__grid" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {companyItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href} 
                className="mega-menu__category-btn"
                style={{ padding: '10px 16px', borderRadius: '8px' }}
              >
                <span className="mega-menu__category-name">{item.name}</span>
                <FiChevronRight className="mega-menu__chevron" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
