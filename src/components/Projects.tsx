"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type ProjectCard = {
  title: string;
  subtitle?: string;
  desc: string;
  img: string;
  alt: string;
  href: string;
};

const PROJECTS: ProjectCard[] = [
  {
    title: "Climate Atlas",
    desc: "Visualising climate change projections — temperature anomaly and adaptive capacity data across an interactive world map.",
    img: "/project-climate-atlas.jpg",
    alt: "Temperature anomaly colour gradient from a climate projection map",
    href: "/climate-atlas",
  },
  {
    title: "Predicting SPY with ML",
    subtitle: "My final year Engineering thesis",
    desc: "Benchmarking five ML architectures on 23 years of S&P 500 data to test whether machine learning can beat chance at predicting market direction.",
    img: "/project-spy-ml.jpg",
    alt: "University of Exeter thesis cover page: Predicting S&P 500 Daily Returns",
    href: "/dissertation",
  },
  {
    title: "Crash Site",
    desc: "An indie game world built from scratch, heavy on atmosphere and puzzle design.",
    img: "/project-crashsite.jpg",
    alt: "Crash Site indie game environment",
    href: "/crash-site",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Projects() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="projects" className="relative w-full pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Selected work</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Projects that blend engineering with curiosity.
            </h2>
          </div>
        </div>

        <motion.div
          variants={shouldReduce ? undefined : container}
          initial={shouldReduce ? false : "hidden"}
          whileInView={shouldReduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {PROJECTS.map(({ title, subtitle, desc, img, alt, href }) => (
            <motion.article key={title} variants={shouldReduce ? undefined : item} className="group h-full">
              <Link
                className="flex h-full flex-col rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
                href={href}
                aria-label={`View ${title}`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    className="object-cover transition duration-150 ease-out group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                    quality={95}
                  />
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <h3 className="text-base font-medium text-slate-900">{title}</h3>
                  {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                  <p className="text-[13px] leading-normal text-slate-500">{desc}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
