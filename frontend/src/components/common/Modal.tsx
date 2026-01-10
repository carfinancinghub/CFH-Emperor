/**
 * @file Modal.tsx
 * @path C:\CFH\frontend\src\components\common\Modal.tsx
 *
 * PURPOSE
 * Minimal shared modal component to satisfy imports like:
 *   import Modal from "@/components/common/Modal";
 *
 * NOTES
 * - Tailwind-first, no external deps.
 * - Safe defaults; can be upgraded later to match CFH design system.
 */

/* =========================
   Imports
========================= */
import React, { useEffect } from "react";

/* =========================
   Types
========================= */
export type ModalProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

/* =========================
   Component
========================= */
const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children, className }) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full max-w-2xl rounded-2xl bg-white shadow-xl ${className ?? ""}`}>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">{title ?? ""}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
