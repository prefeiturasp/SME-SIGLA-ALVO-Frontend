/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// HELPER — REGEX TOLERANTE A ACENTUAÇÃO
// =====================================================

const escaparRegex = (texto) =>
  texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const criarRegex = (texto) =>
  new RegExp(
    escaparRegex(texto.trim())
      .replace(/ç|Ç/g, '[çc]')
      .replace(/ã|Ã/g, '[ãa]')
      .replace(/õ|Õ/g, '[õo]')
      .replace(/é|É/g, '[eé]')
      .replace(/í|Í/g, '[ií]')
      .replace(/ó|Ó/g, '[oó]')
      .replace(/ú|Ú/g, '[uú]')
      .replace(/â|Â/g, '[aâ]')
      .replace(/ê|Ê/g, '[eê]'),
    'i'
  )

// =====================================================
// SELETORES — CADASTRO DE CONCURSOS
// =====================================================
// Tela real: menu "Gerenciar" > "Cadastro de concursos" > "Adicionar concurso"
// (mapeada ao vivo em cypress/e2e/ui/adicionar_concurso.feature). Wizard de 3
// passos com URL própria por passo (.../adicionar/{id}/passo-1|2|3) — o id do
// concurso já é gerado ao avançar do passo 1 (a tela salva um rascunho).

const concursoSelectors = {
  menu: {
    itemGerenciar: () => cy.contains('span, div, strong, li', /^Gerenciar$/i, { timeout: 10000 }),
    itemCadastroConcursos: () =>
      cy.contains('span, div, li', /Cadastro de concursos/i, { timeout: 10000 })
  },

  codigoCargo: () => cy.get('.ant-select[name="cargos_ids"]', { timeout: 10000 }),
  status: () => cy.get('.ant-select[name="status"]', { timeout: 10000 }),

  vigenciaInicio: () => cy.get('input[name="vigencia"][date-range="start"]', { timeout: 10000 }),
  vigenciaFim: () => cy.get('input[name="vigencia"][date-range="end"]', { timeout: 10000 })
}

// Pool de nomes para o cenário de cadastro — "Nome do concurso" não tem
// constraint de unicidade no backend (confirmado ao vivo: a listagem já tinha
// mais de um concurso com o mesmo nome), mas sortear entre alguns nomes evita
// que toda execução crie mais um registro idêntico "Novo Rumo" na listagem
// real de QA, o que dificultava achar o resultado de uma execução específica.
const nomesConcursoPool = [
  'Novo Rumo',
  'Trilha Educacional',
  'Caminho do Saber',
  'Horizonte Pedagógico',
  'Vocação Docente'
]

// Guarda o nome sorteado nesta execução para a asserção final (na listagem)
// conferir o mesmo valor que foi de fato preenchido no formulário.
let ultimoNomeConcursoGerado = ''

// Guarda o Processo SEI gerado nesta execução para o cenário de duplicidade
// reutilizar o mesmo valor numa segunda tentativa de cadastro.
let ultimoNumeroProcessoGerado = ''

// =====================================================
// HELPER — PREENCHIMENTO GENÉRICO POR LABEL
// =====================================================
// A tela usa Ant Design de forma consistente (mesmo padrão do resto do
// projeto): cada campo é um .ant-form-item com <label> + input/textarea/
// .ant-picker/.ant-input-number dentro. Em vez de mapear um seletor fixo por
// campo (12 campos entre os passos 2 e 3), detecta o tipo de widget pelo
// conteúdo do .ant-form-item e aplica a interação correta — mesma estratégia
// de preencherCampoPorLabel em nova_convocacao_steps.js.
//
// Datas (.ant-picker) precisam de {enter} depois de digitar para o Ant Design
// commitar o valor (confirmado ao vivo: sem o {enter} o valor fica só no
// input visual, sem refletir no estado do formulário) — texto puro/número
// (input) e Retificações (textarea) não têm esse requisito.
const preencherCampoConcurso = (campo, valor) => {
  const regex = criarRegex(campo)
  cy.contains('label', regex, { timeout: 10000 })
    .should('be.visible')
    .closest('.ant-form-item')
    .then(($item) => {
      if ($item.find('.ant-picker').length > 0) {
        cy.wrap($item)
          .find('.ant-picker input')
          .click({ force: true })
          .clear({ force: true })
          .type(valor, { force: true, delay: 60 })
          .type('{enter}', { force: true })
        cy.wait(500)
      } else if ($item.find('textarea').length > 0) {
        cy.wrap($item)
          .find('textarea')
          .clear({ force: true })
          .type(valor, { force: true, delay: 40 })
      } else {
        cy.wrap($item)
          .find('input')
          .first()
          .clear({ force: true })
          .type(valor, { force: true, delay: 40 })
      }
    })
}

// =====================================================
// STEPS — NAVEGAÇÃO E LISTAGEM
// =====================================================

When('acesso a tela de cadastro de concursos', () => {
  concursoSelectors.menu.itemGerenciar().should('be.visible').click({ force: true })
  cy.wait(500)
  concursoSelectors.menu.itemCadastroConcursos().should('be.visible').click({ force: true })
  cy.wait(1000)
})

Then('o sistema exibe a listagem de concursos', () => {
  cy.url({ timeout: 15000 }).should('include', '/gerenciar/concursos')
  cy.contains(/Cadastro de concursos/i, { timeout: 10000 }).should('be.visible')
  cy.get('table', { timeout: 10000 }).should('be.visible')
})

Then('exibe o botão {string} no cadastro de concursos', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 8000 }).should('be.visible')
})

// =====================================================
// STEPS — AÇÕES GENÉRICAS DO WIZARD
// =====================================================
// "Adicionar concurso" nomeia dois botões diferentes conforme a tela (o "+"
// da listagem e o botão de submissão final do passo 3) — só um está visível
// por vez, então o mesmo step resolve corretamente em ambos os contextos.

When('clico em {string} no cadastro de concurso', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 10000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click({ force: true })
  cy.wait(1000)
})

Then('o sistema exibe a etapa {string} do cadastro de concurso', (titulo) => {
  cy.contains('h4', criarRegex(titulo), { timeout: 15000 }).should('be.visible')
})

Then('valida a existência dos campos do concurso:', (dataTable) => {
  const campos = dataTable.raw().flat().filter(Boolean)
  campos.forEach((campo) => {
    cy.contains('label', criarRegex(campo), { timeout: 10000 }).should('be.visible')
  })
})

// A tela desabilita o botão "Próximo" via atributo disabled do Ant Design
// enquanto o formulário do passo não é válido — não exibe mensagens de erro
// por campo como em outras telas do sistema (ex.: Nova convocação).
Then('o botão {string} permanece desabilitado no cadastro de concurso', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 10000 }).should('be.disabled')
})

// =====================================================
// STEPS — PASSO 1: IDENTIFICAÇÃO DO CONCURSO
// =====================================================

When('seleciono o código do cargo {string}', (codigo) => {
  cy.selecionarOpcaoAntd(concursoSelectors.codigoCargo, codigo)
})

When('seleciono o status do concurso {string}', (status) => {
  cy.selecionarOpcaoAntd(concursoSelectors.status, status)
})

When('preencho o campo {string} do concurso com {string}', (campo, valor) => {
  preencherCampoConcurso(campo, valor)
})

When('preencho o Nome do concurso com um nome aleatório da lista', () => {
  const nome = nomesConcursoPool[Math.floor(Math.random() * nomesConcursoPool.length)]
  ultimoNomeConcursoGerado = nome
  preencherCampoConcurso('Nome do concurso', nome)
})

// numero_processo (campo "Processo SEI") tem constraint de unicidade no
// backend — confirmado ao vivo: reenviar um valor já usado responde
// POST /concursos/ com 400 "Este número de processo já está cadastrado",
// e o cenário não limpa o concurso criado depois. Mesmo problema já
// resolvido em api_concurso_sigla_steps.js para o mesmo campo — gera um
// valor novo a cada execução em vez de manter uma lista fixa (que
// esgotaria e voltaria a quebrar depois de N execuções).
When('preencho o Processo SEI do concurso com um número único gerado automaticamente', () => {
  const numeroUnico = String(Date.now()).slice(-9)
  ultimoNumeroProcessoGerado = numeroUnico
  preencherCampoConcurso('Processo SEI', numeroUnico)
})

// Cenário de duplicidade: reaproveita o número gerado na primeira tentativa
// desta execução para forçar a resposta 400 "Este número de processo já está
// cadastrado" na segunda tentativa (constraint de unicidade do backend).
When('preencho o Processo SEI do concurso com o mesmo número já utilizado nesta execução', () => {
  preencherCampoConcurso('Processo SEI', ultimoNumeroProcessoGerado)
})

// =====================================================
// STEPS — PASSOS 2 E 3: CAMPOS EM TABELA
// =====================================================

When('preencho os campos do concurso:', (dataTable) => {
  dataTable.raw().forEach(([campo, valor]) => {
    preencherCampoConcurso(campo, valor)
  })
})

// "Vigência do concurso" é um único range picker (dois inputs com o mesmo
// name="vigencia", diferenciados pelo atributo date-range="start"/"end") —
// não um par de campos "Vigência Inicial"/"Vigência Final" independentes.
When('seleciono a vigência do concurso de {string} a {string}', (inicio, fim) => {
  concursoSelectors
    .vigenciaInicio()
    .click({ force: true })
    .clear({ force: true })
    .type(inicio, { force: true, delay: 60 })
    .type('{enter}', { force: true })
  cy.wait(500)

  concursoSelectors
    .vigenciaFim()
    .click({ force: true })
    .clear({ force: true })
    .type(fim, { force: true, delay: 60 })
    .type('{enter}', { force: true })
  cy.wait(500)
})

// =====================================================
// STEPS — CONFIRMAÇÃO
// =====================================================

Then('o sistema exibe uma mensagem de sucesso no cadastro de concurso', () => {
  cy.contains(/salvas? com sucesso/i, { timeout: 15000 }).should('be.visible')
})

// numero_processo tem constraint de unicidade no backend (ver comentário do
// step "preencho o Processo SEI... automaticamente") — resposta 400 da API
// vira toast de erro exibido pelo Ant Design.
Then('o sistema exibe uma mensagem de erro de Processo SEI já cadastrado', () => {
  cy.contains(/processo.*j[aá].*cadastrad|n[uú]mero.*j[aá].*(existe|cadastrad|utilizad)/i, { timeout: 15000 }).should('be.visible')
})

Then('apresenta o concurso cadastrado na listagem de concursos', () => {
  cy.url({ timeout: 15000 }).should('include', '/gerenciar/concursos')
  cy.contains('table td', ultimoNomeConcursoGerado, { timeout: 10000 }).should('be.visible')
})
