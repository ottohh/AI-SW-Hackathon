import { db } from '$lib/server/db';
import { dataProduct } from '$lib/server/db/schema';
import type { ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async () => {
  const products = await db.query.dataProduct.findMany({
    with: dataProduct.metadata,
  });

  console.log('products', products);

  return {
    products: products.map((product) => ({
      id: product.id,
      metadata: product.metadata,
    })),
  };
};

