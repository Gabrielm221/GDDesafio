import React from 'react';
import { formatDate } from '../utils/format';

//TIPOS AUXILIARES
type CommentWithReplies = any;

interface CommentItemProps {
    comment: CommentWithReplies;
    level: number; 
    onReplyClick: (parentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level, onReplyClick }) => {


    return (
        <div className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-gray-800">{comment.user.name}</span>
                <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>

            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

            <button
                onClick={() => onReplyClick(comment.id)}
                className="mt-2 text-xs text-gray-500 hover:underline"
            >
                Responder
            </button>

        </div>
    );
};

export default CommentItem;