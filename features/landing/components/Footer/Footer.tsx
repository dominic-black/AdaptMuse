export const Footer = () => {
  return (
    <footer className="bg-[var(--color-background)]/80 backdrop-blur-sm py-6 sm:py-8 border-[var(--color-background-secondary)]/50 border-t">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <p className="opacity-60 text-[var(--color-text)] text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} AdaptMuse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
