import Link from 'next/link';
import Image from 'next/image';

export const Navbar = () => {
	return (
		<nav className='w-full fixed bottom-0 bg-zinc-800 h-[80px]'>
			<ul className='flex justify-between items-center h-full px-[30px] text-white'>
				<li className='text-xl'>
					<Link href='/' passHref>
						<Image src='/img/home.png' width={32} height={32} alt='home-icon' />
					</Link>
				</li>
				<li className='text-xl'>
					<Link href='/' passHref>
						<Image src='/img/shop.png' width={32} height={32} alt='shop-icon' />
					</Link>
				</li>
				<li className='text-xl'>
					<Link href='/' passHref>
						<Image
							src='/img/white-favorite.png'
							width={32}
							height={32}
							alt='favorite-icon'
						/>
					</Link>
				</li>
			</ul>
		</nav>
	);
};
