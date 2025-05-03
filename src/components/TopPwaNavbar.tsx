
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopPwaNavbarProps {
  title: string;
}

const TopPwaNavbar = ({ title = "Free Fire Arena" }: TopPwaNavbarProps) => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gaming-bg/90 border-b border-gaming-border backdrop-blur-lg pt-safe"
    >
      <div className="h-14 flex items-center justify-center px-4">
        <h1 className="text-lg font-bold text-gaming-primary text-glow">{title}</h1>
      </div>
    </motion.div>
  );
};

export default TopPwaNavbar;
