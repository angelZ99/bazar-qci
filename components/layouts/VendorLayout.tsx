import Head from 'next/head';
import { FC } from 'react';
import { HeaderVendor } from '../ui';

interface Props {
	title: string;
	pageDescription: string;
	imageFullUrl?: string;
	children?: JSX.Element | JSX.Element[];
}

export const VendorLayout: FC<Props> = ({
	title,
	pageDescription,
	imageFullUrl,
	children
}) => {
	return (
		<>
			<Head>
				<title>BazarQci - {title}</title>
				<meta name='description' content={pageDescription} />

				<meta property='og:title' content={title} />
				<meta property='og:description' content={pageDescription} />
				{imageFullUrl && <meta property='og:image' content={imageFullUrl} />}
			</Head>

			<HeaderVendor />

			<main className='container m-auto px-[30px]'>{children}</main>
		</>
	);
};
