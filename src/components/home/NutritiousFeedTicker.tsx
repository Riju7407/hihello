"use client";

import React from "react";

// Handcrafted SVG illustrations matching the exact icons from holstein.in screenshot
function WheatStalkIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path
        d="M26 60C26 44 28 32 32 12"
        stroke="#4A7C59"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Side leaf */}
      <path
        d="M27 46C29 40 36 38 42 39C38 45 32 47 27 46Z"
        fill="#589B50"
        stroke="#2D210E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Grains */}
      <ellipse
        cx="32"
        cy="12"
        rx="4"
        ry="6"
        transform="rotate(-15 32 12)"
        fill="#E5B36A"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="27"
        cy="18"
        rx="4"
        ry="6"
        transform="rotate(-35 27 18)"
        fill="#D9A05B"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="37"
        cy="19"
        rx="4"
        ry="6"
        transform="rotate(35 37 19)"
        fill="#E5B36A"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="28"
        cy="26"
        rx="4"
        ry="6.2"
        transform="rotate(-30 28 26)"
        fill="#C88A3E"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="38"
        cy="27"
        rx="4"
        ry="6.2"
        transform="rotate(30 38 27)"
        fill="#D9A05B"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="29"
        cy="34"
        rx="4"
        ry="6"
        transform="rotate(-25 29 34)"
        fill="#C88A3E"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="37"
        cy="35"
        rx="4"
        ry="6"
        transform="rotate(25 37 35)"
        fill="#D9A05B"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      {/* Awn bristles */}
      <path d="M31 7L30 3" stroke="#2D210E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 7L35 3" stroke="#2D210E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 15L20 12" stroke="#2D210E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 16L44 13" stroke="#2D210E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MolassesJarIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Jar lid / neck - clean white cap with dark border matching screenshot */}
      <rect
        x="21"
        y="12"
        width="22"
        height="7"
        rx="2"
        fill="#FFFFFF"
        stroke="#1E1A16"
        strokeWidth="2"
      />
      <line x1="19" y1="19" x2="45" y2="19" stroke="#1E1A16" strokeWidth="2" strokeLinecap="round" />
      
      {/* Jar body */}
      <path
        d="M17 24C17 20 20 19 23 19H41C44 19 47 20 47 24V50C47 54 44 56 40 56H24C20 56 17 54 17 50V24Z"
        fill="#FFFFFF"
        stroke="#1E1A16"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Dark Molasses liquid fill */}
      <path
        d="M19 27C19 24.5 21 23.5 24 23.5H40C43 23.5 45 24.5 45 27V49.5C45 52.5 42.5 54 39 54H25C21.5 54 19 52.5 19 49.5V27Z"
        fill="#4A1319"
      />
      {/* Molasses inner gradient wave */}
      <path
        d="M19 32C22 30 26 33 32 31C38 29 42 32 45 30V49.5C45 52.5 42.5 54 39 54H25C21.5 54 19 52.5 19 49.5V32Z"
        fill="#380E13"
      />

      {/* Glass shine / reflection on left */}
      <path
        d="M21 28V48"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.65"
      />
      <circle cx="21" cy="25" r="1" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  );
}

function MustardPlantIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central green stem */}
      <path
        d="M32 58C32 44 33 28 32 14"
        stroke="#4A7C59"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Side branches */}
      <path d="M32 44C36 40 40 41 44 42" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 36C27 32 24 33 20 34" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 26C37 22 41 23 44 24" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 20C28 17 25 18 22 19" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" />

      {/* Little green pods / leaves */}
      <ellipse cx="26" cy="46" rx="3.5" ry="1.5" transform="rotate(-20 26 46)" fill="#589B50" />
      <ellipse cx="38" cy="50" rx="3.5" ry="1.5" transform="rotate(20 38 50)" fill="#589B50" />

      {/* Yellow blossoms (4 petals each) */}
      {/* Top flower */}
      <g transform="translate(32, 14)">
        <circle cx="-3" cy="-3" r="2.6" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="3" cy="-3" r="2.6" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="-3" cy="3" r="2.6" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="3" cy="3" r="2.6" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="0" cy="0" r="1.5" fill="#D4AC0D" />
      </g>

      {/* Left upper flower */}
      <g transform="translate(20, 20)">
        <circle cx="-2.5" cy="-2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.5" cy="-2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="-2.5" cy="2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.5" cy="2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="0" cy="0" r="1.3" fill="#D4AC0D" />
      </g>

      {/* Right upper flower */}
      <g transform="translate(44, 24)">
        <circle cx="-2.5" cy="-2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.5" cy="-2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="-2.5" cy="2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.5" cy="2.5" r="2.4" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="0" cy="0" r="1.3" fill="#D4AC0D" />
      </g>

      {/* Left lower flower */}
      <g transform="translate(19, 34)">
        <circle cx="-2.4" cy="-2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.4" cy="-2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="-2.4" cy="2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.4" cy="2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="0" cy="0" r="1.2" fill="#D4AC0D" />
      </g>

      {/* Right lower flower */}
      <g transform="translate(44, 42)">
        <circle cx="-2.4" cy="-2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.4" cy="-2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="-2.4" cy="2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="2.4" cy="2.4" r="2.3" fill="#F4D03F" stroke="#2D210E" strokeWidth="1" />
        <circle cx="0" cy="0" r="1.2" fill="#D4AC0D" />
      </g>
    </svg>
  );
}

function SoybeanPodIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Curved bean pod outer shell */}
      <path
        d="M14 34C18 30 24 30 30 32C36 34 42 33 48 26C52 21 54 18 54 18C54 18 52 25 48 33C43 42 34 50 24 51C16 52 13 46 14 41C15 38 14 35 14 34Z"
        fill="#3F7E44"
        stroke="#1E4620"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Pod inner opening */}
      <path
        d="M17 38C22 36 29 37 35 39C41 41 46 39 49 32C45 39 38 46 29 47C22 48 18 44 17 38Z"
        fill="#2A5C2E"
      />

      {/* Individual rounded soybean seeds nested inside */}
      <circle
        cx="22"
        cy="40"
        r="4.2"
        fill="#8FD37B"
        stroke="#1E4620"
        strokeWidth="1.8"
      />
      <circle
        cx="31"
        cy="40"
        r="4.5"
        fill="#8FD37B"
        stroke="#1E4620"
        strokeWidth="1.8"
      />
      <circle
        cx="40"
        cy="37"
        r="4.2"
        fill="#8FD37B"
        stroke="#1E4620"
        strokeWidth="1.8"
      />

      {/* Little stalk & leaf tip at top */}
      <path
        d="M54 18C57 14 60 13 62 13"
        stroke="#1E4620"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunflowerIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green stem */}
      <path d="M32 46V60" stroke="#3F7E44" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M32 54C28 50 24 51 22 53C24 56 28 56 32 54Z"
        fill="#589B50"
        stroke="#2D210E"
        strokeWidth="1.2"
      />
      <path
        d="M32 51C36 47 40 48 42 50C40 53 36 53 32 51Z"
        fill="#589B50"
        stroke="#2D210E"
        strokeWidth="1.2"
      />

      {/* 12 Sunflower Petals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <path
          key={deg}
          d="M32 30C30 22 34 16 32 13C30 16 34 22 32 30Z"
          fill="#F5B041"
          stroke="#2D210E"
          strokeWidth="1.3"
          strokeLinejoin="round"
          transform={`rotate(${deg} 32 30)`}
        />
      ))}

      {/* Central Seed Core */}
      <circle
        cx="32"
        cy="30"
        r="8.5"
        fill="#6E2C00"
        stroke="#2D210E"
        strokeWidth="2"
      />
      {/* Seed pattern dots */}
      <circle cx="30" cy="28" r="1.2" fill="#D35400" />
      <circle cx="34" cy="28" r="1.2" fill="#D35400" />
      <circle cx="32" cy="32" r="1.2" fill="#D35400" />
      <circle cx="28" cy="31" r="1" fill="#D35400" />
      <circle cx="36" cy="31" r="1" fill="#D35400" />
    </svg>
  );
}

function CornCobIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Corn kernels body */}
      <path
        d="M26 44C24 36 25 24 32 13C39 24 40 36 38 44C36 49 28 49 26 44Z"
        fill="#F4D03F"
        stroke="#2D210E"
        strokeWidth="2"
      />
      {/* Kernel grid lines */}
      <path d="M27 25H37" stroke="#B7950B" strokeWidth="1.5" />
      <path d="M26 31H38" stroke="#B7950B" strokeWidth="1.5" />
      <path d="M26 37H38" stroke="#B7950B" strokeWidth="1.5" />
      <path d="M27 43H37" stroke="#B7950B" strokeWidth="1.5" />
      <path d="M32 15V46" stroke="#B7950B" strokeWidth="1.5" />

      {/* Green husk leaves wrapping around */}
      <path
        d="M20 48C21 38 25 32 28 29C26 35 25 43 28 50C25 51 22 50 20 48Z"
        fill="#589B50"
        stroke="#2D210E"
        strokeWidth="1.6"
      />
      <path
        d="M44 48C43 38 39 32 36 29C38 35 39 43 36 50C39 51 42 50 44 48Z"
        fill="#589B50"
        stroke="#2D210E"
        strokeWidth="1.6"
      />
      {/* Stem */}
      <path d="M32 48V58" stroke="#3F7E44" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CottonSeedIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-14 h-14 sm:w-16 sm:h-16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem and dry calyx bracts */}
      <path d="M32 46V58" stroke="#4A7C59" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M22 45C26 40 31 42 32 46C33 42 38 40 42 45C39 49 35 50 32 48C29 50 25 49 22 45Z"
        fill="#8D6E63"
        stroke="#2D210E"
        strokeWidth="1.8"
      />
      {/* Fluffy white cotton lobes */}
      <circle cx="26" cy="32" r="7.5" fill="#FFFFFF" stroke="#2D210E" strokeWidth="1.8" />
      <circle cx="38" cy="32" r="7.5" fill="#FFFFFF" stroke="#2D210E" strokeWidth="1.8" />
      <circle cx="32" cy="23" r="8" fill="#FFFFFF" stroke="#2D210E" strokeWidth="1.8" />
      <circle cx="32" cy="33" r="6" fill="#F8F9FA" />
      {/* Center seed tuft */}
      <ellipse cx="32" cy="33" rx="2" ry="2.5" fill="#A1887F" />
    </svg>
  );
}

const ICONS = [
  { id: "wheat", name: "Wheat & Barley Stalk", component: WheatStalkIcon },
  { id: "molasses", name: "Molasses Jar", component: MolassesJarIcon },
  { id: "mustard", name: "Mustard & Canola", component: MustardPlantIcon },
  { id: "soybean", name: "Soybean & Pea Pod", component: SoybeanPodIcon },
  { id: "sunflower", name: "Sunflower Seed", component: SunflowerIcon },
  { id: "corn", name: "Maize & Corn Cob", component: CornCobIcon },
  { id: "cottonseed", name: "Cottonseed & Boll", component: CottonSeedIcon },
];

export default function NutritiousFeedTicker() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-b border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title with Left & Right Gold Accent Lines exactly matching holstein.in */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 md:space-x-12 mb-10 sm:mb-14">
          <div className="h-[1.5px] w-12 sm:w-20 md:w-32 bg-brand-gold shrink-0" />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
            Nutritious Feed - Healthy Cattle
          </h2>
          <div className="h-[1.5px] w-12 sm:w-20 md:w-32 bg-brand-gold shrink-0" />
        </div>
      </div>

      {/* Left to Right Infinite Moving Carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        {/* Carousel track moving LEFT TO RIGHT */}
        <div className="flex animate-marquee-right hover:[animation-play-state:paused] w-max py-4 items-center">
          {/* Multiple sets for flawless, seamless infinite looping */}
          {[...ICONS, ...ICONS, ...ICONS, ...ICONS].map((item, idx) => {
            const Icon = item.component;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="mx-8 sm:mx-14 md:mx-20 flex flex-col items-center justify-center transition-transform hover:scale-115 duration-300 cursor-pointer"
                title={item.name}
              >
                <div className="filter drop-shadow-xs">
                  <Icon />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
