import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

const projectId = 'ijgeixey'

// Workspaces for different environments
export default defineConfig([
  {
    name: 'development',
    title: 'UKAP Blog (Development)',
    projectId,
    dataset: 'development',
    basePath: '/dev',
    plugins: [structureTool()],
    schema: {
      types: schemaTypes,
    },
  },
  {
    name: 'production',
    title: 'UKAP Blog (Production)',
    projectId,
    dataset: 'production',
    basePath: '/prod',
    plugins: [structureTool()],
    schema: {
      types: schemaTypes,
    },
  },
])
