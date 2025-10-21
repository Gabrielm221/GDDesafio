import { resolve } from 'path';
const root = resolve();

export default {
  rootDir: root,
  displayName: 'functional-tests', // Nome alterado para refletir o foco
  testMatch: ['<rootDir>/tests/functional/**/*.test.ts'], // Ajuste o caminho se necessário
  testEnvironment: 'node',
  clearMocks: true,
  
  // ts-jest para compilar TypeScript/ESM
  preset: 'ts-jest/presets/default-esm', 
  
  // Transformacao para suportar ESM com typescript
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: './tsconfig.json' }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  
  // Mapeamento de Aliases
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },

  // Setup de Ambiente (Aqui que o seu jest-setup.ts é carregado)
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'], 
  
  moduleFileExtensions: ['ts', 'js', 'json', 'node', 'mjs'],
};