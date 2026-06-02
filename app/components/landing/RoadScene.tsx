import { motion } from "framer-motion";

export function RoadScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ciel crépusculaire - couche statique */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            var(--color-sky-top) 0%,
            #2a1a2a 30%,
            var(--color-sky-bottom) 60%,
            #3d2520 100%
          )`,
        }}
      />

      {/* Étoiles lointaines */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-text-primary rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 40}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.4,
            }}
          />
        ))}
      </div>

      {/* Soleil couchant / Lune */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: "radial-gradient(circle, #ff6b35 0%, #ff6b3500 70%)",
          left: "75%",
          top: "20%",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Silhouettes arrière-plan - scroll lent */}
      <motion.div
        className="absolute bottom-[35%] left-0 right-0 h-32"
        initial={{ x: 0 }}
        animate={{ x: [0, -100, 0] }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="flex gap-40 h-full items-end">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-bg-darker"
              style={{
                width: `${40 + (i * 17) % 60}px`,
                height: `${40 + (i * 29) % 80}px`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Montagnes/collines au loin */}
      <div
        className="absolute bottom-[30%] left-0 right-0 h-20"
        style={{
          background: "linear-gradient(to top, var(--color-bg-darker), transparent)",
        }}
      />

      {/* LA ROUTE */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]">
        {/* Bord de route */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              var(--color-road-dark) 0%,
              var(--color-road) 10%,
              var(--color-road) 100%
            )`,
          }}
        />

        {/* Lignes de perspective */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Ligne centrale */}
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="var(--color-road-line)"
            strokeWidth="4"
            strokeDasharray="20 30"
            opacity="0.8"
          />
          {/* Lignes de bord */}
          <line
            x1="0"
            y1="100%"
            x2="35%"
            y2="0"
            stroke="var(--color-road-line)"
            strokeWidth="3"
            opacity="0.6"
          />
          <line
            x1="100%"
            y1="100%"
            x2="65%"
            y2="0"
            stroke="var(--color-road-line)"
            strokeWidth="3"
            opacity="0.6"
          />
        </svg>

        {/* Lignes qui défilent (animation de vitesse) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 bg-road-line opacity-40"
              style={{
                left: `${20 + i * 12}%`,
                width: "4px",
              }}
              initial={{ top: "-10%", scaleY: 0.5 }}
              animate={{
                top: ["0%", "110%"],
                scaleY: [0.5, 2],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "linear",
              }}
            />
          ))}
        </div>

      </div>

      {/* Speed lines en premier plan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"
            style={{
              width: `${100 + (i * 47) % 200}px`,
              left: `${(i * 31) % 100}%`,
              transformOrigin: "center",
              transform: "rotate(-10deg)",
            }}
            initial={{ top: "-5%", opacity: 0 }}
            animate={{
              top: ["0%", "105%"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 0.8 + (i % 4) * 0.1,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 40%,
            var(--color-bg-darker) 100%
          )`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}
