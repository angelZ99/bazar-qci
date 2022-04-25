import Image from 'next/image';
import { ActiveLink } from './';

export const Navbar = () => {
	return (
		<nav className='w-full fixed bottom-0 bg-zinc-800 h-[80px] z-10'>
			<ul className='flex justify-between items-center h-full px-[30px] text-white'>
				<ActiveLink path='/'>
					<Image src='/img/home.png' width={32} height={32} alt='home-icon' />
				</ActiveLink>
				<ActiveLink path='/products/'>
					<Image src='/img/shop.png' width={32} height={32} alt='shop-icon' />
				</ActiveLink>
				<ActiveLink path='/user/favs'>
					<Image
						src='/img/white-favorite.png'
						width={32}
						height={32}
						alt='favorite-icon'
					/>
				</ActiveLink>
			</ul>
		</nav>
	);
};
