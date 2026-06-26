import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  FileText, 
  ShieldAlert, 
  MapPin, 
  Radio, 
  Award, 
  Settings, 
  Check 
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  angle: number; // default angle in degrees
  color: string;
}

export default function OrbitalAnimation() {
  const [activeId, setActiveId] = useState<string>("triage");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [rotationOffset, setRotationOffset] = useState<number>(0);
  const [revolvingAngle, setRevolvingAngle] = useState<number>(0);

  const nodes: NodeData[] = [
    { id: "triage", name: "Symptom Triage", icon: Activity, angle: -90, color: "#1E88E5" }, // Top
    { id: "schemes", name: "Government Schemes", icon: Award, angle: -30, color: "#FB8C00" }, // Top Right
    { id: "records", name: "Record Saver", icon: FileText, angle: 30, color: "#4CAF50" }, // Bottom Right
    { id: "finder", name: "Hospital Finder", icon: MapPin, angle: 90, color: "#00ACC1" }, // Bottom
    { id: "shield", name: "Rumor Shield", icon: ShieldAlert, angle: 150, color: "#E53935" }, // Bottom Left
    { id: "radar", name: "Outbreak Radar", icon: Radio, angle: 210, color: "#8E24AA" }, // Top Left
  ];

  // Auto-rotate active node every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveId((current) => {
        const index = nodes.findIndex((n) => n.id === current);
        const nextIndex = (index + 1) % nodes.length;
        return nodes[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Slowly rotate the orbit lines in background
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationOffset((prev) => (prev + 0.1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Smoothly revolve the satellite nodes around the center
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateRotation = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Elegant, slow speed: ~60 seconds per full revolution (6 degrees per second)
      // Slows down significantly on hover to make clicking incredibly easy and satisfying
      const speedMultiplier = isHovered ? 0.12 : 1.0;
      const degreesPerMs = 0.006 * speedMultiplier;

      setRevolvingAngle((prev) => (prev + deltaTime * degreesPerMs) % 360);
      animationFrameId = requestAnimationFrame(updateRotation);
    };

    animationFrameId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const activeNode = nodes.find((n) => n.id === activeId) || nodes[0];

  // Calculate coordinates on a circle of radius R
  const radius = 130; // Radius of orbit in px

  return (
    <div 
      className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Backdrops */}
      <div className="absolute inset-0 bg-radial-at-c from-blue-50/40 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>
      
      {/* Dotted Concentric Orbit Lines */}
      <div 
        className="absolute border border-dashed border-slate-200/80 rounded-full pointer-events-none"
        style={{ 
          width: `${radius * 2}px`, 
          height: `${radius * 2}px`,
          transform: `rotate(${rotationOffset}deg)`
        }}
      ></div>
      <div 
        className="absolute border border-dashed border-slate-100 rounded-full pointer-events-none"
        style={{ 
          width: `${radius * 2 * 0.7}px`, 
          height: `${radius * 2 * 0.7}px`,
          transform: `rotate(${-rotationOffset * 1.5}deg)`
        }}
      ></div>
      <div 
        className="absolute border border-dotted border-slate-200/40 rounded-full pointer-events-none"
        style={{ 
          width: `${radius * 2 * 1.25}px`, 
          height: `${radius * 2 * 1.25}px`,
          transform: `rotate(${rotationOffset * 0.5}deg)`
        }}
      ></div>

      {/* CENTRAL CORE: AI Processor */}
      <div className="absolute z-10 flex items-center justify-center">
        {/* Pulsing outer ring */}
        <motion.div 
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.15, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-28 h-28 rounded-full bg-blue-500/10 border border-blue-200"
        />
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute w-36 h-36 rounded-full bg-blue-500/5"
        />

        {/* Core button circle */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#1565C0] shadow-xl shadow-blue-500/30 flex items-center justify-center border border-white/20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="text-white"
          >
            <Settings className="w-7 h-7" />
          </motion.div>
        </div>
      </div>

      {/* ACTIVE CONNECTIONS - Dashed laser lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E88E5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#81D4FA" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Draw lines to all nodes (faint) */}
        {nodes.map((node) => {
          const angleWithRotation = node.angle + revolvingAngle;
          const radAngle = (angleWithRotation * Math.PI) / 180;
          const x2 = 240 + radius * Math.cos(radAngle);
          const y2 = 240 + radius * Math.sin(radAngle);
          const isActive = node.id === activeId;
          
          return (
            <g key={`line-${node.id}`}>
              <line
                x1="240"
                y1="240"
                x2={x2}
                y2={y2}
                stroke={isActive ? "url(#lineGrad)" : "#E2E8F0"}
                strokeWidth={isActive ? "2.5" : "1"}
                strokeDasharray={isActive ? "6, 4" : "4, 4"}
                className={isActive ? "animate-[dash_10s_linear_infinite]" : ""}
                style={{
                  transition: "stroke 0.4s, stroke-width 0.4s",
                }}
              />
              {isActive && (
                <motion.line
                  x1="240"
                  y1="240"
                  x2={x2}
                  y2={y2}
                  stroke="#4CAF50"
                  strokeWidth="2.5"
                  strokeDasharray="8, 20"
                  animate={{ strokeDashOffset: [-100, 100] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* SATELLITE NODES */}
      {nodes.map((node) => {
        const angleWithRotation = node.angle + revolvingAngle;
        const radAngle = (angleWithRotation * Math.PI) / 180;
        const x = radius * Math.cos(radAngle);
        const y = radius * Math.sin(radAngle);
        const isActive = node.id === activeId;
        const NodeIcon = node.icon;

        return (
          <div
            key={node.id}
            className="absolute z-20 cursor-pointer"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onClick={() => setActiveId(node.id)}
          >
            {/* Tooltip Badge */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: -42, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase border border-slate-800 shadow-xl flex items-center gap-1.5 z-30"
                >
                  <span>{node.name}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Node Circle */}
            <motion.div
              animate={{ 
                scale: isActive ? 1.2 : 1,
                boxShadow: isActive 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(30, 136, 229, 0.2)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
              }}
              className={`w-12 h-12 rounded-full bg-white border ${
                isActive ? "border-[#1E88E5]" : "border-slate-100"
              } flex items-center justify-center transition-colors duration-300 relative group hover:border-blue-400`}
            >
              {/* Checkmark Indicator */}
              {isActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1E88E5] border border-white flex items-center justify-center text-white"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </motion.div>
              )}

              {/* Icon inside */}
              <NodeIcon 
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? "text-[#1E88E5]" : "text-slate-400 group-hover:text-[#1E88E5]"
                }`} 
              />
            </motion.div>
          </div>
        );
      })}

    </div>
  );
}
