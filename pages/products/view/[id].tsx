import { useContext, useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import superjson from 'superjson';
import prisma from '../../../lib/prisma';
import { AuthContext } from '../../../context/auth/AuthContext';
import {
	Products,
	Vendors,
	Comments,
	RatingProduct,
	Images
} from '@prisma/client';
import { ShopLayout } from '../../../components/layouts';
import { showToast, commentModal } from '../../../lib/notifications';
import { CommentList } from '../../../components/products/comments/CommentList';

interface Props {
	product: Products & {
		images: Images[];
		rating: RatingProduct | null;
	};
	vendor: Vendors;
	comments: (Comments & {
		user: {
			firstName: string;
			lastName: string;
			userCode: number;
		};
	})[];
	rating: RatingProduct;
}

const IndexProductsPage: NextPage<Props> = ({
	product,
	vendor,
	comments,
	rating
}) => {
	const router = useRouter();
	const { id = 0 } = router.query;
	const [isFavorite, setIsFavorite] = useState(false);

	const { isAuthenticated, user, updateUser } = useContext(AuthContext);

	if (id === 0) {
		router.push('/');
	}

	useEffect(() => {
		if (isAuthenticated) {
			const exp = user?.favorites?.filter((f) => {
				return f.productId === Number(id);
			});
			if (exp!.length > 0) {
				setIsFavorite(true);
			} else {
				setIsFavorite(false);
			}
		}
	}, [user]);

	const handleComment = () => {
		/*@ts-ignore*/
		commentModal(product.name, user?.userCode!, product.id, product.rating?.id);
	};

	//* Methods to handle favorites
	const addFavorite = async () => {
		if (isAuthenticated) {
			await fetch('/api/products/favorites', {
				method: 'POST',
				body: JSON.stringify({
					userCode: user?.userCode,
					productId: Number(id)
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					res.status === 200 &&
						showToast('success', 'Producto agregado a tus favoritos');
					updateUser();
					return res.json();
				})
				.catch(() => {
					showToast('error', 'Error al agregar a favoritos');
				});
		} else {
			showToast(
				'error',
				'Debes iniciar sesión para poder agregar productos a favoritos'
			);
		}
	};
	const removeFavorite = async () => {
		if (isAuthenticated) {
			await fetch('/api/products/favorites', {
				method: 'DELETE',
				body: JSON.stringify({
					userCode: user?.userCode,
					productId: Number(id)
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					showToast('warning', 'Producto eliminado de tus favoritos');
					updateUser();
					return res.json();
				})
				.catch(() => {
					showToast('error', 'Error al eliminar de tus favoritos');
				});
		} else {
			showToast(
				'error',
				'Debes iniciar sesión para poder agregar productos a favoritos'
			);
		}
	};

	const textMessage = `
		Hola ${vendor.firstName}, Me interesa este producto: ${product.name} 
		~~~ ${router.basePath + router.asPath}
	`;

	return (
		<ShopLayout title={product.name} pageDescription={product.description}>
			<div>
				<div className='flex mb-3'>
					<div className='w-[150px] h-[150px]'>
						<Image
							src={product.images[0].url}
							width={150}
							height={150}
							layout='responsive'
							alt='food-icon'
						/>
					</div>
					{/***** Header Product *****/}
					<div className='ml-5'>
						<h2 className='text-xl font-semibold mb-3'>{product.name}</h2>
						{/**********/}
						<div className='ml-5 text-lg'>
							{/* Price */}
							<div>
								Precio:
								<span className='font-semibold'> {product.price} </span>
							</div>
							{/* Rating */}
							<div className='flex flex-wrap'>
								Calificacion:
								<span className='font-semibold'>
									{rating.rating} ( {comments.length !== 1 && comments.length}
									{comments.length === 1 ? 'una opinión' : ' Opiniones'} )
								</span>
							</div>
							{/* Vendor */}
							<div>
								Vendedor: <br />
								<Link
									href={{
										pathname: '/vendor/[id]',
										query: { id: vendor.vendorCode }
									}}
									passHref
								>
									<span className='flex justify-center text-blue-700 italic font-semibold'>
										{vendor.firstName} {vendor.lastName}
									</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				{/***** Description Product *****/}
				<div className='mb-5'>
					<h3 className='text-lg font-semibold'> Descripcion: </h3>
					<p>{product.description}</p>
				</div>
				{/***** Fav Product *****/}
				<div className='flex justify-end mb-5'>
					<button
						className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-1 rounded-lg flex gap-3'
						onClick={isFavorite ? removeFavorite : addFavorite}
					>
						{isFavorite ? 'Eliminar de favoritos' : 'Agregar a Favoritos'}
						<Image
							src='/img/white-favorite.png'
							width={24}
							height={24}
							alt='favorite-icon'
						/>
					</button>
				</div>
				{/***** Contact Vendor *****/}
				<div className='flex justify-center mb-8'>
					<button className='border-2 border-gray-600 rounded w-full bg-zinc-800 p-2 shadow'>
						<Link
							href={`https://wa.me/${vendor.phoneNumber}?text=${textMessage}`}
						>
							<a
								className='font-semibold text-white uppercase italic text-lg'
								target='_blank'
							>
								Contactar al vendedor
							</a>
						</Link>
					</button>
				</div>
				{/***** Comments Product *****/}
				<div className='flex justify-between mb-5'>
					<h3 className='text-lg font-semibold'> Comentarios: </h3>
					<button
						className='italic text-blue-700 font-semibold'
						onClick={
							isAuthenticated
								? handleComment
								: () => {
										router.push('/user/login');
								  }
						}
					>
						{isAuthenticated
							? 'Dejar un comentario'
							: 'Iniciar sesión para comentar'}
					</button>
				</div>
				{/***** Comments List *****/}
				<CommentList comments={comments} />
			</div>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { id = 0 } = ctx.query;

	const product = await prisma.products.findUnique({
		where: {
			id: Number(id)
		},
		include: {
			images: true,
			rating: true
		}
	});

	if (!product) {
		return {
			redirect: {
				permanent: true,
				destination: '/404'
			}
		};
	}

	const vendor = await prisma.vendors.findUnique({
		where: {
			vendorCode: product.vendorCode
		}
	});

	const comments = await prisma.comments.findMany({
		where: {
			productId: product.id
		},
		include: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					userCode: true
				}
			}
		}
	});

	const rating = await prisma.ratingProduct.findFirst({
		where: {
			productId: Number(id)
		}
	});

	return {
		props: {
			product: superjson.serialize(product).json,
			vendor: superjson.serialize(vendor).json,
			comments: superjson.serialize(comments).json,
			rating: superjson.serialize(rating).json
		}
	};
};

export default IndexProductsPage;
