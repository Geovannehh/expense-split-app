# Divisão de Despesas (React Native + Expo)

App do desafio **"Divisão de despesas"** (trilha React Native, Rocketseat), conectado à
[API oficial do desafio](https://github.com/rocketseat-education/swift-expense-split-api)
(Swift/Vapor).

## Funcionalidades

- **Autenticação**: criar conta (`/users/sign-up`) e login (`/users/sign-in`), com sessão
  persistida (token JWT + dados do usuário via AsyncStorage).
- **Atividades**: criar, listar, ver detalhes, editar e excluir.
- **Despesas**: criar, listar, editar e excluir, dentro de uma atividade, com seleção de
  participantes para divisão.
- **Participantes**: listar/adicionar por atividade, e uma aba "Pessoas" que agrega todos os
  participantes com quem o usuário já dividiu despesas em qualquer atividade.
- **Resumo**: saldo global (quanto você deve / quanto te devem) e lista de atividades.

## Stack

- Expo + React Native + TypeScript
- React Navigation (stack + bottom tabs)
- AsyncStorage para persistência de sessão
- `fetch` puro para consumo da API (sem libs extras de HTTP)

## Como rodar

```bash
npm install
npx expo start
```

Abra no Expo Go (Android/iOS) ou em um emulador.

## Configuração da API

A URL base fica em `src/api/client.ts`:

```ts
export const API_BASE_URL = 'https://expense-split-api-test.onrender.com/api/v1';
```

Troque para `http://localhost:8080/api/v1` se estiver rodando a API localmente via Docker
(veja o README da API), ou para sua própria instância publicada.

## Estrutura

```
src/
  api/          -> client HTTP + funções por recurso (auth, activities, expenses, participants, balance)
  contexts/      -> AuthContext (sessão do usuário)
  navigation/    -> stacks e tabs
  screens/       -> telas (SignIn, SignUp, Activities, Expenses, Participants, Summary)
  components/    -> Button, Input, cards, estados vazios/loading
  theme/         -> cores, espaçamentos, tipografia
  utils/         -> storage (AsyncStorage) e formatação (moeda/data)
```

## Observação sobre o layout

O Figma do desafio está protegido por login e não pôde ser acessado automaticamente para
extrair cores/medidas exatas. A interface aqui segue a **paleta roxa sobre fundo escuro**
característica da Rocketseat e a estrutura de telas descrita no desafio (login → lista de
atividades → detalhe/edição → despesas → participantes → resumo). Ajuste cores, espaçamentos
e componentes em `src/theme` para bater 1:1 com o protótipo.

## Próximos passos sugeridos

- Definir/editar o pagador de uma despesa (`PUT /expenses/:id/payer`) e marcar pagamentos
  (`POST /expenses/:id/payments`) — endpoints já mapeados em `src/api/expenses.ts`, faltam
  telas dedicadas.
- Tela de saldo detalhado entre dois usuários (`/balance/between/:userId1/:userId2`).
- Ajustar fino de UI para bater com o Figma (ícones, ilustrações, animações do vídeo de
  referência do desafio).
