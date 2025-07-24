# Juros Justos - Landing Page com Calculadora

Landing page para consultoria de juros com calculadora integrada e sistema de leads.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **Supabase** para banco de dados
- **Microsoft Clarity** para analytics
- **Lucide React** para ícones

## 📦 Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy no Netlify

### Via GitHub (Recomendado)

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "Deploy inicial"
   git push origin main
   ```

2. **Conectar no Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub
   - Configure:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Node version:** `18`

3. **Variáveis de Ambiente:**
   No painel do Netlify, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Configurações Automáticas

O projeto inclui:
- `netlify.toml` - Configurações de build e redirects
- `public/_redirects` - Fallback para SPA
- `.gitignore` - Arquivos ignorados pelo Git

## 🗄️ Banco de Dados

### Estrutura da Tabela `juros_justos`

```sql
CREATE TABLE juros_justos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo varchar(255) NOT NULL,
  whatsapp varchar(20) NOT NULL,
  email varchar(255) NOT NULL,
  cidade_estado varchar(255) NOT NULL,
  descricao_situacao text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 📊 Analytics

- **Microsoft Clarity** integrado
- Eventos rastreados:
  - Uso da calculadora
  - Abertura do modal
  - Envio de formulário
  - Scroll 50% da página

## 🔧 Troubleshooting

### Página em Branco no Netlify

1. Verifique se o build está funcionando localmente:
   ```bash
   npm run build
   npm run preview
   ```

2. Confirme as configurações no Netlify:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. Verifique os logs de build no painel do Netlify

### Problemas de Roteamento

- O arquivo `_redirects` garante que todas as rotas redirecionem para `index.html`
- Para SPAs React, isso é essencial

## 📝 Estrutura do Projeto

```
src/
├── components/
│   ├── Calculator.tsx    # Calculadora de juros
│   └── Modal.tsx        # Modal de consultoria
├── data/
│   └── taxas.ts         # Dados das taxas do BACEN
├── lib/
│   └── supabase.ts      # Configuração do Supabase
├── App.tsx              # Componente principal
├── main.tsx             # Entry point
└── index.css            # Estilos globais
```

## 🎯 Funcionalidades

- ✅ Calculadora de juros baseada em dados do BACEN
- ✅ Sistema de leads integrado com Supabase
- ✅ Analytics com Microsoft Clarity
- ✅ Design responsivo
- ✅ Formulário de contato
- ✅ Validação de dados
- ✅ Deploy automatizado