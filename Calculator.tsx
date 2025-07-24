import React, { useState } from 'react';
import { Calculator as CalcIcon, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { dadosTaxas, tiposCredito, type TaxaData } from '../data/taxas';

// Declaração global do Clarity
declare global {
  interface Window {
    clarity: (event: string, name: string, properties?: any) => void;
  }
}

interface CalculatorProps {
  onConsultoriaClick: () => void;
}

export default function Calculator({ onConsultoriaClick }: CalculatorProps) {
  const [formData, setFormData] = useState({
    tipoCredito: '',
    mes: '',
    ano: '',
    taxaJuros: ''
  });

  const [resultado, setResultado] = useState<{
    tipo: 'controlada' | 'melhoria' | 'oportunidade';
    taxa: number;
    dados: TaxaData;
    periodo: string;
  } | null>(null);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setResultado(null);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.tipoCredito) newErrors.tipoCredito = 'Selecione o tipo de crédito';
    if (!formData.mes) newErrors.mes = 'Selecione o mês';
    if (!formData.ano) newErrors.ano = 'Selecione o ano';
    if (!formData.taxaJuros) {
      newErrors.taxaJuros = 'Informe a taxa de juros';
    } else if (isNaN(Number(formData.taxaJuros)) || Number(formData.taxaJuros) <= 0) {
      newErrors.taxaJuros = 'Taxa inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calcularResultado = () => {
    if (!validateForm()) return;

    // Rastreamento do uso da calculadora
    if (window.clarity) {
      window.clarity('event', 'calculadora_usada', {
        tipo_credito: formData.tipoCredito,
        periodo: `${formData.mes}/${formData.ano}`,
        taxa_juros: formData.taxaJuros
      });
    }

    const periodo = `${formData.ano}-${formData.mes.padStart(2, '0')}`;
    const taxaUsuario = Number(formData.taxaJuros);
    
    const dadosPeriodo = dadosTaxas[formData.tipoCredito as keyof typeof dadosTaxas]?.[periodo];
    
    if (!dadosPeriodo) {
      setErrors({ geral: 'Dados não encontrados para o período selecionado' });
      return;
    }

    let tipoResultado: 'controlada' | 'melhoria' | 'oportunidade';
    
    // Lógica específica para consignado INSS (apenas 2 opções)
    if (formData.tipoCredito === 'consignado_inss') {
      if (taxaUsuario >= dadosPeriodo.abusiva) {
        tipoResultado = 'oportunidade';
      } else {
        tipoResultado = 'controlada';
      }
    } else {
      // Lógica para outros produtos (3 opções)
      if (taxaUsuario >= dadosPeriodo.abusiva) {
        tipoResultado = 'oportunidade';
      } else if (taxaUsuario >= dadosPeriodo.acima_media) {
        tipoResultado = 'melhoria';
      } else {
        tipoResultado = 'controlada';
      }
    }

    setResultado({
      tipo: tipoResultado,
      taxa: taxaUsuario,
      dados: dadosPeriodo,
      periodo: `${formData.mes}/${formData.ano}`
    });
  };

  const renderResultado = () => {
    if (!resultado) return null;

    const resultadoConfig = {
      controlada: {
        icon: <CheckCircle className="text-green-600" size={32} />,
        title: formData.tipoCredito === 'consignado_inss' ? '✅ SITUAÇÃO CONTROLADA' : '✅ SITUAÇÃO CONTROLADA',
        bgClass: 'result-controlled',
        textClass: 'text-green-800',
        message: formData.tipoCredito === 'consignado_inss' 
          ? `Sua taxa de ${resultado.taxa}% está dentro do valor definido pelo Conselho Nacional da Previdência Social (CNPS) para o período. Continue monitorando as oportunidades!`
          : `Sua taxa de ${resultado.taxa}% está dentro da faixa normal de mercado no período. Continue monitorando as oportunidades!`,
        showButton: false
      },
      melhoria: {
        icon: <AlertTriangle className="text-yellow-600" size={32} />,
        title: '⚠️ OPORTUNIDADE IDENTIFICADA',
        bgClass: 'result-improvement',
        textClass: 'text-yellow-800',
        message: `Sua taxa de ${resultado.taxa}% está acima da média de mercado no período, conforme dados oficiais do BANCO CENTRAL. Você poderá tentar reduzir suas taxas e o valor das suas parcelas.`,
        showButton: true
      },
      oportunidade: {
        icon: <XCircle className="text-red-600" size={32} />,
        title: '🚨 OPORTUNIDADE IDENTIFICADA',
        bgClass: 'result-opportunity',
        textClass: 'text-red-800',
        message: formData.tipoCredito === 'consignado_inss'
          ? `Sua taxa de ${resultado.taxa}% está acima do valor definido pelo Conselho Nacional da Previdência Social (CNPS) para o período da contratação. Você pode tentar a redução do valor das suas parcelas!`
          : `Sua taxa de ${resultado.taxa}% está muito acima da média de mercado no período, conforme dados oficiais do BANCO CENTRAL. Você poderá tentar reduzir suas taxas e o valor das suas parcelas.`,
        showButton: true
      }
    };

    const config = resultadoConfig[resultado.tipo];

    return (
      <div className={`result-card ${config.bgClass} animate-fade-in`}>
        <div className="flex items-center gap-3 mb-4">
          {config.icon}
          <h3 className={`font-poppins font-bold text-xl ${config.textClass}`}>
            {config.title}
          </h3>
        </div>
        
        <p className={`${config.textClass} mb-4 text-lg leading-relaxed`}>
          {config.message}
        </p>
        
        {config.showButton && (
          <button
            onClick={onConsultoriaClick}
            className="w-full bg-gradient-to-r from-secondary to-secondary-hover text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            🚀 SOLICITAR CONSULTORIA PERSONALIZADA
          </button>
        )}
      </div>
    );
  };

  return (
    <section id="calculadora" className="py-20 bg-light-custom">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-primary mb-6">
            🧮 CALCULE GRÁTIS: Seus juros estão acima da média?
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto mb-8">
            Descubra em 5 segundos se você está pagando juros acima da média de mercado, conforme dados oficiais do Banco Central. Não se esqueça: Quanto maiores os juros, mais altas as parcelas!
          
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-success">✓</span> Dados protegidos pela LGPD
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-success">✓</span> Sem compromisso de contratação
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-success">✓</span> Resposta imediata
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <CalcIcon className="text-secondary" size={32} />
              <h3 className="font-poppins font-bold text-2xl text-primary">
                Calculadora de Juros
              </h3>
            </div>

            {errors.geral && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {errors.geral}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tipo de Crédito *
                </label>
                <select
                  name="tipoCredito"
                  value={formData.tipoCredito}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                    errors.tipoCredito ? 'border-alert' : 'border-border-color'
                  }`}
                >
                  <option value="">Selecione o tipo de crédito</option>
                  {Object.entries(tiposCredito).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {errors.tipoCredito && <p className="text-alert text-sm mt-1">{errors.tipoCredito}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Mês *
                  </label>
                  <select
                    name="mes"
                    value={formData.mes}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                      errors.mes ? 'border-alert' : 'border-border-color'
                    }`}
                  >
                    <option value="">Mês</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                      <option key={mes} value={mes.toString()}>
                        {mes.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  {errors.mes && <p className="text-alert text-sm mt-1">{errors.mes}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Ano *
                  </label>
                  <select
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                      errors.ano ? 'border-alert' : 'border-border-color'
                    }`}
                  >
                    <option value="">Ano</option>
                    {Array.from({ length: 11 }, (_, i) => 2025 - i).map(ano => (
                      <option key={ano} value={ano.toString()}>
                        {ano}
                      </option>
                    ))}
                  </select>
                  {errors.ano && <p className="text-alert text-sm mt-1">{errors.ano}</p>}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Taxa de Juros Mensal (%) *
              </label>
              <input
                type="number"
                name="taxaJuros"
                value={formData.taxaJuros}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.taxaJuros ? 'border-alert' : 'border-border-color'
                }`}
                placeholder="Ex: 8.50"
              />
              {errors.taxaJuros && <p className="text-alert text-sm mt-1">{errors.taxaJuros}</p>}
              <p className="text-xs text-text-secondary mt-1">
                💡 Encontre essa informação no seu contrato, se trata de um valor percentual (%) seguido de "a.m" ou "ao mês".
              </p>
            </div>

            <button
              onClick={calcularResultado}
              className="w-full bg-gradient-to-r from-secondary to-secondary-hover text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mb-8"
            >
              <CalcIcon className="inline mr-2" size={20} />
              ANALISAR MEUS JUROS AGORA
            </button>

            {renderResultado()}
          </div>
        </div>
      </div>
    </section>
  );
}