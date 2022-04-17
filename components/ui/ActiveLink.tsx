import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
	path: string;
	children: JSX.Element | JSX.Element[];
}

export const ActiveLink: FC<Props> = ({ children, path }) => {
	const router = useRouter();

	const isActive = router.pathname === path;

	return (
		<li>
			<Link href={path}>
				<a
					className={`text-white text-xl hover:cursor-pointer ${
						isActive && 'border-b border-white'
					}`}
				>
					{children}
				</a>
			</Link>
		</li>
	);
};
