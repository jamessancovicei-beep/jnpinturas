# JN PINTURAS — Landing Page

Landing page institucional e comercial para a **JN Pinturas**, empresa de pintura
residencial. O objetivo principal do site é **gerar pedidos de orçamento pelo
WhatsApp**, com foco em visitantes vindos de anúncios do Instagram, Facebook e Google.

---

## 1. Identidade visual

| Token | Cor | Uso |
|---|---|---|
| `--white` | `#FFFFFF` | Fundos primários |
| `--black` | `#111111` | Textos, seção de diferenciais, rodapé |
| `--blue` | `#1646C8` | Cor de destaque, ícones, links, CTA |
| `--blue-dark` | `#10369B` | Gradientes de botões, hover, profundidade |
| `--gray` | `#F4F5F7` | Fundos secundários (cards, formulário, galeria) |

**Tipografia:** `Archivo` (display, títulos em caixa alta, pesos 800/900) e
`Manrope` (texto corrido), via Google Fonts.

**Logotipo (tipográfico):** quadrado arredondado com gradiente azul royal contendo as
iniciais **JN** em branco, seguido da palavra **PINTURAS** em letter-spacing amplo e do
subtítulo "Pintura residencial". O mesmo desenho aparece em `images/favicon.svg`.
Variantes: `.logo` (fundo claro) e `.logo-light` (rodapé escuro).

---

## 2. Estrutura da página (seções e IDs)

| # | Seção | Âncora | Conteúdo |
|---|---|---|---|
| 1 | Menu superior | `.site-header` | Logo, navegação (Início, Serviços, Nossos trabalhos, Diferenciais, Contato) e botão **Solicitar orçamento** |
| 2 | Banner principal (hero) | `#inicio` | Foto de sala recém-pintada, título "SUA CASA MERECE UMA NOVA PINTURA!", subtítulo, 2 CTAs e selo de confiança |
| 3 | Nossos serviços | `#servicos` | 6 cards com foto + botão de orçamento cada |
| 4 | Diferenciais | `#diferenciais` | Fundo escuro/azul royal, 6 ícones SVG, título "MAIS DO QUE PINTAR..." |
| 5 | Galeria de trabalhos | `#trabalhos` | Grade assimétrica com 6 fotos + aviso de imagens ilustrativas |
| 6 | Como funciona | `#como-funciona` | 4 etapas numeradas |
| 7 | Chamada para orçamento | `.cta-band` | Faixa azul royal em destaque |
| 8 | Contato | `#contato` | Dados da empresa + formulário que monta a mensagem do WhatsApp |
| 9 | Rodapé | `.site-footer` | Logo, descrição, navegação, serviços, contato e direitos |

Extras fixos: **botão flutuante de WhatsApp** (`.wa-float`, canto inferior direito,
visível em toda a navegação) e link "pular para o conteúdo" (`.skip-link`).

### Serviços listados
1. Pintura de apartamentos
2. Pintura de casas
3. Pintura de paredes e tetos
4. Massa corrida e preparação
5. Pintura de portas e batentes
6. Repintura e revitalização

### Diferenciais
Atendimento personalizado · Capricho em cada detalhe · Compromisso com prazos ·
Organização e limpeza · Materiais de qualidade · Excelente acabamento.

---

## 3. Integração com WhatsApp

- **Número:** `(19) 99575-0193` → link base `https://wa.me/5519995750193`
- **Todos** os botões de conversão (19 links no total) usam a classe `.wa-link` e o
  atributo `data-text` com a mensagem específica de cada origem.
- `js/main.js` → `initWhatsAppLinks()` monta o `href` final com
  `?text=` + `encodeURIComponent(mensagem)`, garantindo acentuação correta.
- Mensagens automáticas por origem do clique (10 mensagens distintas), por exemplo:
  - Botão principal / menu: _"Olá! Gostaria de solicitar um orçamento para pintura residencial."_
  - Card de apartamento: _"Olá! Tenho interesse em pintura de apartamento. Poderia me enviar um orçamento?"_
  - Card de massa corrida: _"Olá! Preciso de massa corrida e preparação de paredes. Gostaria de um orçamento."_
  - Contato geral: _"Olá! Gostaria de conhecer os serviços da JN PINTURAS."_

### Formulário de contato (`#quoteForm`)
Campos: **Nome**, **Telefone/WhatsApp** (com máscara `(00) 00000-0000`),
**Tipo de imóvel** (select) e **Serviço desejado** (textarea).

Validação no cliente: nome ≥ 2 caracteres, telefone com ≥ 10 dígitos, imóvel
selecionado e descrição ≥ 5 caracteres. Mensagens de erro acessíveis
(`role="alert"`, `aria-invalid`), foco no primeiro campo inválido.

Em caso de sucesso, o formulário abre o WhatsApp com:

```
Olá! Gostaria de solicitar um orçamento para pintura residencial.

Nome: <nome>
Telefone: <telefone>
Tipo de imóvel: <imóvel>
Serviço desejado: <descrição>
```

> Os dados **não** são gravados no site nem enviados a nenhum servidor — seguem
> apenas para o WhatsApp do cliente/empresa. Nenhum dado sensível é armazenado.

---

## 4. Estrutura de arquivos

```
index.html                 Página única (todas as seções + SEO + JSON-LD)
css/style.css              Estilos, tokens de cor, responsividade, animações
js/main.js                 Menu mobile, scrollspy, reveal, WhatsApp, formulário
images/
  favicon.svg              Logotipo JN
  hero-sala-pintada.jpg    Banner principal
  servico-apartamentos.jpg
  servico-casas.jpg
  servico-paredes-tetos.jpg
  servico-massa-corrida.jpg
  servico-portas-batentes.jpg
  servico-repintura.jpg
  galeria-sala.jpg
  galeria-quarto.jpg
  galeria-apartamento.jpg
  galeria-paredes.jpg
  galeria-sala-2.jpg
  galeria-fachada.jpg
```

---

## 5. Funcionalidades em JavaScript

| Função | Descrição |
|---|---|
| `initWhatsAppLinks()` | Injeta a URL do WhatsApp com mensagem codificada em todos os `.wa-link` |
| `initMenu()` | Drawer mobile com backdrop, trava de scroll, fechamento por ESC, clique fora, link interno e retorno ao desktop; devolve o foco ao botão |
| `initScrollUI()` | Sombra no cabeçalho ao rolar + *scrollspy* que marca o link da seção visível |
| `initReveal()` | Animações de entrada via `IntersectionObserver` (respeita `prefers-reduced-motion`) |
| `initForm()` | Máscara de telefone, validação, feedback e abertura do WhatsApp |
| `initYear()` | Atualiza o ano do rodapé automaticamente |

---

## 6. SEO e acessibilidade

- `<title>`, `meta description`, `meta keywords`, `canonical`, `robots`, `theme-color`.
- Open Graph e Twitter Card com imagem e descrição.
- JSON-LD `HomeAndConstructionBusiness` com telefone, área de atuação e catálogo de serviços.
- Hierarquia semântica: um único `<h1>`, `<section>` com IDs, `<nav>`, `<article>`, `<footer>`.
- `alt` descritivo em todas as imagens; textos apenas para leitores de tela em ícones.
- Foco visível (`:focus-visible`), skip-link, `aria-expanded`/`aria-controls` no menu.
- `prefers-reduced-motion` desativa animações; CSS de impressão oculta menu e botão flutuante.

---

## 7. Responsividade

Breakpoints: `1080px` (grids de 3 → 2 colunas), `900px` (menu drawer, hero
empilhado, contato em coluna única), `720px` (cards, features e etapas em coluna
única; galeria 2 colunas; botão flutuante compacto) e `400px` (ajustes do logo).

Verificado com medição real em viewport de **390px**: `scrollWidth == clientWidth
== 390`, sem overflow horizontal; drawer abre em `L55–R390` e fecha corretamente.
`html { overflow-x: clip }` isola o drawer posicionado fora da tela.

---

## 8. Substituir as imagens ilustrativas

A galeria e os cards usam fotografias de banco de imagens (licença livre).
**Não** há depoimentos nem fotos de serviços efetivamente realizados pela JN Pinturas.
Para trocar por fotos reais:

1. Substitua os arquivos em `images/` mantendo os mesmos nomes de arquivo
   (ou atualize os `src` no `index.html`), preferencialmente em `.jpg` com
   largura máxima de ~1400px e compressão otimizada.
2. Atualize o texto `alt` para descrever o trabalho real.
3. Ajuste as legendas `<figcaption>` da galeria.
4. Ao publicar fotos reais, remova o aviso "Imagens ilustrativas" em `.gallery-foot`.

---

## 9. Próximos passos sugeridos

- Publicar via **Hosted Deploy** (requer autorização explícita) e apontar o domínio próprio.
- Trocar as imagens ilustrativas por fotografias reais dos trabalhos.
- Incluir depoimentos reais (somente com autorização dos clientes).
- Adicionar endereço/região de atendimento quando definido, ampliando o SEO local.
- Instalar Google Analytics / Meta Pixel para medir conversões dos anúncios.
- Configurar evento de conversão no clique do WhatsApp (`dataLayer`).

---

## 10. Status

**Concluído:** identidade visual, 9 seções, integração WhatsApp em todos os CTAs,
formulário funcional com validação e máscara, menu responsivo, SEO básico,
galeria preparada para fotos reais, README.

**Pendente:** publicação (Hosted Deploy), imagens reais, depoimentos reais,
domínio, rastreamento de conversões.
