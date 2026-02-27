import {defineConfig} from 'orval';

export default defineConfig({
  financeApi: {
    input: {
      target: 'http://monity.eu-central-1.elasticbeanstalk.com/api-docs',
    },
    output: {
      client: 'react-query',
      mode: 'tags-split',
      target: 'src/shared/api/generated',
      schemas: 'src/shared/api/models',
      override: {
        mutator: {
          path: 'src/shared/api/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
