````markdown
# SME-COGEP FrontEnd

Frontend do sistema de gestão de convocação de servidores públicos da Secretaria Municipal de Educação de São Paulo.

Este projeto é desenvolvido em **React.js com Vite**, e integra os microsserviços da plataforma SME-COGEP via APIs REST.

---

## 🚀 Tecnologias

- [React.js](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint (configuração moderna com Flat Config)
- Babel

---

## 🛠️ Instalação e uso

1. Clone o repositório:

```bash
git clone https://github.com/prefeiturasp/SME-COGEP-FrontEnd.git
cd SME-COGEP-FrontEnd
````

2. Instale as dependências:

```bash
npm install
```

3. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## ✅ Scripts disponíveis

| Comando                  | Descrição                                      |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Inicia o projeto em modo desenvolvimento       |
| `npm run build`          | Gera os arquivos para produção (pasta `/dist`) |
| `npm run preview`        | Visualiza o build localmente                   |
| `npm run lint`           | Executa o ESLint                               |
| `npm run test`           | Roda os testes com Jest                        |
| `npm test -- --coverage` | Roda os testes com relatório de cobertura      |

---

## 🧪 Estrutura de testes

Os testes são escritos com **Jest** e organizados por componente, seguindo a estrutura:

```
src/
  components/
    MeuComponente/
      index.jsx
      __tests__/
        MeuComponente.test.jsx
```

---

## 📁 Estrutura de diretórios (em construção)

```
src/
├── assets/            # Imagens, ícones
├── components/        # Componentes reutilizáveis
├── pages/             # Páginas principais
├── routes/            # Definições de rotas
├── services/          # Integração com APIs
├── hooks/             # Custom Hooks
├── styles/            # Estilos globais
├── App.jsx            # Componente raiz
└── main.jsx           # Ponto de entrada
```

---

## 📌 Observações

* Este projeto é parte do sistema completo SME-COGEP, que inclui múltiplos microsserviços em Python/FastAPI.
* As credenciais de acesso às APIs são protegidas e dependem da infraestrutura da SME.

```

---

