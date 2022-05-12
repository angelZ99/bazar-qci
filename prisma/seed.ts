import { PrismaClient } from '@prisma/client';
import { categories, products, users, vendors } from '../data';

const prisma = new PrismaClient();

const main = async () => {
	try {
		await prisma.$executeRaw`TRUNCATE "Category" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "Products" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "Admin" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "Images" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "Comments" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "RatingProduct" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "Favorites" RESTART IDENTITY CASCADE;`;
		await prisma.$executeRaw`TRUNCATE "Reports" RESTART IDENTITY CASCADE;`;

		await prisma.category.createMany({
			data: categories,
			skipDuplicates: true
		});
		// await prisma.users.createMany({
		// 	data: users,
		// 	skipDuplicates: true
		// });
		// await prisma.vendors.createMany({
		// 	data: vendors,
		// 	skipDuplicates: true
		// });
		// await prisma.products.createMany({
		// 	data: products,
		// 	skipDuplicates: true
		// });
	} catch (error) {
		console.error({
			type: 'Error',
			Message: error
		});
	}
};
main();
