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
    author: { id: 1, name: 'Test Author' }, // Adicionado ID para consistência
    tags: [],
};

// Mock do Contrato (IArticleRepository) para isolar o servico
const mockArticleRepository: jest.Mocked<IArticleRepository> = {
    findArticles: jest.fn(),
    // Mocks adicionados para operações CRUD
    findById: jest.fn(),
    createArticle: jest.fn(),
    updateArticle: jest.fn(),
}; 

describe('ArticleService (Regra de Negócio e CRUD)', () => {
    let articleService: ArticleService;

    beforeEach(() => {
        articleService = new ArticleService(mockArticleRepository);
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks(); 
        
        // Mock padrão para listagem
        mockArticleRepository.findArticles.mockResolvedValue({ 
            articles: [mockArticle], 
            total: 30 
        });
        // Mock padrão para criação
        mockArticleRepository.createArticle.mockResolvedValue(mockArticle);
        // Mock padrão para atualização
        mockArticleRepository.updateArticle.mockResolvedValue(mockArticle);
        // Mock padrão para busca por ID
        mockArticleRepository.findById.mockResolvedValue(mockArticle);
    });


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
        await articleService.getArticles({ page: -10, pageSize: 0 });
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
    // NOVOS TESTES: CRUD (Criação, Leitura Detalhada, Atualização)
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
            authorId: 1 
        } as any;

        // O Jest espera que a função lance um erro
        await expect(articleService.createArticle(invalidData)).rejects.toThrow(
            'Título, conteúdo e authorId são obrigatórios'
        );
        // Garante que o Repositório NÃO foi chamado
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

        // Verifica se o Repositório foi chamado com o DTO correto
        expect(mockArticleRepository.createArticle).toHaveBeenCalledWith(
            expect.objectContaining(validData)
        );
    });
    
    it('deve lançar um erro na atualização se nenhum campo for fornecido', async () => {
        const emptyUpdate = {};

        // Chama updateArticle sem fornecer title, content, tags ou imageUrl
        await expect(articleService.updateArticle(1, emptyUpdate)).rejects.toThrow(
            'Pelo menos um campo deve ser fornecido para atualização.'
        );
        // Garante que o Repositório NÃO foi chamado para atualizar
        expect(mockArticleRepository.updateArticle).not.toHaveBeenCalled();
    });
    
    it('deve chamar o Repositório para atualizar o artigo com sucesso (PUT)', async () => {
        const updateData = { content: 'Novo Conteúdo', imageUrl: 'nova_url.png' };
        const ARTICLE_ID = 1;

        await articleService.updateArticle(ARTICLE_ID, updateData);

        // Verifica se o Repositório foi chamado com os dados de atualização e o ID
        expect(mockArticleRepository.updateArticle).toHaveBeenCalledWith(
            ARTICLE_ID,
            expect.objectContaining(updateData)
        );
    });
});