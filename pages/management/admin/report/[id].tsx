import Link from 'next/link';
import React from 'react';
import { AdminLayout } from '../../../../components/layouts';

const Report = () => {
	return (
		<AdminLayout
			title='Administracion'
			pageDescription='Administracion'
			role='admin'
		>
			<div className='flex flex-col mb-5'>
				<h1 className='text-xl font-bold mb-5 m-auto'>Administración</h1>
			</div>

			<h3 className='text-2xl font-semibold'> Reportes: </h3>

			<div className='flex mt-5'>
				<Link
					href={{
						pathname: '/management/admin/report/[id]',
						query: { id: 0, name: '' }
					}}
				>
					<a className='flex flex-col border rounded-xl min-h-[250px] w-[47%] md:w-[32%] xl:w-[23%] p-3 justify-between mb-5 z-0'></a>
				</Link>
			</div>
		</AdminLayout>
	);
};

export default Report;
