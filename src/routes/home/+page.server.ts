import { db } from '$lib/server/db';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
  const products = await db.query.dataProduct.findMany();

  console.log('products', products);

  return {
    products: products.map((product) => ({
      id: product.id,
      metadata: product.metadata,
      productImagePath: product.productImagePath,
    })),
  };
};

