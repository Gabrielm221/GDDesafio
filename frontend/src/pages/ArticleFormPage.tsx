import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 
import { articleService } from '../service/articleService'; 
// TIPANDO OS NOSSOS ARQUIVOS
import { type IArticleForm } from '../types'; 

// COMPONENTES DE LAYOUT
import HeaderCustom from '../components/Header';
import ArticleFormCard from '../components/ArticleFormCard'; 

const ArticleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // LÓGICA DE MODO: FIXO PARA 'CREATE'
  const mode: 'create' = 'create';
  
  // 1. LÓGICA DE SUBMISSÃO (useMutation)
  const mutation = useMutation({
    mutationFn: (data: IArticleForm) => {
      const authorId = 1; // ID fixo para o MVP
      return articleService.createArticle({ ...data, authorId }); // CRIACAO(POST)
    },
    onSuccess: () => {
      // INVALIDA A QUERY DE ARTIGOS PARA REVALIDAR OS DADOS NA HOME
      queryClient.invalidateQueries({ queryKey: ['articles'] }); 
      alert("Artigo criado com sucesso!");
      navigate('/home'); // Redireciona para a Home Page (rota '/')
    },
    onError: (err: any) => {
      // TRATAMENTO DE ERRO DA API
      alert(`Erro ao salvar: ${(err.message || 'Ocorreu um erro ao criar o artigo.')}`);
    },
  });

  // HANDLER QUE RECEBE OS DADOS DO CARD
  const handleFormSubmit = (formData: IArticleForm) => {
      mutation.mutate(formData);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderCustom />

      <main className="flex-grow container mx-auto max-w-4xl px-6 py-12">
        {/* RENDERIZA O CARD DE FORMULARIO */}
        <ArticleFormCard
            mode={mode} 
            mutation={mutation} 
            onSubmit={handleFormSubmit} 
        />
      </main>
    </div>
  );
};

export default ArticleFormPage;