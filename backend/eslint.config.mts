import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'; 
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier'; 
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    // 1. Configuracao Base: Ignorar arquivos
    {
        ignores: ["node_modules/", "dist/", "build/", "coverage/", "prisma/", "articles.json"],
    },
    
    // 2. Configuracao TypeScript + ESLint
    {
        files: ["**/*.ts", "**/*.mts"], 
        
        languageOptions: {
            parser: tsParser, // Módulo Parser
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
            globals: {
                ...globals.node, 
                ...globals.jest,
            },
        },
        
        // Pluggins usados para configuracoes especificas
        plugins: {
            '@typescript-eslint': eslintPluginTypeScript, 
            'prettier': eslintPluginPrettier,
        },
        
        rules: {
            // Usa as regras recomendadas do plugin
            ...eslintPluginTypeScript.configs['recommended'].rules, 
            
            // Regras Especificas
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "error",
            "no-console": "warn",
        },
    },

    // 3. Desativa regras do ESLint que conflitam com o Prettier (DEVE ser o ultimo antes do plugin de execucao)
    prettierConfig,

    // 4. Regras do Prettier (Executa o Prettier como regra)
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    singleQuote: true,
                    semi: true,
                    tabWidth: 2,
                    trailingComma: "es5",
                    printWidth: 100,
                    bracketSpacing: true,
                    arrowParens: "always",
                }
            ]
        }
    }
];