import { db } from '$lib/server/db'; // Assuming you have a db instance set up
import { dataProduct } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs/promises';
import path from 'path';
import { redirect } from '@sveltejs/kit';

export const actions = {
  save: async ({ request }: { request: Request }) => {
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

    return redirect(302, '/home/' + id);
  },
};

