"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Optional, use Lucide or your preferred icon library

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", escHandler);
    }
    return () => {
      window.removeEventListener("keydown", escHandler);
    };
  }, [isOpen, escHandler]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-xl p-6"
          >
            {/* Close Button Top Right */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 transition"
            >
              <X className="w-5 h-5" />
              {/* Or use plain text: × */}
            </button>

            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
