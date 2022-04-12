import { PrismaClient } from '@prisma/client';
import { categories, products, users, vendors } from '../data';

const prisma = new PrismaClient();

const main = async () => {
	try {
		await prisma.category.createMany({
			data: categories
		});
		await prisma.users.createMany({
			data: users
		});
		await prisma.vendors.createMany({
			data: vendors
		});
		await prisma.products.createMany({
			data: products
		});
	} catch (error) {
		console.error({
			type: 'Error',
			Message: error
		});
	}
};
main();
