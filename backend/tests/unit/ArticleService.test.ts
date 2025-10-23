import { ArticleService } from '@src/services/ArticleService';
import { IArticleRepository } from '@src/types/ArticleInterface'; 
import { ArticleWithAuthorAndTags } from '@src/repository/ArticleRepository';

// Mock de dados para simular o retorno do repositorio
const mockArticle: ArticleWithAuthorAndTags = {
    id: 1, 
    title: 'Mock Teste', 
    content: 'Conteúdo para busca', 
    authorId: 1, 
    createdAt: new Date(), 
    updatedAt: new Date(), 
    author: { id: 1, name: 'Test Author' }, 
    tags: [],
    imageUrl: 'http://mock.url/placeholder.jpg', 
};

// Mock do Contrato (IArticleRepository) para isolar o servico
const mockArticleRepository: jest.Mocked<IArticleRepository> = {
    findArticles: jest.fn(),
    findById: jest.fn(),
    createArticle: jest.fn(),
    updateArticle: jest.fn(),
}; 

describe('ArticleService (Regra de Negócio e CRUD)', () => {
    let articleService: ArticleService;

    beforeEach(() => {
        articleService = new ArticleService(mockArticleRepository);
        jest.clearAllMocks(); 
        
        // Mock padrão para listagem
        mockArticleRepository.findArticles.mockResolvedValue({ 
            articles: [mockArticle], 
            total: 30 
        });
        mockArticleRepository.createArticle.mockResolvedValue(mockArticle);
        mockArticleRepository.updateArticle.mockResolvedValue(mockArticle);
        mockArticleRepository.findById.mockResolvedValue(mockArticle);
    });

    // ====================================================================
    // TESTES DE PAGINAÇÃO E BUSCA 
    // ====================================================================

    it('deve retornar a primeira página com valores padrão (page=1, pageSize=10)', async () => {
        const result = await articleService.getArticles({});

        expect(result.meta.currentPage).toBe(1);
        expect(result.meta.pageSize).toBe(10);
        expect(result.meta.totalPages).toBe(3); 
    });

    it('deve calcular metadados corretamente para a pagina 2 com 7 itens/pagina', async () => {
        const result = await articleService.getArticles({ page: 2, pageSize: 7 });
        expect(result.meta.totalPages).toBe(5); 
    });

    it('deve garantir que os parâmetros de página e tamanho sejam no mínimo 1 (Validação)', async () => {
        // Simula entrada invalida: pagina -10, tamanho 0
        await articleService.getArticles({ page: -10, pageSize: 0 });
        
        // Assert: A Regra de Negócio DEVE corrigir o page=-10 para 1.
        // E a lógica do ArticleService DEVE corrigir o pageSize=0 para o valor mínimo 1.
        expect(mockArticleRepository.findArticles).toHaveBeenCalledWith(
            expect.objectContaining({ page: 1, pageSize: 1 })
        );
    });

    it('deve limpar (trim) e repassar os termos de busca e tag para o Repositório (Clean Code)', async () => {
        await articleService.getArticles({ search: '  TECNOLOGIA ', tag: ' devops ' });
        expect(mockArticleRepository.findArticles).toHaveBeenCalledWith(
            expect.objectContaining({ search: 'TECNOLOGIA', tag: 'devops' })
        );
    });

    // ====================================================================
    // TESTES CRUD
    // ====================================================================

    it('deve chamar o Repositório para buscar um artigo por ID', async () => {
        const ARTICLE_ID = 5;
        const result = await articleService.getArticleById(ARTICLE_ID);
        
        expect(mockArticleRepository.findById).toHaveBeenCalledWith(ARTICLE_ID);
        expect(result).toEqual(mockArticle);
    });

    it('deve lançar um erro se campos obrigatórios (título) estiverem faltando na criação', async () => {
        const invalidData = { 
            title: '', 
            content: 'Conteúdo', 
            authorId: 1,
            imageUrl: 'url.jpg'
        } as any;

        await expect(articleService.createArticle(invalidData)).rejects.toThrow(
            'Título, conteúdo e authorId são obrigatórios'
        );
        expect(mockArticleRepository.createArticle).not.toHaveBeenCalled();
    });

    it('deve chamar o Repositório para criar um artigo com sucesso', async () => {
        const validData = { 
            title: 'Novo', 
            content: 'Cont', 
            authorId: 1, 
            imageUrl: 'url.jpg' 
        };
        await articleService.createArticle(validData);

        expect(mockArticleRepository.createArticle).toHaveBeenCalledWith(
            expect.objectContaining(validData)
        );
    });
    
    it('deve lançar um erro na atualização se nenhum campo for fornecido', async () => {
        const emptyUpdate = {};

        await expect(articleService.updateArticle(1, emptyUpdate)).rejects.toThrow(
            'Pelo menos um campo deve ser fornecido para atualização.'
        );
        expect(mockArticleRepository.updateArticle).not.toHaveBeenCalled();
    });
    
    it('deve chamar o Repositório para atualizar o artigo com sucesso (PUT)', async () => {
        const updateData = { content: 'Novo Conteúdo', imageUrl: 'nova_url.png' };
        const ARTICLE_ID = 1;

        await articleService.updateArticle(ARTICLE_ID, updateData);

        expect(mockArticleRepository.updateArticle).toHaveBeenCalledWith(
            ARTICLE_ID,
            expect.objectContaining(updateData)
        );
    });
});