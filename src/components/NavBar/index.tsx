'use client'
import {FC, useEffect, useRef, useState} from "react";
import styles from './nav-bar.module.scss'
import {motion} from "framer-motion";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";

export interface IMarkParam {
	width: number,
	height: number,
	top: number,
	left: number,
}

export interface INavBarProps {
	disabled: boolean,
	setDisabled: (state: boolean)=> void
}
const NavBar:FC<INavBarProps> = ({disabled, setDisabled}) => {
	const [markParams, setMarkParams] = useState<IMarkParam>()
	const [newPage, setNewPage] = useState<boolean>(false)
	const ref = useRef<HTMLDivElement>(null)
	const pathName = usePathname()
	const router = useRouter()

	const routes = [
		{path: '/' , title: 'Home'},
		{path: '/cases' , title: 'Cases'},
		{path: '/about' , title: 'About Page'},
	]

	useEffect(() => {
		const currentLink = routes.find((route) => route.path === pathName);
		if (currentLink && ref.current) {
			const target = Array.from(ref.current.children).find((child) =>
				child.textContent === currentLink.title
			) as HTMLElement;
			if (target) {
				setMarkParams({
					width: target.clientWidth,
					height: target.clientHeight,
					top: target.offsetTop,
					left: target.offsetLeft,
				});
			}
		}
		setNewPage(true)
		const timeout = setTimeout(() => {
			setNewPage(false)
		}, 350);

		return () => {
			clearTimeout(timeout);
		};
	}, [pathName]);

	const handleButtonClick = (path: string) => {
		router.push(path);
		setDisabled(true)
	};

	return (
		<div ref={ref} className={styles.navBar}>
			<motion.div
				className={styles.navBar__mark}
				animate={{left: markParams?.left, width: markParams?.width}}
				transition={{duration:0.4}}
				style={{
					width: markParams?.width,
					height: markParams?.height,
					top: markParams?.top,
					left:markParams?.left
			}}/>

			{
				routes.map((route) => (
					<button
						disabled={disabled && newPage}
						key={route.path}
						className={styles.navBar__item}
						onClick={()=> handleButtonClick(route.path)}
					>
						{route.title}
					</button>
				))
			}
		</div>
	);
};

export default NavBar;