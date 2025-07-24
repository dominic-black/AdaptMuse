import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "../Button";
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
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const overlayClasses = `
    fixed top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center
    ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}
  `;

  const modalClasses = `
    bg-white p-5 rounded-lg max-w-[700px] w-[80%] max-h-[700px] h-[80%] shadow-lg
    ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}
  `;

  const modalContent = isOpen ? (
    <div
      className={overlayClasses}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={handleClose}
    >
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <p className="text-2xl">{label}</p>
          {showCloseButton && (
            <Button onClick={handleClose} variant="ghost" size="lg">
              <X />
            </Button>
          )}
        </div>
        <div className="h-full">{children}</div>
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
