import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { commentService } from '../service/commentService'; 
import { useAuth } from '../hooks/useAuth';
import CommentTree from './CommentTree';


type CommentWithReplies = any; 
type Comment = any; 

interface CommentSectionProps {
    articleId: string;
}

const BG_INPUT_COLOR = '#f0f6ec'; 
const BTN_COLOR_GREEN = '#6B9042'; 

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
    const queryClient = useQueryClient();
    const { token, user } = useAuth();
    const isLoggedIn = !!token;

    // ESTADOS
    const [mainCommentContent, setMainCommentContent] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const [replyingToId, setReplyingToId] = useState<number | null>(null); 
    
    // RIPOS PARA A MUTACAO
    type MutationPayload = { content: string, parentId?: number };
    type MutationError = Error; 

    //LISTAR COMENTARIOS
    const { data: comments, isLoading: isCommentsLoading } = useQuery<CommentWithReplies[]>({
        queryKey: ['article-comments', articleId],
        queryFn: () => (commentService as any).listByArticle(articleId), 
        enabled: !!articleId,
    });

    //MUTATION: CRIAR COMENTARIO/RESPOSTA
    const mutation: UseMutationResult<any, MutationError, MutationPayload, unknown> = useMutation({
        mutationFn: ({ content, parentId }) => {
            if (!token) throw new Error("Autenticação necessária.");
            return (commentService as any).createComment(articleId, { content, parentId }, token!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article-comments', articleId] });
            setMainCommentContent('');
            setReplyingToId(null);
        },
        onError: (err: any) => {
            setLocalError(err.message || 'Falha ao enviar o comentário.');
        },
    });

    // HANDLER DE SUBMIT DO FORMULARIO PRINCIPAL
    const handleSubmitMain = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!isLoggedIn) { setLocalError('Faça login para comentar.'); return; }
        const trimmedContent = mainCommentContent.trim();
        if (trimmedContent.length < 5) { setLocalError('Mínimo 5 caracteres.'); return; }

        mutation.mutate({ content: trimmedContent }); // Envia sem parentId
    };
    
    const isSubmitting = mutation.status === 'pending';

    return (
        <section className="mt-10">
            <h2 className="text-2xl font-bold font-serif mb-6 text-gray-800">Comentários</h2>

            {/* FORMULARIO PRINCIPAL */}
            {isLoggedIn ? (
                <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Escreva um comentário...</h3>
                    <form onSubmit={handleSubmitMain} className="space-y-4"> 
                        <textarea
                            value={mainCommentContent}
                            onChange={(e) => setMainCommentContent(e.target.value)}
                            placeholder="Seu comentário aqui..."
                            rows={4}
                            className="w-full rounded-md p-3 text-gray-800 resize-none"
                            style={{ backgroundColor: BG_INPUT_COLOR, border: '1px solid transparent' }}
                            disabled={isSubmitting}
                        />
                        
                        <button type="submit" disabled={isSubmitting} style={{ backgroundColor: BTN_COLOR_GREEN }}>
                            {isSubmitting ? 'Enviando...' : 'Comentar'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="text-center p-8 border border-gray-300 rounded-lg mb-8">
                    <p className="text-gray-600">
                        Faça <a href="/login" className="text-green-600 font-semibold hover:underline">login</a> para deixar um comentário.
                    </p>
                </div>
            )}

            {/* LISTA DE COMENTARIOS (HIERARQUIA) */}
            <div className="space-y-6">
                {isCommentsLoading && <div>Carregando comentários...</div>}
                
                {comments && (
                    (comments as CommentWithReplies[]).map((comment) => (
                        <div key={comment.id}>
                            {/* COMENTÁRIO PAI (NIVEL 0) */}
                            <CommentTree 
                                key={comment.id}
                                comment={comment}
                                level={0} 
                                onReplyToggle={(id) => setReplyingToId(replyingToId === id ? null : id)}
                                currentReplyingId={replyingToId}
                                mutation={mutation} // INJETANDO A MUTATION
                                articleId={articleId}
                                onCancelReply={() => setReplyingToId(null)}
                            />
                        </div>
                    ))
                )}
            </div>
            <button className="text-green-600 hover:underline mt-6">Ver mais comentários</button>
        </section>
    );
};

export default CommentSection;