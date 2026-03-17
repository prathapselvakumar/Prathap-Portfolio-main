"use client"

import React from "react"
import { cn } from "@/lib/utils"

const PlusCard: React.FC<{
  className?: string
  title: string
  description: string
  Icon?: any
}> = ({
  className = "",
  title,
  description,
  Icon,
}) => {
  return (
    <div
      className={cn(
        "relative border border-dashed border-zinc-400 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-950 min-h-[200px]",
        "flex flex-col justify-between",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10 space-y-2">
        {Icon && (
          <div className="mb-3">
             <Icon className="w-7 h-7 text-primary" />
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute -top-3 -left-3" />
    <PlusIcon className="absolute -top-3 -right-3" />
    <PlusIcon className="absolute -bottom-3 -left-3" />
    <PlusIcon className="absolute -bottom-3 -right-3" />
  </>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    strokeWidth="1"
    stroke="currentColor"
    className={`dark:text-white text-black size-6 ${className}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

interface RuixenBentoCardsProps {
  title?: string;
  subtitle?: string;
  features?: any[];
  iconMap?: Record<string, any>;
}

export default function RuixenBentoCards({
  title,
  subtitle,
  features = [],
  iconMap = {},
}: RuixenBentoCardsProps) {
  return (
    <div className="w-full">
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-6">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon];
          const spanClass =
            index === 0
              ? "lg:col-span-3 lg:row-span-2"
              : index === 1
              ? "lg:col-span-3 lg:row-span-2"
              : index === 2
              ? "lg:col-span-4 lg:row-span-1"
              : "lg:col-span-2 lg:row-span-1";

          return (
            <PlusCard
              key={index}
              className={spanClass}
              Icon={Icon}
              title={feature.title}
              description={feature.desc}
            />
          );
        })}
      </div>

      {/* Section Footer Heading - Only show if title/subtitle provided */}
      {(title || subtitle) && (
        <div className="max-w-2xl ml-auto text-right px-4 mt-6 lg:-mt-20">
          {title && (
            <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
