import { db } from '$lib/server/db';
import { dataProduct } from '$lib/server/db/schema';
import type { ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ params }) => {
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
    metadata: product.metadata,
  };
};

