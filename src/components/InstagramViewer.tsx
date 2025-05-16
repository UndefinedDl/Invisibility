'use client';
import React, { useState } from 'react';
import { Search, Eye, Shield, Star, Clock, Key, X, Instagram, AlertCircle } from 'lucide-react';

const InstagramViewer = () => {
  const [username, setUsername] = useState('');
  const [showStories, setShowStories] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [freeViewUsed, setFreeViewUsed] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && !freeViewUsed) {
      setShowStories(true);
      setFreeViewUsed(true);
    } else if (username && freeViewUsed) {
      setShowUpgrade(true);
    }
  };
  
  const handleClose = () => {
    setShowStories(false);
    setUsername('');
  };
  
  const handleCloseUpgrade = () => {
    setShowUpgrade(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Eye className="text-purple-500" />
            <h1 className="text-xl font-bold">StoryPeek</h1>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Fazer Login
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Veja stories do Instagram anonimamente
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Visualize stories sem aparecer na lista de visualizações. 
            Privacidade garantida, sem login necessário.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="flex items-center bg-gray-800 rounded-full p-1 border border-gray-700 overflow-hidden shadow-lg">
              <div className="flex items-center pl-4">
                <Instagram className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-400">@</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite o nome de usuário"
                className="flex-grow py-3 px-2 bg-transparent focus:outline-none text-white"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                <span className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Ver Stories
                </span>
              </button>
            </div>
          </form>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Anônimo</h3>
              <p className="text-gray-400">Seu perfil permanece completamente invisível para o usuário alvo.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sem Login</h3>
              <p className="text-gray-400">Não precisa de login no Instagram. Simples, rápido e sem complicações.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Primeiro Grátis</h3>
              <p className="text-gray-400">Veja o primeiro perfil gratuitamente. Acesso ilimitado por apenas R$20/mês.</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Stories Modal */}
      {showStories && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="font-bold">{username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{username}</p>
                  <p className="text-xs text-gray-400">Visualizando anonimamente</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="aspect-[9/16] bg-gray-900 w-full max-h-[70vh]">
              <div className="h-full flex items-center justify-center flex-col text-center p-6">
                <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400 mb-2">Este é apenas um front-end demonstrativo.</p>
                <p className="text-gray-500 text-sm">A funcionalidade real requer integração com a API do Instagram e implementação do back-end.</p>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-xs text-gray-400 text-center">
                Você usou sua visualização gratuita. Para ver mais perfis, assine o plano mensal.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Faça upgrade para continuar</h3>
              <button onClick={handleCloseUpgrade} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium">Plano Mensal</h4>
                    <p className="text-xs text-gray-400">Stories ilimitados</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">R$20</p>
                    <p className="text-xs text-gray-400">por mês</p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-4">
                  <li className="flex items-center text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                      <Check className="h-3 w-3 text-purple-400" />
                    </div>
                    <span>Visualização anônima de stories</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                      <Check className="h-3 w-3 text-purple-400" />
                    </div>
                    <span>Perfis ilimitados</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                      <Check className="h-3 w-3 text-purple-400" />
                    </div>
                    <span>Cancelamento a qualquer momento</span>
                  </li>
                </ul>
                
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Assinar por R$20/mês
                </button>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  Pagamento seguro via Stripe
                </p>
              </div>
              
              <p className="text-xs text-gray-400 text-center">
                Ao se inscrever, você concorda com nossos Termos de Serviço e Política de Privacidade
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2025 StoryPeek. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white">Termos</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Privacidade</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Suporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Missing component definition for Check
type CheckProps = {
  className?: string;
};

const Check: React.FC<CheckProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default InstagramViewer;