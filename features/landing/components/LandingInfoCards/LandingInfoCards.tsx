import { motion } from "framer-motion";
import { FEATURES } from "./Features";

export const LandingInfoCards = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <section
      id="features"
      className="z-10 relative bg-[var(--color-background)]/80 backdrop-blur-sm py-12 sm:py-16 lg:py-20 xl:py-28"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={isMobile ? {} : { opacity: 0, y: 32 }}
          whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
          viewport={isMobile ? {} : { once: true, amount: 0.3 }}
          transition={isMobile ? {} : { duration: 0.7 }}
          className="text-center"
        >
          <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-2 sm:mb-3 font-semibold text-transparent text-sm sm:text-base uppercase tracking-widest">
            A Complete AI Audience Platform
          </h2>
          <p className="mb-3 sm:mb-5 font-bold text-[var(--color-text)] text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            Insight. Creation. Results.
          </p>
          <p className="opacity-80 mx-auto max-w-2xl text-[var(--color-text)] text-base sm:text-lg leading-relaxed">
            AdaptMuse integrates cutting-edge AI with Qloo&apos;s unparallele
            cultural insights, enabling unprecedented audience engagement
            without compromising privacy.
          </p>
        </motion.div>

        <div className="gap-4 sm:gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-12 lg:mt-16">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={isMobile ? {} : { opacity: 0, y: 32 }}
              whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
              viewport={isMobile ? {} : { once: true, amount: 0.3 }}
              transition={isMobile ? {} : { duration: 0.7, delay: idx * 0.12 }}
              className="flex flex-col items-center bg-white shadow-lg p-5 sm:p-6 lg:p-7 border border-[var(--color-background-secondary-cell)] rounded-xl sm:rounded-2xl text-center lg:hover:scale-[1.03] transition-transform duration-300"
            >
              <span className="flex justify-center items-center bg-gradient-to-tr from-purple-400 to-indigo-400 mb-3 sm:mb-4 rounded-lg w-10 sm:w-12 h-10 sm:h-12">
                {feature.icon}
              </span>
              <h3 className="mb-2 font-semibold text-[var(--color-text)] text-base sm:text-lg">
                {feature.title}
              </h3>
              <p className="opacity-80 text-[var(--color-text)] text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
