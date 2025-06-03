import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <header
      className="sticky lg:fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 lg:px-0 py-5 border-b bg-white/70 backdrop-blur-md"
    >
      <div className="max-w-screen-lg mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-0">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <span className="font-bold text-4xl text-title-logo">pixelan</span>
        </motion.div>

        {/* Tombol */}
        <motion.button
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-3 text-sm md:text-base"
        >
          <span className="inline">Let's Talk</span>
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
