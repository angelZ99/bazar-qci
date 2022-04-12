import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
	return (
		<header className='w-full flex md:justify-evenly justify-between items-end m-auto bg-zinc-800 h-[80px] px-[30px] pb-5 mb-5'>
			<div>
				<Link href='/' passHref>
					<h1 className='text-white text-3xl hover:cursor-pointer'>BazarQci</h1>
				</Link>
			</div>
			<nav className='hidden md:block md:w-2/5'>
				<ul className='flex justify-between text-white'>
					<li className='text-xl hover:cursor-pointer'>
						<Link href='/' passHref>
							<Image
								src='/img/home.png'
								width={24}
								height={24}
								alt='home-icon'
							/>
						</Link>
					</li>
					<li className='text-xl hover:cursor-pointer'>
						<Link href='/' passHref>
							<Image
								src='/img/shop.png'
								width={24}
								height={24}
								alt='shop-icon'
							/>
						</Link>
					</li>
					<li className='text-xl hover:cursor-pointer'>
						<Link href='/' passHref>
							<Image
								src='/img/white-favorite.png'
								width={24}
								height={24}
								alt='favorite-icon'
							/>
						</Link>
					</li>
				</ul>
			</nav>
			<div className='text-center'>
				<Image
					src={'/img/home.png'}
					alt={'login-user-icon'}
					width={16}
					height={16}
				/>
				<p className='text-white text-xs'>Iniciar sesión</p>
			</div>
		</header>
	);
};
