import React, { FC, useState } from 'react';

interface Props {
	vendorCode: number;
	files: File[];
	setFiles: (files: File[]) => void;
}

export const UploadComponent: FC<Props> = ({ vendorCode, files, setFiles }) => {
	const handleImageChange = ({
		currentTarget: { files }
	}: React.ChangeEvent<HTMLInputElement>) => {
		if (files && files.length) {
			/*@ts-ignore*/
			setFiles((existing) => existing.concat(Array.from(files)));
		}
	};

	return (
		<div className='mb-7'>
			<div
				className={`border-2 border-gray-600 rounded p-2 text-white bg-zinc-800 mb-2 m-auto w-full ld:w-2/3 text-center hover:cursor-pointer`}
			>
				<label htmlFor='sendFiles'>Agregar una imagen</label>
				<input
					className='hidden'
					type='file'
					accept='image/png, image/jpeg, image/jpg'
					id='sendFiles'
					onChange={handleImageChange}
				/>
			</div>
			{files.length ? (
				<div className={`flex gap-3 mt-5`}>
					{files.map((file) => (
						<div key={file.name} className='w-full'>
							<img
								src={URL.createObjectURL(file)}
								alt={file.name}
								className='w-[120px] '
							/>
						</div>
					))}
				</div>
			) : (
				<div className='text-center'>No hay imagenes</div>
			)}
		</div>
	);
};
