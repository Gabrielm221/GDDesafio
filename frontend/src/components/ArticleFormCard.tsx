import React, { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { type IArticleForm } from '../types'; // Assumindo types/IArticleForm

const BG_INPUT_COLOR = '#f0f6ec'; 
const BTN_COLOR_GREEN = '#6B9042'; 
const MOCK_TAGS = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI'];

// PROPRIEDADES DO CARD
interface ArticleFormCardProps {
    mode: 'create' | 'edit'; // REUTILIZACAO DO NOSSO COMPONENTE
    initialData?: IArticleForm; 
    mutation: UseMutationResult<any, Error, IArticleForm, unknown>; 
    onSubmit: (data: IArticleForm) => void;
}

const ArticleFormCard: React.FC<ArticleFormCardProps> = ({ mode, initialData, mutation, onSubmit }) => {
    
    // 1. ESTADOS DO FORMULÁRIO
    const [title, setTitle] = useState(initialData?.title || '');
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [selectedTags, setSelectedTags] = useState(initialData?.tags || []);
    
    const pageAction = mode === 'create' ? 'Criar artigo' : 'Salvar';

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // VALIDACAO PARA A UI
        if (!title || !content) {
            alert('Título e Conteúdo são obrigatórios.');
            return;
        }
        
        const formData: IArticleForm = { title, imageUrl, content, tags: selectedTags };
        onSubmit(formData); // CHAMA O HANDLER NO PAGE CONTEINER
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* TITULO E BOTAO */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-900">
                    {mode === 'create' ? 'Novo artigo' : 'Editar artigo'}
                </h1>
                <button
                    type="submit"
                    disabled={mutation.status === 'pending'}
                    className="px-6 py-2 rounded-md font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: BTN_COLOR_GREEN }}
                >
                    {mutation.status === 'pending' ? 'Salvando...' : pageAction}
                </button>
            </div>
            
            {/* MENSAGEM DE ERRO DA API */}
            {mutation.isError && <div className="text-red-600 mb-4">Erro ao salvar: {(mutation.error as Error)?.message}</div>}

            {/* 1. TITULO DO ARTIGO */}
            <div className="form-group">
                <label className="text-gray-700 block mb-1">Título do artigo *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título"
                    className="w-full rounded-md p-3 text-gray-800 focus:ring-green-700"
                    style={{ backgroundColor: BG_INPUT_COLOR, border: '1px solid transparent' }}
                />
            </div>

            {/* 2. IMAGEM DO ARTIGO */}
            <div className="form-group">
                <label className="text-gray-700 block mb-1">Imagem do artigo</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL da imagem"
                    className="w-full rounded-md p-3 text-gray-800"
                    style={{ backgroundColor: BG_INPUT_COLOR, border: '1px solid transparent' }}
                />
            </div>

            {/* 3. TAGS */}
            <div className="form-group">
                <label className="text-gray-700 block mb-3">Tags *</label>
                <div className="flex flex-wrap gap-3">
                    {MOCK_TAGS.map(tag => (
                        <button key={tag} type="button" onClick={() => handleTagToggle(tag)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                                selectedTags.includes(tag) ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. CONTEUDO */}
            <div className="form-group">
                <label className="text-gray-700 block mb-1">Conteúdo *</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Escreva aqui seu artigo..." rows={12}
                    className="w-full rounded-md p-3 text-gray-800 resize-none"
                    style={{ backgroundColor: BG_INPUT_COLOR, border: '1px solid transparent' }}
                />
            </div>
        </form>
    );
};

export default ArticleFormCard;