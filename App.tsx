import React, { useState } from 'react';
import { ChevronDown, CheckCircle, XCircle, AlertTriangle, Rocket, Shield, Users, TrendingDown, Clock, Target, Lightbulb, Award } from 'lucide-react';
import Calculator from './components/Calculator';
import Modal from './components/Modal';

// Declaração global do Clarity
declare global {
  interface Window {
    clarity: (event: string, name: string, properties?: any) => void;
  }
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  // Rastreamento de scroll até 50% da página
  React.useEffect(() => {
    let scrollTracked = false;
    
    const handleScroll = () => {
      if (scrollTracked) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= 50 && window.clarity) {
        window.clarity('event', 'scroll_50_porcento', {
          scroll_percent: Math.round(scrollPercent)
        });
        scrollTracked = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCalculator = () => {
    document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConsultoriaClick = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header Principal */}
      <header className="gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-poppins font-bold text-5xl md:text-7xl text-white mb-6 animate-fade-in">
            Desconfia de juros altos?
          </h1>
          <h2 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-8 animate-fade-in">
            Veja em segundos se está pagando caro!
          </h2>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto animate-fade-in">
            Descubra como muitos brasileiros reduzem suas parcelas. É rápido, simples e grátis! Use nossa calculadora e veja como estão seus juros.
          </p>
          <button
            onClick={scrollToCalculator}
            className="btn-secondary text-xl px-12 py-6 pulse-animation"
          >
            🚀 QUERO CALCULAR MEUS JUROS AGORA
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white" size={32} />
        </div>
      </header>

      {/* Seção Problema */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl text-primary mb-8">
              Você está cansado de:
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              "Perder o sono pensando nas parcelas que não consegue pagar?",
              "Sentir ansiedade toda vez que olha as contas?",
              "Ver mais da metade do seu salário indo para empréstimos?",
              "Ter medo de ficar negativado(a)?"
            ].map((problem, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  <XCircle className="text-alert flex-shrink-0 mt-1" size={24} />
                  <p className="text-lg text-red-800 font-medium">
                    {problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <h3 className="font-poppins font-bold text-3xl text-primary">
              E se existisse uma forma de reduzir suas parcelas sem estresse?
            </h3>
          </div>
        </div>
      </section>

      {/* Seção Solução */}
      <section className="py-20 bg-light-custom">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl text-primary mb-8">
              RECONQUISTE SUAS FINANÇAS
            </h2>
            <p className="text-xl text-text-secondary max-w-4xl mx-auto mb-12">
              Analisamos de forma personalizada o seu contrato de empréstimo para te ajudar a obter oportunidades em:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <TrendingDown className="text-secondary" size={32} />,
                title: "Renegociação de juros",
                description: "Análise técnica dos seus contratos para identificar possibilidades de redução das parcelas."
              },
              {
                icon: <Users className="text-secondary" size={32} />,
                title: "Portabilidade para instituições",
                description: "Buscamos melhores condições em outras instituições financeiras para você avaliar oportunidades de portabilidade."
              },
              {
                icon: <Shield className="text-secondary" size={32} />,
                title: "Reclamações especializadas",
                description: "Requerimentos técnicos com fundamentos financeiros para acionar órgãos como Procon, Consumidor.gov.br e Reclame Aqui."
              }
            ].map((solution, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg card-hover text-center">
                <div className="flex justify-center mb-4">
                  {solution.icon}
                </div>
                <h3 className="font-poppins font-bold text-xl text-primary mb-4">
                  {solution.title}
                </h3>
                <p className="text-text-secondary">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Benefícios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl text-primary mb-8">
              POR QUE ESCOLHER NOSSO SERVIÇO?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Shield className="text-success" size={32} />,
                title: "ANÁLISE TÉCNICA",
                description: "Você poderá contratar um serviço individualizado com toda a fundamentação técnica e financeira, conforme dados do BACEN, para requerer a redução de suas parcelas."
              },
              {
                icon: <Target className="text-success" size={32} />,
                title: "PREÇO ACESSÍVEL",
                description: "A análise inicial é grátis. Caso opte pela nossa consultoria, não precisará desembolsar uma fortuna. Nossos serviços custam a partir de R$67,90."
              },
              {
                icon: <Award className="text-success" size={32} />,
                title: "PERSONALIZAÇÃO",
                description: "Você não é apenas mais um, e seu contrato de empréstimo também não. Tratamento personalizado para cada caso."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-8 card-hover">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-poppins font-bold text-xl text-primary mb-4 text-center">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <Calculator onConsultoriaClick={handleConsultoriaClick} />

      {/* Seção Como Funciona */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl text-primary mb-8">
              NOSSO PROCESSO EM 4 ETAPAS SIMPLES:
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                number: "1",
                icon: <CheckCircle className="text-secondary" size={32} />,
                title: "ANÁLISE GRATUITA",
                description: "Com apenas três informações, verificamos se os juros do seu contrato de empréstimo estão dentro da média de mercado, conforme dados oficiais do BACEN."
              },
              {
                number: "2",
                icon: <Users className="text-secondary" size={32} />,
                title: "CONSULTORIA PERSONALIZADA",
                description: "Se depois da análise grátis, você quiser orientações personalizadas para renegociar sua dívida com o Banco, portar seu crédito para outra instituição ou abrir uma reclamação no PROCON nós te ajudaremos com isso."
              },
              {
                number: "3",
                icon: <Target className="text-secondary" size={32} />,
                title: "DADOS E REQUERIMENTOS",
                description: "Você terá em mãos dados financeiros como a taxa média de juros dos bancos e instutuições cobrada no período e os fundamentos técnicos necessários através de um requerimento personalizado para buscar a redução das parcelas de empréstimo ou abrir uma reclamação formal."
              },
              {
                number: "4",
                icon: <Lightbulb className="text-secondary" size={32} />,
                title: "EDUCAÇÃO FINANCEIRA",
                description: "Ainda que essas primeiras negociações não tenham êxito, você receberá periodicamente informativos sobre reduções nas taxas de juros para buscar novas oportunidades no futuro."
              }
            ].map((step, index) => (
              <div key={index} className="bg-light-custom rounded-xl p-8 card-hover text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className="flex justify-center mb-4 mt-4">
                  {step.icon}
                </div>
                <h3 className="font-poppins font-bold text-lg text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Urgência */}
      <section className="py-20 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8">
            ⚡ ATENÇÃO: OPORTUNIDADE LIMITADA
          </h2>
          <p className="text-xl text-white mb-12 max-w-4xl mx-auto">
            Por que esperar para tentar reduzir suas parcelas de empréstimo? 
            Não deixe essa chance passar - NÚMERO LIMITADO DE ATENDIMENTOS!
            Deixe seus dados que entraremos em contato.
            
          </p>
          <button
            onClick={handleConsultoriaClick}
            className="btn-secondary text-xl px-12 py-6 pulse-animation"
          >
            🚀 QUERO UMA CONSULTORIA PERSONALIZADA
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong>Importante:</strong> Somos uma consultoria financeira voltada para análise de juros de contratos de empréstimos. 
              Não somos um escritório de advocacia. Os resultados das renegociações
              dependerão da disponibilidade da instituição financeira e das particularidades de cada caso. Infelizmente não 
              podemos assegurar a redução das parcelas, mas faremos o possível para proporcionar a melhor solução para cada caso.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;