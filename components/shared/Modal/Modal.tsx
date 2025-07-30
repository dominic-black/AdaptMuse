import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  label,
  showCloseButton = true,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const overlayClasses = `
    fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8
    bg-black/20 backdrop-blur-sm
    ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}
  `;

  const modalClasses = `
    bg-white rounded-lg shadow-lg flex flex-col
    w-full max-w-4xl max-h-[90vh] h-full
    ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}
  `;

  const modalContent = isOpen ? (
    <div className={overlayClasses} onClick={handleClose}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-shrink-0 justify-between items-center p-4 sm:p-5 border-gray-200 border-b">
          <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">
            {label}
          </h2>
          {showCloseButton && (
            <Button
              onClick={handleClose}
              variant="ghost"
              className="p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="flex-grow overflow-y-auto">{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      return ReactDOM.createPortal(modalContent, modalRoot);
    }
  }

  return null;
};

export default Modal;
