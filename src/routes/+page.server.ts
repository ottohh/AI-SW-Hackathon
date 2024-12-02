import { db } from '$lib/server/db'; // Assuming you have a db instance set up
import { dataProduct } from '$lib/server/db/schema';
import * as fs from 'fs/promises';
import path from 'path';
import { eq } from 'drizzle-orm';
import { processZipFile } from '../server/GPT/start';

export const actions = {
  upload: async ({ request }) => {
    const formData = await request.formData();
    const zip = formData.get('zip');

    const dataFolder = path.join(process.cwd(), 'data', 'products');
    await fs.mkdir(dataFolder, { recursive: true });

    let product;

    if (zip && typeof zip === 'object' && 'arrayBuffer' in zip) {
      const buffer = Buffer.from(await zip.arrayBuffer());
      const filePath = path.join(dataFolder, zip.name);
      await fs.writeFile(filePath, buffer);

      [product] = await db
        .insert(dataProduct)
        .values({
          metadata: {}, // Metadata is saved when ready
          zipPath: filePath,
        })
        .returning();
    }

    if (!product) return { success: false };

    console.log(product.zipPath);

    const metadata = await processZipFile(product.zipPath);

    console.log('Metadata:', metadata);

    await db
      .update(dataProduct)
      .set({
        metadata: metadata,
      })
      .where(eq(dataProduct.id, product.id));

    return {
      success: true,
      metadata: metadata,
      productId: product.id,
    };
  },
  save: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    // TODO handle metadata better
    const metadata = JSON.parse(formData.get('metadata') as string);
    const image = formData.get('image');

    const imageFolder = path.join(process.cwd(), 'data', 'productImages');
    await fs.mkdir(imageFolder, { recursive: true });

    let imagePath;

    if (image && typeof image === 'object' && 'arrayBuffer' in image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      imagePath = path.join(imageFolder, image.name);
      await fs.writeFile(imagePath, buffer);
    }

    await db
      .update(dataProduct)
      .set({
        metadata: metadata,
        productImagePath: image ? imagePath : undefined,
      })
      .where(eq(dataProduct.id, id));

    return {
      success: true,
    };
  },
};

