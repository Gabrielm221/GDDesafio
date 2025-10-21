import rootConfig from './jest.config.mjs'; // Importa a configuração base

export default {
  ...rootConfig, // Herda a configuracao principal (ESM, transform, moduleNameMapper)
  
  // Identificacao e Foco
  displayName: 'unit-tests-services',
  
  // Foca apenas nos arquivos de teste unitario
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts'], 
  
  // Remove o setupFilesAfterEnv do teste funcional.
  // Impede que o servidor Express seja inicializado para testes de servico.
  setupFilesAfterEnv: [], 

  // Preset padrao para um deesempenho mais rapido
  preset: 'ts-jest/presets/default-esm', 
  
  // Garante que o ts-jest aplique as transformacoes corretamente no escopo unitario
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: './tsconfig.json' }],
  },
};