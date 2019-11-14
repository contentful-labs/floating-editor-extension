/* global process */

import { createClient } from 'contentful-management';

export default () => {
  return createClient({
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.TOKEN
  });
};
