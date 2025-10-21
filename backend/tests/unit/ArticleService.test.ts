import { ArticleService } from '@src/services/ArticleService';
import { IArticleRepository } from '@src/types/ArticleInterface'; // SOLID DIP
import { ArticleWithAuthorAndTags } from '@src/repository/ArticleRepository';

// Mock de dados para simular o retorno do repositorio
const mockArticle: ArticleWithAuthorAndTags = {
    id: 1, 
    title: 'Mock Teste', 
    content: 'Conteúdo para busca', 
    authorId: 1, 
    createdAt: new Date(), 
    updatedAt: new Date(), 
    author: { name: 'Test Author' }, 
    tags: [],
};

// Mock do Contrato (IArticleRepository) para isolar o servico
const mockArticleRepository: jest.Mocked<IArticleRepository> = {
    findArticles: jest.fn(),
}; 

describe('ArticleService (Regra de Negócio: Paginação e Busca)', () => {
    let articleService: ArticleService;

    beforeEach(() => {
        articleService = new ArticleService(mockArticleRepository);
        mockArticleRepository.findArticles.mockClear();
        // Mock padrão: 30 itens no total para testes de calculo
        mockArticleRepository.findArticles.mockResolvedValue({ 
            articles: [mockArticle], 
            total: 30 
        });
    });

    it('deve retornar a primeira página com valores padrão (page=1, pageSize=10)', async () => {
        const result = await articleService.getArticles({});

        // Assert: Verifica se a Regra de Negocio aplicou os defaults
        expect(result.meta.currentPage).toBe(1);
        expect(result.meta.pageSize).toBe(10);
        expect(result.meta.totalPages).toBe(3); 
    });

    it('deve calcular metadados corretamente para a pagina 2 com 7 itens/pagina', async () => {
        const result = await articleService.getArticles({ page: 2, pageSize: 7 });

        // Assert: 30 itens / 7 por pagina = 5 paginas
        expect(result.meta.currentPage).toBe(2);
        expect(result.meta.pageSize).toBe(7);
        expect(result.meta.totalPages).toBe(5); 
    });

    it('deve garantir que os parâmetros de página e tamanho sejam no mínimo 1 (Validação)', async () => {
        // Simula entrada invalida: pagina -10, tamanho 0
        await articleService.getArticles({ page: -10, pageSize: 0 });

        // Assert: Verifica se a Regra de Negocio aplicou o minimo de 1 para ambos
        // Este teste passa porque o ArticleService.ts agora prioriza o valor de entrada
        // e aplica Math.max(1, 0) = 1.
        expect(mockArticleRepository.findArticles).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1, pageSize: 1 })
        );
    });

    it('deve limpar (trim) e repassar os termos de busca e tag para o Repositório (Clean Code)', async () => {
        // Simula entrada com espaços indesejados
        await articleService.getArticles({ search: '  TECNOLOGIA ', tag: ' devops ' });

        // Assert: Verifica se o Service aplicou o Clean Code (trim)
        expect(mockArticleRepository.findArticles).toHaveBeenCalledWith(
            expect.objectContaining({ search: 'TECNOLOGIA', tag: 'devops' })
        );
    });
});