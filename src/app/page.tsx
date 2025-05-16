'use client';
import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import HomeView from "@/components/Home";
import axios from 'axios';

// Inicializar Stripe (substitua pela sua chave pública real do Stripe em produção)
const stripePromise = loadStripe('pk_test_51RPGH5Ph3CUtCrsqJiBgIIjiArRxIvlggFM0d29rhv8KJvyqSSvWTMpwILRURlTMK1fzWHZP4loen556Jl2uqRZe00ljAQojpg');

export default function Home() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | { success: boolean; message: string }>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    // Carregar a instância do Stripe assim que o componente montar
    const loadStripeInstance = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    
    loadStripeInstance();
    
    // Verificar se o usuário já pagou
    const hasAccess = localStorage.getItem('tigrinho_access');
    
    if (hasAccess) {
      setAccessGranted(true);
    } else {
      // Mostrar modal após pequeno delay para garantir que a página carregou
      setTimeout(() => {
        setShowPaymentModal(true);
      }, 500);
    }
    
    // Verificar se voltou de um cancelamento do Stripe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('canceled')) {
      setPaymentStatus({ 
        success: false, 
        message: 'O pagamento foi cancelado. Você pode tentar novamente quando quiser.' 
      });
    }
  }, []);

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    try {
      // Chamar API para criar sessão de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: 'Acesso ao Simulador Tigrinho',
          price: 12500, // Em centavos (R$ 125,00)
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const { id: sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('ID de sessão não retornado');
      }

      console.log('Session ID:', sessionId); // Log para debug
      
      // Redirecionar para página de checkout do Stripe
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (error) {
          console.error('Stripe redirect error:', error);
          throw new Error(error.message);
        }
      } else {
        throw new Error('Stripe não inicializado');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setPaymentStatus({ success: false, message: `Erro ao processar pagamento: ${errorMessage}` });
      setPaymentProcessing(false);
    }
  };

  // Simulação de pagamento bem-sucedido (para demonstração)
  const handleSuccessfulPaymentDemo = () => {
    setPaymentProcessing(true);
    
    // Simular processamento
    setTimeout(() => {
      setPaymentStatus({ success: true, message: 'Pagamento aprovado!' });
      localStorage.setItem('tigrinho_access', 'true');
      
      // Fechar modal após confirmação
      setTimeout(() => {
        setShowPaymentModal(false);
        setAccessGranted(true);
      }, 1500);
    }, 2000);
  };

  return (
    <>
      {/* Componente principal no fundo */}
      <div className={accessGranted ? "" : "filter blur-sm"}>
        <HomeView />
      </div>

      {/* Modal de pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-amber-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-amber-500 mb-2">
                Bem-vindo ao Simulador Tigrinho
              </h2>
              <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-4">
                Para acessar o simulador e suas funcionalidades exclusivas é necessário um pagamento único.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-400 mb-2">Valor único para acesso vitalício</p>
                <p className="text-3xl font-bold text-white">R$ 125,00</p>
              </div>

              <ul className="text-left text-sm mb-6 space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Acesso ilimitado ao simulador</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Análise detalhada de padrões de jogo</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Recomendações personalizadas</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Atualizações futuras incluídas</span>
                </li>
              </ul>
            </div>

            {paymentStatus && (
              <div className={`mb-4 p-3 rounded-lg ${paymentStatus.success ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                {paymentStatus.message}
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-colors duration-200 flex justify-center items-center"
              >
                {paymentProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </>
                ) : (
                  "Pagar com Stripe"
                )}
              </button>
              
              {/* Botão de demonstração para simular pagamento bem-sucedido */}
              <button
                onClick={handleSuccessfulPaymentDemo}
                disabled={paymentProcessing}
                className="border border-gray-500 text-gray-300 hover:bg-gray-700 font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition-colors duration-200"
              >
                Demonstração: Simular Pagamento
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Pagamentos processados de forma segura via Stripe.
                <br />
                Ao pagar, você concorda com nossos termos de serviço.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}