import React, { useState } from 'react';
import { X, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Declaração global do Clarity
declare global {
  interface Window {
    clarity: (event: string, name: string, properties?: any) => void;
  }
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cidade: '',
    situacao: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rastreamento da abertura do modal
  React.useEffect(() => {
    if (isOpen && window.clarity) {
      window.clarity('event', 'modal_consultoria_aberto', {});
    }
  }, [isOpen]);

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (match, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`;
        if (p2) return `(${p1}) ${p2}`;
        if (p1) return `(${p1}`;
        return numbers;
      });
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp') {
      setFormData(prev => ({
        ...prev,
        [name]: formatWhatsApp(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp é obrigatório';
    if (formData.whatsapp.replace(/\D/g, '').length < 10) newErrors.whatsapp = 'WhatsApp inválido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Rastreamento do envio do formulário
      if (window.clarity) {
        window.clarity('event', 'formulario_consultoria_enviado', {
          nome: formData.nome,
          cidade: formData.cidade,
          tem_situacao: formData.situacao.length > 0
        });
      }

      // Salvar dados no Supabase
      const { error } = await supabase
        .from('juros_justos')
        .insert([
          {
            nome_completo: formData.nome,
            whatsapp: formData.whatsapp.replace(/\D/g, ''), // Remove formatação
            email: formData.email,
            cidade_estado: formData.cidade,
            descricao_situacao: formData.situacao
          }
        ]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
      }
      
      alert('✅ Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.');
      onClose();
      setFormData({ nome: '', email: '', whatsapp: '', cidade: '', situacao: '' });
    } catch (error) {
      console.error('Erro no envio:', error);
      alert('❌ Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <h3 className="text-white text-xl font-bold mb-2">Solicitar Consultoria Personalizada</h3>
          <p className="text-white text-sm opacity-90">
            Preencha os dados abaixo e nossa equipe entrará em contato
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                errors.nome ? 'border-alert' : 'border-border-color'
              }`}
              placeholder="Digite seu nome completo"
            />
            {errors.nome && <p className="text-alert text-sm mt-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                errors.email ? 'border-alert' : 'border-border-color'
              }`}
              placeholder="seuemail@exemplo.com"
            />
            {errors.email && <p className="text-alert text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              WhatsApp *
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                errors.whatsapp ? 'border-alert' : 'border-border-color'
              }`}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
            {errors.whatsapp && <p className="text-alert text-sm mt-1">{errors.whatsapp}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cidade/Estado
            </label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder="Ex: São Paulo/SP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descreva a sua situação informando o tipo de empréstimo, a data de contratação e os juros mensais. Essas informações nos ajudarão a aprimorar nossa análise.
            </label>
            <textarea
              name="situacao"
              value={formData.situacao}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
              placeholder="Ex: Tenho um empréstimo com taxa alta e gostaria de renegociar..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-secondary to-secondary-hover text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <Rocket size={20} />
            {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR CONSULTORIA AGORA'}
          </button>
        </form>
      </div>
    </div>
  );
}