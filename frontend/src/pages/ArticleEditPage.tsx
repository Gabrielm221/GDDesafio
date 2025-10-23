import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'; 
import { articleService } from '../service/articleService'; 

// TIPAGEM
import { type IArticleForm } from '../types'; 

// COMPONENTES
import HeaderCustom from '../components/Header';
import ArticleFormCard from '../components/ArticleFormCard'; // Reutilizamos o Card UI

const ArticleEditPage: React.FC = () => {
  // OBTEM O ID PARA SABER QUAL ARTIGO EDITAR
  const { id } = useParams<{ id: string }>();
  const articleId = id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // USA QUERY PARA CARREGAR OS DADOS ORIGINAIS
  const { data: initialArticleData, isLoading: isFetching, isError: isFetchError, error: fetchError } = useQuery({
    queryKey: ['article-detail', articleId],
    queryFn: () => articleService.get(articleId!),
    enabled: !!articleId, // Só executa se o ID existir
  });

  // FORMATO DOS DADOS INICIAIS PARA O NOSSO CARD
  const initialFormData: IArticleForm | undefined = initialArticleData ? {
    title: initialArticleData.title,
    imageUrl: (initialArticleData as any).imageUrl || '',
    content: initialArticleData.content,
    // MAPEIA O ARRAY DE OBJETOS
    tags: initialArticleData.tags?.map(t => t.tag.name) || [], 
  } : undefined;


  const mutation = useMutation({
    mutationFn: (data: IArticleForm) => {
      return articleService.updateArticle(articleId!, data); 
    },
    onSuccess: () => {
      //INVALIDA O CACHE DE DETALHES DA CHAMADA PRINCIPAL // PRECISAMOS CARREGAR SOMENTE O NOSSO ARQUIVO
      queryClient.invalidateQueries({ queryKey: ['article-detail', articleId] }); 
      queryClient.invalidateQueries({ queryKey: ['articles'] }); 
      alert("Artigo atualizado com sucesso!");
      navigate(`/article/${articleId}`); // REDIRECIONA PARA A PÁGINA DE DETALHES
    },
    onError: (err: any) => {
      alert(`Erro ao salvar: ${(err.message || 'Ocorreu um erro ao atualizar o artigo.')}`);
    },
  });

  // HANDLER QUE RECEBE OS DADOS E DISPARA O MUTATION
  const handleFormSubmit = (formData: IArticleForm) => {
      mutation.mutate(formData);
  };
  
  if (isFetching) return <div>Carregando dados originais para edição...</div>;
  if (isFetchError) return <div className="text-red-600 p-8">Erro ao buscar artigo: {(fetchError as Error).message}</div>;
  if (!initialArticleData) return <div>Artigo não encontrado.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderCustom />

      <main className="flex-grow container mx-auto max-w-4xl px-6 py-12">
        {/* REUTILIZANDO NOSSO CARD PARA USARMOS NO MODO "EDIT" */}
        <ArticleFormCard
            mode="edit" 
            initialData={initialFormData}
            mutation={mutation} 
            onSubmit={handleFormSubmit} 
        />
      </main>


    </div>
  );
};

export default ArticleEditPage;