import { Images, Vendors } from '@prisma/client';
import React, { FC } from 'react';
import { UploadComponent } from './uploadComponent';
import { ViewerComponent } from './viewerComponent';

interface Props {
	vendor: Vendors;
	files: File[];
	setFiles: (files: File[]) => void;
	isEdit: boolean;
	images?: Images[];
}

export const ImageBuilder: FC<Props> = ({
	vendor,
	files,
	setFiles,
	isEdit
}) => {
	return (
		<>
			<UploadComponent
				vendorCode={vendor.vendorCode}
				files={files}
				setFiles={setFiles}
			/>
			{isEdit && (
				<div className='flex justify-evenly text-center text-sm mb-5'>
					<div className='w-full'>
						<h3 className='text-xl mb-3'>Imagenes ya subidas</h3>
						<ViewerComponent />
					</div>
				</div>
			)}
		</>
	);
};
