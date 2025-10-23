import React from 'react';
import { formatDate } from '../utils/format'; 
import { ReplyForm } from './ReplyForm';
import { UseMutationResult } from '@tanstack/react-query';

// AUXILIARES
type CommentWithReplies = any; 

interface CommentTreeProps {
    comment: CommentWithReplies;
    level: number;

    onReplyToggle: (id: number) => void;
    currentReplyingId: number | null;
    // PAYLOAD FLEXIVEL
    mutation: UseMutationResult<any, Error, { content: string, parentId?: number }, unknown>; 
    articleId: string;
    onCancelReply: () => void;
}

const CommentTree: React.FC<CommentTreeProps> = ({ 
    comment, 
    level, 
    onReplyToggle, 
    currentReplyingId,
    mutation,
    articleId,
    onCancelReply
}) => {

    const indentPadding = level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : '';

    const handleReplyClick = () => {
        onReplyToggle(comment.id);
    };

    return (
        <div className={`space-y-4 ${level > 0 ? 'mt-4' : ''}`}>
            
            {/* ITEM DE COMENTARIO */}
            <div className={`p-4 border border-gray-100 rounded-lg shadow-sm ${indentPadding}`}>
                
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-semibold text-gray-800">{comment.user.name}</span>
                    <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

                <button
                    onClick={handleReplyClick}
                    className="mt-2 text-xs text-green-700 hover:underline"
                >
                    {currentReplyingId === comment.id ? 'Cancelar' : 'Responder'}
                </button>
            </div>

            {/* FORMULARIO DE RESPOSTAS */}
            {currentReplyingId === comment.id && (
                <div className="ml-4 mt-2">
                    <ReplyForm 
                        parentId={comment.id}
                        mutation={mutation}
                        articleId={articleId}
                        onCancel={onCancelReply}
                    />
                </div>
            )}

            {/* RENDERIZACAO RECURSIVA DAS RESPOSTAS */}
            {comment.replies && comment.replies.map((reply) => (
                <CommentTree
                    key={reply.id}
                    comment={reply}
                    level={level + 1} // Aumenta o nível
                    onReplyToggle={onReplyToggle}
                    currentReplyingId={currentReplyingId}
                    mutation={mutation}
                    articleId={articleId}
                    onCancelReply={onCancelReply}
                />
            ))}
        </div>
    );
};

export default CommentTree;