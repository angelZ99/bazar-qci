import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { SchoolIcon } from '../icons';
import { ActiveLink } from '../ui/ActiveLink';
import Cookies from 'js-cookie';

interface Props {
	title: string;
	pageDescription: string;
	imageFullUrl?: string;
	children?: JSX.Element | JSX.Element[];
	role: string;
}

export const AdminLayout: FC<Props> = ({
	title,
	pageDescription,
	imageFullUrl,
	children,
	role
}) => {
	const mobileStyleNav =
		'fixed md:relative z-10 bottom-0 left-0 h-[60px] md:h-full flex items-center bg-zinc-800';
	const router = useRouter();
	return (
		<>
			<Head>
				<title>BazarQci - {title}</title>
				<meta name='description' content={pageDescription} />

				<meta property='og:title' content={title} />
				<meta property='og:description' content={pageDescription} />
				{imageFullUrl && <meta property='og:image' content={imageFullUrl} />}
			</Head>

			<header>
				<header className='w-full flex md:justify-evenly justify-between items-end m-auto bg-zinc-800 h-[80px] px-[30px] pb-3 mb-5'>
					<div>
						<Link
							href={`/managment/${role === 'admin' ? 'admin' : 'vendors/home'}`}
							passHref
						>
							<a className='flex pb-2'>
								<SchoolIcon width={32} height={32} />
								<h1 className='text-white text-3xl hover:cursor-pointer'>
									Bqci - Admin
								</h1>
							</a>
						</Link>
					</div>

					{/* Close session */}
					<div className='text-center'>
						<a>
							<Image
								src={'/img/white-user.png'}
								alt={'login-user-icon'}
								width={16}
								height={16}
							/>
							<div className='text-white text-xs'>
								<button
									className='underline underline-offset-1'
									onClick={() => {
										Cookies.remove('admin');
										router.push('/managment/');
									}}
								>
									Cerrar sesion
								</button>
							</div>
						</a>
					</div>
				</header>
			</header>

			<main className='container m-auto px-[30px] mb-[70px] md:mb-0'>
				{children}
			</main>
		</>
	);
};
