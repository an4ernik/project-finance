import { defineConfig } from 'orval'

export default defineConfig({
  financeApi: {
    input: {
      target: 'https://rbxepeq442.eu-central-1.awsapprunner.com/api-docs.yaml',
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
})