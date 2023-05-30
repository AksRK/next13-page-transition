'use client'
import '@/core/styles/globals.scss'
import { Inter } from 'next/font/google'
import {ReactNode, useEffect, useRef, useState} from "react";
import Footer from "@/components/UI/Footer";
import { AnimatePresence, useInView, LazyMotion, domAnimation, m} from "framer-motion";
import NavBar from "@/components/NavBar";
import {usePathname} from "next/navigation";
import Cases from "@/app/cases/page";
import styles from '@/app/layout.module.scss'
import About from "@/app/about/page";
import Home from "@/app/page";

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const footerRef = useRef<HTMLDivElement>(null)
  const observedFooterRef = useInView(footerRef, {margin: '0px 0px -40px 0px'})
  const [animationRunning, setAnimationRunning] = useState<boolean>(false)
  const [newPage, setNewPage] = useState<boolean>(false)
  const pathName = usePathname()

  const routes = [
    {path: '/cases', component: <Cases/>},
    {path: '/about', component: <About/>},
    {path: '/', component: <Home/>},
  ]

  const variants =  {
    initial: {
      opacity: 0,
      scale: 1,
      y: '120vh',
      transition: {
        duration: 0.5,
      },
    },
    animate: {
      opacity: 1,
      scale: observedFooterRef?0.95:1,
      y:0,
      transition: {
        opacity: {duration: 0},
        scale: {duration:0.2, ease: 'easeIn'},
        y: {delay: 0.1, duration: 0.5, ease: 'easeOut'}
      },
    },
    animateFast: {
      opacity: 1,
      scale: observedFooterRef?0.95:1,
      y:0,
      transition: {
        opacity: {duration: 0},
        scale: {duration:0.2, ease: 'easeIn'},
        y: {delay: 0, duration: 0.3, ease: 'easeOut'}
      },
    },
    exit: {
      opacity: 0.88,
      y: '100px',
      scale: 0.9,
      transition: {
        ease: 'easeOut',
        duration: 0.6,
        y: {duration: 0.2},
        scale: {duration: 0.3}
      },
    },
    exitFast: {
      opacity: 0.88,
      transition: {
        ease: 'easeOut',
        duration: 0.3,
      },
    },
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setNewPage(true)
    const timeout = setTimeout(() => {
      setNewPage(false)
    }, 900);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathName]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode={'popLayout'} onExitComplete={()=> setAnimationRunning(false)}>
            {routes.map((route) => route.path === pathName
                &&
                <m.div
                    key={pathName}
                    className={styles.content}
                    initial="initial"
                    animate={newPage && animationRunning? 'animateFast': 'animate' }
                    exit={newPage && animationRunning? 'exitFast': 'exit' }
                    variants={variants}
                >
                  {route.component}
                </m.div>
            )}

            {
                !routes.find(route => route.path === pathName) && (
                    <div className={styles.content}>
                      {children}
                    </div>
                )
            }
          </AnimatePresence>
        </LazyMotion>
        <Footer ref={footerRef} isVisible={observedFooterRef}/>
        <NavBar disabled={animationRunning} setDisabled={setAnimationRunning}/>
      </body>
    </html>
  )
}