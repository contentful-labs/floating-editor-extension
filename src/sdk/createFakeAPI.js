import getClient from '../client';
import { createFakeFieldAPI } from './createFakeFieldAPI';

export async function externalInit(cb, { entryId, spaceId }) {
  const client = getClient();
  const space = await client.getSpace(spaceId);
  let entry = await space.getEntry(entryId);
  const contentType = await space.getContentType(entry.sys.contentType.sys.id);

  const fields = {};

  contentType.fields.forEach(field => {
    const initialValue = entry.fields[field.id] ? entry.fields[field.id]['en-US'] : undefined;
    fields[field.id] = createFakeFieldAPI({
      field,
      onUpdate: async value => {
        entry.fields[field.id] = {
          'en-US': value
        };
        const newEntry = await entry.update();
        entry.sys = newEntry.sys; // eslint-disable-line
      },
      initialValue
    });
  });

  const sdk = {
    contentType: contentType.toPlainObject(),
    entry: {
      fields
    }
  };

  cb(sdk);
}
