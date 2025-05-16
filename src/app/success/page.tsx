'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Success() {

  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');

  useEffect(() => {
    // Verificar a sessão e salvar o acesso
    if (session_id) {
      // Em um cenário real, você verificaria a sessão com o Stripe
      // e confirmaria o pagamento no backend antes de conceder acesso
      
      // Para demonstração, apenas salvamos que o acesso foi concedido
      localStorage.setItem('tigrinho_access', 'true');
      
      // Você também poderia criar uma conta de usuário ou 
      // associar o pagamento a um usuário existente
    }
  }, [session_id]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">Pagamento Aprovado!</h1>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <p className="text-amber-400 font-semibold">Seu acesso ao Simulador Tigrinho foi ativado com sucesso.</p>
        </div>
        
        <p className="text-gray-300 mb-6">
          Obrigado pela sua compra! Você agora tem acesso completo a todas as funcionalidades
          do simulador, incluindo análises detalhadas, recomendações personalizadas e todas as
          atualizações futuras.
        </p>
        
        <div className="space-y-3">
          <Link href="/" className="block bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200">
            Acessar o Simulador
          </Link>
          
          <a 
            href="mailto:suporte@tigrinho-simulator.com"
            className="block text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            Precisa de ajuda? Entre em contato
          </a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-500">
            O comprovante de pagamento foi enviado para o seu email.
            <br />
            ID da transação: {session_id || 'Processando...'}
          </p>
        </div>
      </div>
    </div>
  );
}