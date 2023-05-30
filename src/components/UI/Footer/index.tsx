'use client'
import styles from './footer.module.scss'
import {forwardRef, useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";

export interface IFooterProps {
	isVisible: boolean;
}

const Footer = forwardRef<HTMLDivElement, IFooterProps>(({isVisible}, forwardedRef) => {
	const [footerHeight, setFooterHeight] = useState<number>(0)
	const footerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (footerRef.current) {
			setFooterHeight(footerRef.current.offsetHeight);
		}
	}, []);

	return (
		<>
			<div ref={forwardedRef} style={{height: footerHeight}} className={styles.footerMark}/>
			<motion.footer
				animate={isVisible?{opacity:1}:{opacity:0}}
				ref={footerRef}
				className={styles.footerWrp}>
				<footer className={styles.footer}>
					FOOTER
				</footer>
			</motion.footer>
		</>
	);
});

export default Footer;