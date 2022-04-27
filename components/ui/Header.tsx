import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SchoolIcon } from '../icons';
import { AuthContext } from '../../context';
import { ActiveLink } from '.';

export const Header = () => {
	const { isAuthenticated, user } = useContext(AuthContext);

	return (
		<header className='w-full flex md:justify-evenly justify-between items-end m-auto bg-zinc-800 h-[80px] px-[30px] pb-5 mb-5'>
			<div>
				<Link href='/' passHref>
					<a className='flex'>
						<SchoolIcon width={32} height={32} />
						<h1 className='text-white text-3xl hover:cursor-pointer'>
							BazarQci
						</h1>
					</a>
				</Link>
			</div>
			<nav className='hidden md:block md:w-2/5'>
				<ul className='flex justify-around text-white'>
					<ActiveLink path='/'>
						<Image src='/img/home.png' width={24} height={24} alt='home-icon' />
					</ActiveLink>
					<ActiveLink path='/products/'>
						<Image src='/img/shop.png' width={24} height={24} alt='shop-icon' />
					</ActiveLink>
					<ActiveLink path='/user/favorites/'>
						<Image
							src='/img/white-favorite.png'
							width={24}
							height={24}
							alt='favorite-icon'
						/>
					</ActiveLink>
				</ul>
			</nav>
			<div className='text-center'>
				<Link href={'/user/login'} passHref>
					<a>
						<Image
							src={'/img/white-user.png'}
							alt={'login-user-icon'}
							width={16}
							height={16}
						/>
						<p className='text-white text-xs'>
							{isAuthenticated ? `Hola ${user!.firstName}` : 'Iniciar sesión'}
						</p>
					</a>
				</Link>
			</div>
		</header>
	);
};
