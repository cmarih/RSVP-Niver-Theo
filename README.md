# RSVP Aniversário do Théo 🚀

Este projeto é um formulário de confirmação de presença para o aniversário do meu filho, com tema Astro Bot.

A ideia principal é usar este projeto para praticar React, construindo uma experiência simples para os convidados informarem se vão ou não à festa, e assim conseguir mensurar a quantidade de pessoas confirmadas.

## Objetivo

- Permitir que os convidados preencham nome e resposta de presença.
- Registrar quem vai comparecer e quantos acompanhantes irão.
- Registrar também quem não poderá ir.
- Exibir feedback visual após o envio da resposta.

## Funcionalidades implementadas

- Tela inicial com input de nome e escolha entre:
	- Confirmar presença
	- Não poderei ir
- Fluxo condicional:
	- Se confirmar presença, aparece campo de acompanhantes.
	- Se não puder ir, segue para tela de recusa.
- Tela de confirmação com botão para adicionar o evento na agenda.
- Layout responsivo para desktop e mobile.
- Identidade visual com tema Astro Bot.

## Stack técnica

- React
- Vite
- JavaScript (ESM)
- CSS modular por componente + estilos globais

## Estrutura principal

- src/App.jsx: controle de estado da aplicação e navegação entre telas
- src/Components/HomeScreen: formulário principal
- src/Components/ConfirmedScreen: retorno para presença confirmada
- src/Components/DeclinedScreen: retorno para ausência
- src/index.css: estilos globais e layout base

## Como rodar localmente

1. Instalar dependências:

	 npm install

2. Executar em desenvolvimento:

	 npm run dev

3. Gerar build de produção:

	 npm run build

## Próximos passos

- Disponibilizar o formulário em um servidor para os convidados responderem.
- Integrar com banco de dados para armazenar respostas em tempo real.
- Criar um painel simples para acompanhar:
	- total de confirmados
	- total de recusas
	- quantidade total de acompanhantes

## Observação

Este projeto tem foco de aprendizado prático em React, combinando lógica de formulário, estados condicionais, componentização e refinamento visual para um caso real.
