import {defineConfig} from 'orval';

export default defineConfig({
  financeApi: {
    input: {
      target: 'https://recount-confiding-substance.ngrok-free.dev/api-docs',
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
