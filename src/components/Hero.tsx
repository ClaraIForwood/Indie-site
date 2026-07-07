"use client";

import { useState } from "react";
import { DM_Serif_Display, Montserrat } from "next/font/google";
import Popup from "./Popup";
import styles from "./Hero.module.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100"],
  display: "swap",
});

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className={styles.section} aria-label="Portfolio hero — Clara Forwood">

      {/* Layer 1 · PORTFOLIO — behind the photo */}
      <p className={`${styles.portfolioText} ${dmSerif.className}`} aria-hidden="true">
        PORTFOLIO
      </p>

      {/* Layer 2 · cutout photo — dead centre, sticker outline */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.cutoutImg}
        src="/cutout.png"
        alt="Clara Forwood"
        loading="eager"
        draggable={false}
      />

      {/* Layer 3 · CLARA upper-left, FORWOOD lower-right */}
      <span className={`${styles.nameWord} ${styles.nameFirst} ${montserrat.className}`}>
        CLARA
      </span>
      <span className={`${styles.nameWord} ${styles.nameLast} ${montserrat.className}`}>
        FORWOOD
      </span>

      {/* Layer 4 · discoverable link to performance work, near the photo */}
      <button
        type="button"
        onClick={() => setIsPopupOpen(true)}
        className={styles.performanceLink}
      >
        Also making performance work →
      </button>

      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} imageSrc="/flowerPopUp.png" />

    </section>
  );
}
