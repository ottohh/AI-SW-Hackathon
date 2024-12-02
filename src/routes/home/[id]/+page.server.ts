import { db } from '$lib/server/db';
import { dataProduct } from '$lib/server/db/schema';
import type { Load } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: Load = async ({ params }) => {
  const { id } = params;

  if (!id) return { status: 400, body: { error: 'Not found' } };

  const product = await db.query.dataProduct.findFirst({
    where: eq(dataProduct.id, id),
  });

  console.log('product', product);

  if (!product) {
    return {
      status: 404,
      body: {
        error: 'Product not found',
      },
    };
  }

  return {
    id: product.id,
    metadata: product.metadata,
    productImagePath: product.productImagePath,
  };
};

