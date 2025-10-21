import { CommentService } from '@src/services/CommentService';
import { ICommentRepository } from '@src/types/CommentInterface';
import { Comment } from '@prisma/client';

const mockCreatedComment: Comment = {
    id: 1, content: 'Comentário criado!', userId: 1, articleId: 5, createdAt: new Date(),
};

// Mock do Contrato (ICommentRepository)
const mockCommentRepository: jest.Mocked<ICommentRepository> = {
    create: jest.fn(),
    findByArticleId: jest.fn(),
};

describe('CommentService (Regra de Negócio: Criação de Comentário)', () => {
    let commentService: CommentService;

    beforeEach(() => {
        commentService = new CommentService(mockCommentRepository);
        mockCommentRepository.create.mockClear();
        mockCommentRepository.findByArticleId.mockClear();
    });

    it('deve criar um comentário garantindo o userId=1 (Regra de Negócio do MVP)', async () => {
        // ARRANGE
        mockCommentRepository.create.mockResolvedValue(mockCreatedComment);
        const ARTICLE_ID = 5;
        const COMMENT_CONTENT = 'Teste Unitário';

        // ACT
        await commentService.addComment(ARTICLE_ID, COMMENT_CONTENT);

        // ASSERT: Verifica se a Regra de Negocio aplicou o ID 1
        expect(mockCommentRepository.create).toHaveBeenCalledWith({
            articleId: ARTICLE_ID,
            content: COMMENT_CONTENT,
            userId: 1, // <-- O Ponto de Teste
        });
    });

    it('deve chamar o Repositório corretamente ao listar comentários de um artigo', async () => {
        const ARTICLE_ID = 5;
        await commentService.getCommentsByArticle(ARTICLE_ID);

        // ASSERT: Garante que o metodo correto do Repositorio foi chamado
        expect(mockCommentRepository.findByArticleId).toHaveBeenCalledWith(ARTICLE_ID);
    });
});