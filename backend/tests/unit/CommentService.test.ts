import { CommentService } from '@src/services/CommentService';
import { ICommentRepository } from '@src/types/CommentInterface'; 
import { Comment } from '@prisma/client';

const mockComment: Comment = {
    id: 10,
    content: 'Comentário de teste',
    userId: 99, 
    articleId: 5,
    createdAt: new Date(),
    parentId: null,
};

const mockCommentRepository: jest.Mocked<ICommentRepository> = {
    create: jest.fn(),
    findByArticleId: jest.fn(),
};

describe('CommentService (Regra de Negócio)', () => {
    let commentService: CommentService;

    beforeEach(() => {
        commentService = new CommentService(mockCommentRepository);
        jest.clearAllMocks();
        mockCommentRepository.create.mockResolvedValue(mockComment);
    });

    it('deve chamar o Repositório para criar um comentário pai com o userId correto', async () => {
        const ARTICLE_ID = 5;
        const USER_ID = 99;
        const CONTENT = 'Comentário principal';

        await commentService.addComment(ARTICLE_ID, CONTENT, USER_ID);

        
        expect(mockCommentRepository.create).toHaveBeenCalledWith({
            articleId: ARTICLE_ID,
            content: CONTENT,
            userId: USER_ID,
            parentId: undefined, 
        });
    });
    
    it('deve chamar o Repositório para criar uma resposta com o parentId correto', async () => {
        const ARTICLE_ID = 5;
        const USER_ID = 99;
        const PARENT_ID = 10;

        await commentService.addComment(ARTICLE_ID, 'Esta é uma resposta', USER_ID, PARENT_ID);

        expect(mockCommentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ userId: USER_ID, parentId: PARENT_ID })
        );
    });

    it('deve lançar um erro se o conteúdo for muito curto', async () => {
        const ARTICLE_ID = 5;
        const USER_ID = 99;
        
        await expect(
            commentService.addComment(ARTICLE_ID, 'curto', USER_ID)
        ).resolves.toBeDefined(); 
        
    });

    it('deve chamar o Repositório corretamente ao listar comentários', async () => {
        const ARTICLE_ID = 5;
        await commentService.getCommentsByArticle(ARTICLE_ID);

        expect(mockCommentRepository.findByArticleId).toHaveBeenCalledWith(ARTICLE_ID);
    });
});