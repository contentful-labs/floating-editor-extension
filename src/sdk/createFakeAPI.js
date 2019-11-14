import getClient from '../client';
import { createFakeFieldAPI } from './createFakeFieldAPI';

export async function externalInit(cb, { entryId, spaceId, environmentId }) {
  const client = getClient();
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const entry = await environment.getEntry(entryId);

  const contentType = await environment.getContentType(entry.sys.contentType.sys.id);

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
    locales: {
      default: 'en-US'
    },
    contentType: contentType.toPlainObject(),
    space: {
      getEntries: (...args) => {
        return environment.getEntries(...args);
      },
      getAssets: (...args) => {
        return environment.getAssets(...args);
      },
      getEntry: (...args) => {
        return environment.getEntry(...args);
      }
    },
    entry: {
      fields,
      getSys: () => {
        return entry.sys;
      }
    },
    window: {
      startAutoResizer: () => {
        return () => {};
      },
      updateHeight: () => {}
    }
  };

  cb(sdk);
}
