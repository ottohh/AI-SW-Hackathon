import { db } from '$lib/server/db'; // Assuming you have a db instance set up
import { dataProduct } from '$lib/server/db/schema';
import * as fs from 'fs/promises';
import path from 'path';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const zip = formData.get('zip');

    const dataFolder = path.join(process.cwd(), 'data');
    await fs.mkdir(dataFolder, { recursive: true });

    if (zip && typeof zip === 'object' && 'arrayBuffer' in zip) {
      const buffer = Buffer.from(await zip.arrayBuffer());
      const filePath = path.join(dataFolder, zip.name);
      await fs.writeFile(filePath, buffer);

      await db.insert(dataProduct).values({
        metadata: {}, // Metadata is saved when ready
        zipPath: filePath,
      });
    }

    return {
      success: true,
    };
  },
};

