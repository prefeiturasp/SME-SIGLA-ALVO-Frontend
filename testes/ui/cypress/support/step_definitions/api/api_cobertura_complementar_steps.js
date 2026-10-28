/// <reference types="cypress" />

import { Given, When, Then, After } from '@badeball/cypress-cucumber-preprocessor'

// Steps de api_sigla.feature (cobertura complementar dos microsserviços).
// Organizados por microsserviço; ao incluir cenários de outro microsserviço,
// adicionar uma nova seção e, se ele criar dados, registrá-los no After.

const CARGO_DIRETOR_UUID = '7c74d239-bdf4-4d83-a457-7cfb3920c34c'
const UUID_INEXISTENTE = '00000000-0000-0000-0000-000000000000'

const concursosUrl = (path = '') => {
  const baseUrl = Cypress.env('CONCURSO_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
  return `${baseUrl}/ms-processos-concursos/api/v1${path}`
}

// Registros criados pelos steps deste arquivo. O After abaixo exclui o que
// sobrar ao fim de cada cenário (inclusive quando ele falha no meio), para
// não acumular massa de teste na QA.
let concursosCriados = []
let autorizacoesCriadas = []

After({ tags: '@cobertura_complementar_sigla' }, () => {
  concursosCriados.forEach((uuid) => cy.concurso_delete(concursosUrl(`/concursos/${uuid}/`)))
  autorizacoesCriadas.forEach((uuid) => cy.concurso_delete(concursosUrl(`/autorizacoes-publicadas/${uuid}/`)))
  concursosCriados = []
  autorizacoesCriadas = []
})

// numero_processo e codigo são únicos no backend; o sufixo aleatório evita
// colisão entre cenários que rodam no mesmo milissegundo.
const identificadorUnico = () => (Date.now() % 1000000) * 10 + Math.floor(Math.random() * 10)

const payloadConcurso = (sobrescrever = {}) => {
  const unico = identificadorUnico()
  return {
    nome: `CONCURSO TESTE AUTOMACAO ${unico}`,
    cargos_ids: [CARGO_DIRETOR_UUID],
    numero_processo: String(unico),
    codigo: unico,
    ...sobrescrever,
  }
}

// Valores da tabela chegam como texto; números e booleanos são convertidos
// para o tipo JSON correspondente, o resto segue como string.
const valorDaTabela = (valor) => {
  try {
    return JSON.parse(valor)
  } catch (e) {
    return valor
  }
}

const tabelaParaObjeto = (dataTable) =>
  Object.fromEntries(dataTable.rawTable.slice(1).map(([campo, valor]) => [campo, valorDaTabela(valor)]))

const registrosDaResposta = (body) => (Array.isArray(body) ? body : body.results || [])

const normalizarParaOrdenacao = (texto) =>
  String(texto)
    .normalize('NFD')
    .replace(/[^0-9A-Za-z]/g, '')
    .toLowerCase()

const criarConcurso = (payload) =>
  cy.concurso_post(concursosUrl('/concursos/'), payload).then((res) => {
    if (res.status === 201 && res.body.uuid) {
      concursosCriados.push(res.body.uuid)
    }
    return res
  })

// Contexto

Given('que as APIs do SIGLA estão acessíveis', () => {
  const baseUrl = Cypress.env('CONCURSO_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
  Cypress.log({ name: 'SIGLA API', message: `Base URL: ${baseUrl} — sem autenticação` })
})

// ms-processos-concursos: concurso

Given('que tenho um concurso CONCURSO de teste criado', () => {
  criarConcurso(payloadConcurso()).then((res) => {
    expect(res.status, 'Setup: criar concurso deve retornar 201').to.eq(201)
    cy.wrap(res.body.uuid).as('concursoUuid')
    cy.wrap(res.body).as('concursoCriado')
    cy.wrap(res).as('response')
  })
})

When('eu atualizo parcialmente o concurso CONCURSO criado com:', (dataTable) => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_patch(concursosUrl(`/concursos/${uuid}/`), tabelaParaObjeto(dataTable)).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu atualizo o concurso CONCURSO criado via PUT com o nome {string}', (nome) => {
  cy.get('@concursoCriado').then((concurso) => {
    const payload = {
      nome,
      cargos_ids: concurso.cargos.map((c) => c.uuid),
      numero_processo: concurso.numero_processo,
      codigo: concurso.codigo,
    }
    cy.concurso_put(concursosUrl(`/concursos/${concurso.uuid}/`), payload).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu atualizo o concurso CONCURSO criado via PUT com body vazio', () => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_put(concursosUrl(`/concursos/${uuid}/`), {}).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu atualizo a situação do concurso CONCURSO criado para {string}', (situacao) => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_patch(concursosUrl(`/concursos/${uuid}/atualizar-situacao/`), { situacao }).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu atualizo a situação do concurso CONCURSO criado sem informar a situação', () => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_patch(concursosUrl(`/concursos/${uuid}/atualizar-situacao/`), {}).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu excluo o concurso CONCURSO criado', () => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_delete(concursosUrl(`/concursos/${uuid}/`)).then((res) => {
      cy.wrap(res).as('response')
      if (res.status === 204) {
        concursosCriados = concursosCriados.filter((u) => u !== uuid)
      }
    })
  })
})

When('eu crio um concurso CONCURSO com o mesmo número de processo do concurso criado', () => {
  cy.get('@concursoCriado').then((concurso) => {
    const payload = payloadConcurso({ numero_processo: concurso.numero_processo })
    criarConcurso(payload).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu crio um concurso CONCURSO sem número de processo', () => {
  const { numero_processo, ...payload } = payloadConcurso()
  criarConcurso(payload).then((res) => {
    cy.wrap(res).as('response')
  })
})

When('eu crio um concurso CONCURSO com cargo inexistente', () => {
  criarConcurso(payloadConcurso({ cargos_ids: [UUID_INEXISTENTE] })).then((res) => {
    cy.wrap(res).as('response')
  })
})

When('eu faço uma requisição CONCURSO de método {string} para {string}', (method, url) => {
  cy.concurso_request(method, url).then((res) => {
    cy.wrap(res).as('response')
  })
})

Then('ao consultar o concurso CONCURSO criado o campo {string} deve ser {string}', (campo, valor) => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_get(concursosUrl(`/concursos/${uuid}/`)).then((res) => {
      expect(res.status).to.eq(200)
      expect(String(res.body[campo]), `Campo "${campo}" persistido`).to.eq(valor)
    })
  })
})

Then('o campo atualizado_em do concurso CONCURSO deve ser posterior ao da criação', () => {
  cy.get('@concursoCriado').then((criado) => {
    cy.get('@response').then((res) => {
      expect(res.body.criado_em, 'criado_em não deve mudar').to.eq(criado.criado_em)
      expect(new Date(res.body.atualizado_em).getTime()).to.be.greaterThan(new Date(criado.atualizado_em).getTime())
    })
  })
})

Then('o concurso CONCURSO criado não deve mais existir', () => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_get(concursosUrl(`/concursos/${uuid}/`)).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

Then('o concurso CONCURSO criado deve ser localizado pelo filtro {string}', (filtro) => {
  cy.get('@concursoUuid').then((uuid) => {
    cy.concurso_get(concursosUrl(`/concursos/${uuid}/`)).then((atual) => {
      const valor = encodeURIComponent(atual.body[filtro])
      cy.concurso_get(concursosUrl(`/concursos/?${filtro}=${valor}`)).then((res) => {
        expect(res.status).to.eq(200)
        const encontrado = res.body.results.some((c) => c.uuid === uuid)
        expect(encontrado, `Concurso ${uuid} deve aparecer ao filtrar por ${filtro}`).to.be.true
      })
    })
  })
})

Then('o concurso CONCURSO criado deve ser localizado pela situação {string}', (situacao) => {
  cy.get('@concursoCriado').then((concurso) => {
    const url = concursosUrl(`/concursos/?situacao=${situacao}&numero_processo=${concurso.numero_processo}`)
    cy.concurso_get(url).then((res) => {
      expect(res.status).to.eq(200)
      const encontrado = res.body.results.some((c) => c.uuid === concurso.uuid)
      expect(encontrado, `Concurso ${concurso.uuid} deve aparecer com situação ${situacao}`).to.be.true
    })
  })
})

// ms-processos-concursos: autorização publicada

Given('que tenho uma autorização CONCURSO de teste criada', () => {
  const payload = {
    cargo: CARGO_DIRETOR_UUID,
    autorizacoes: 100,
    data_autorizacao: '2026-06-01',
    observacao: 'Autorização criada por teste automatizado',
  }
  cy.concurso_post(concursosUrl('/autorizacoes-publicadas/'), payload).then((res) => {
    expect(res.status, 'Setup: criar autorização deve retornar 201').to.eq(201)
    autorizacoesCriadas.push(res.body.uuid)
    cy.wrap(res.body.uuid).as('autorizacaoUuid')
    cy.wrap(res.body).as('autorizacaoCriada')
  })
})

When('eu atualizo parcialmente a autorização CONCURSO criada com:', (dataTable) => {
  cy.get('@autorizacaoUuid').then((uuid) => {
    cy.concurso_patch(concursosUrl(`/autorizacoes-publicadas/${uuid}/`), tabelaParaObjeto(dataTable)).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu atualizo a autorização CONCURSO criada via PUT com:', (dataTable) => {
  cy.get('@autorizacaoCriada').then((autorizacao) => {
    const payload = { cargo: autorizacao.cargo, ...tabelaParaObjeto(dataTable) }
    cy.concurso_put(concursosUrl(`/autorizacoes-publicadas/${autorizacao.uuid}/`), payload).then((res) => {
      cy.wrap(res).as('response')
    })
  })
})

When('eu excluo a autorização CONCURSO criada', () => {
  cy.get('@autorizacaoUuid').then((uuid) => {
    cy.concurso_delete(concursosUrl(`/autorizacoes-publicadas/${uuid}/`)).then((res) => {
      cy.wrap(res).as('response')
      if (res.status === 204) {
        autorizacoesCriadas = autorizacoesCriadas.filter((u) => u !== uuid)
      }
    })
  })
})

When('eu crio uma autorização CONCURSO sem cargo', () => {
  const payload = { autorizacoes: 10, data_autorizacao: '2026-06-01' }
  cy.concurso_post(concursosUrl('/autorizacoes-publicadas/'), payload).then((res) => {
    if (res.status === 201 && res.body.uuid) {
      autorizacoesCriadas.push(res.body.uuid)
    }
    cy.wrap(res).as('response')
  })
})

Then('ao consultar a autorização CONCURSO criada o campo {string} deve ser {string}', (campo, valor) => {
  cy.get('@autorizacaoUuid').then((uuid) => {
    cy.concurso_get(concursosUrl(`/autorizacoes-publicadas/${uuid}/`)).then((res) => {
      expect(res.status).to.eq(200)
      expect(String(res.body[campo]), `Campo "${campo}" persistido`).to.eq(valor)
    })
  })
})

Then('a autorização CONCURSO criada não deve mais existir', () => {
  cy.get('@autorizacaoUuid').then((uuid) => {
    cy.concurso_get(concursosUrl(`/autorizacoes-publicadas/${uuid}/`)).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

// Assertivas de conteúdo

Then('a resposta CONCURSO deve ter o campo {string} igual a {string}', (campo, valor) => {
  cy.get('@response').then((res) => {
    expect(String(res.body[campo]), `Campo "${campo}"`).to.eq(valor)
  })
})

Then('a resposta CONCURSO deve ter os campos:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map(([campo]) => campo)
  cy.get('@response').then((res) => {
    campos.forEach((campo) => expect(res.body, `Campo "${campo}"`).to.have.property(campo))
  })
})

Then('cada registro CONCURSO retornado deve ter os campos:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map(([campo]) => campo)
  cy.get('@response').then((res) => {
    const registros = registrosDaResposta(res.body)
    expect(registros, 'Lista de registros').to.not.be.empty
    registros.forEach((registro) => {
      campos.forEach((campo) => expect(registro, `Campo "${campo}" em ${registro.uuid}`).to.have.property(campo))
    })
  })
})

Then('todos os registros CONCURSO retornados devem ter o campo {string} igual a {string}', (campo, valor) => {
  cy.get('@response').then((res) => {
    registrosDaResposta(res.body).forEach((registro) => {
      expect(String(registro[campo]), `Campo "${campo}" em ${registro.uuid}`).to.eq(valor)
    })
  })
})

Then('todos os registros CONCURSO retornados devem ter o campo {string} entre {string}', (campo, valores) => {
  const permitidos = valores.split(',').map((v) => v.trim())
  cy.get('@response').then((res) => {
    registrosDaResposta(res.body).forEach((registro) => {
      expect(permitidos, `Campo "${campo}" em ${registro.uuid}`).to.include(String(registro[campo]))
    })
  })
})

Then('a lista de resultados CONCURSO deve estar vazia', () => {
  cy.get('@response').then((res) => {
    expect(registrosDaResposta(res.body)).to.be.empty
    if (res.body.count !== undefined) {
      expect(res.body.count).to.eq(0)
    }
  })
})

Then('a mensagem de erro CONCURSO do campo {string} deve ser {string}', (campo, mensagem) => {
  cy.get('@response').then((res) => {
    expect(res.body, `Erro do campo "${campo}"`).to.have.property(campo)
    expect(res.body[campo]).to.include(mensagem)
  })
})

Then('a listagem CONCURSO deve seguir o contrato de paginação com {int} itens por página', (tamanho) => {
  cy.get('@response').then((res) => {
    expect(res.body).to.have.all.keys('links', 'count', 'page', 'page_size', 'results')
    expect(res.body.links).to.have.all.keys('next', 'previous')
    expect(res.body.page_size).to.eq(tamanho)
    expect(res.body.results.length).to.be.at.most(tamanho)
    if (res.body.count > tamanho * res.body.page) {
      expect(res.body.links.next, 'Deve haver link para a próxima página').to.be.a('string')
    }
  })
})

Then('os registros CONCURSO devem estar ordenados por {string} em ordem {string}', (campo, ordem) => {
  // Compara ignorando caixa, acentos e pontuação, como faz a collation do banco.
  cy.get('@response').then((res) => {
    const valores = registrosDaResposta(res.body).map((r) => normalizarParaOrdenacao(r[campo]))
    const esperado = [...valores].sort()
    if (ordem === 'decrescente') {
      esperado.reverse()
    }
    expect(valores, `Ordenação ${ordem} por ${campo}`).to.deep.eq(esperado)
  })
})
