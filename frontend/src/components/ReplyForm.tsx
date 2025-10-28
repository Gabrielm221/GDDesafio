import React, { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';


interface ReplyFormProps {
    articleId: string;
    parentId?: number; 
    mutation: UseMutationResult<any, Error, { content: string; parentId?: number }, unknown>; 
    onCancel: () => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({ parentId, mutation, onCancel }) => {
    const [content, setContent] = useState('');

    const isSubmitting = mutation.status === 'pending';

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedContent = content.trim();

        if (trimmedContent.length >= 5) {
            // DISPARA A MUTATION COM O CONTEÚDO E O PARENT ID 
            mutation.mutate({ content: trimmedContent, parentId });
            setContent(''); // limpa o campo após enviar
        }
    };

    return (
        <form onSubmit={handleReplySubmit} className="mt-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                    parentId
                        ? `Responder ao comentário #${parentId}...`
                        : 'Escreva um comentário...'
                }
                rows={2}
                className="w-full p-2 bg-gray-100 rounded-md resize-none text-gray-800 text-sm"
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-2 mt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-500 text-sm hover:underline"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting || content.trim().length < 5}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
                </button>
            </div>
        </form>
    );
};
export default ReplyForm;