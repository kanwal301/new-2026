import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { cn } from '../lib/utils';

interface LMSCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  onClick: () => void;
  isSelected?: boolean;
  isDimmed?: boolean;
  isNew?: boolean;
  previewItems: string[];
  language: 'en' | 'ur';
}

export function LMSCard({ 
  title, 
  icon: Icon, 
  color, 
  desc, 
  onClick, 
  isSelected, 
  isDimmed,
  isNew,
  previewItems,
  language 
}: LMSCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative h-[380px] w-full rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500",
        "bg-white border border-slate-100 shadow-sm hover:shadow-2xl",
        isSelected && "ring-4 ring-offset-4 ring-brand-500 shadow-brand-500/20 z-10 scale-105",
        isDimmed && !isSelected && "opacity-40 grayscale-[0.5] scale-95 blur-[1px]"
      )}
    >
      {/* New Badge */}
      {isNew && (
        <div className="absolute top-6 right-6 z-20">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
          </div>
        </div>
      )}

      <div 
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
        className="h-full flex flex-col items-center text-center"
      >
        {/* Icon Container */}
        <div className={cn(
          "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform duration-500 group-hover:scale-110",
          color
        )}>
          <Icon className="w-10 h-10" />
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed px-4">
          {desc}
        </p>

        {/* Preview Snippet (Visible on Hover/Tilt) */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {previewItems.map((item, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-auto w-full">
          <div className={cn(
            "flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all duration-300",
            "bg-slate-900 text-white hover:bg-brand-500 group"
          )}>
            {language === 'en' ? 'Access Portal' : 'پورٹل تک رسائی'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none opacity-10">
        <div className={cn("absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl", color)} />
        <div className={cn("absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl", color)} />
      </div>
    </motion.div>
  );
}
