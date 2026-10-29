# Simulador de Juros Compostos

Uma aplicação simples, responsiva e educativa para projetar o crescimento de um investimento com juros compostos e aportes mensais. Foi feita em HTML, CSS e JavaScript puro, sem bibliotecas ou dependências externas.

## Origem e autoria

O arquivo [`prompt.txt`](./prompt.txt), enviado por mim pelo chat, foi usado como especificação do projeto. Ele descreve os campos de entrada, os resultados, a tabela mês a mês, o layout e os requisitos técnicos.

**O restante do projeto foi gerado por mim, assistente de IA usando Copilot SDK no VS Code:** a estrutura da página, os estilos, a lógica de cálculo, a tabela dinâmica e este README. As fontes de pesquisa utilizadas para orientar os cálculos estão listadas em [Referências](#referências).

## Arquivos do projeto

- [`index.html`](./index.html): estrutura da página, formulário, explicações, cartões de totais e tabela.
- [`style.css`](./style.css): cores, tipografia, espaçamentos, adaptação para telas menores e estados de foco.
- [`script.js`](./script.js): validação dos dados, conversão de taxa, cálculos, formatação monetária e criação dos resultados.
- [`prompt.txt`](./prompt.txt): solicitação original usada como especificação.

## Como abrir e usar

1. Abra a pasta `Simulador de Juros v1`.
2. Abra o arquivo `index.html` em um navegador atualizado. Não é necessário instalar dependências nem iniciar um servidor.
3. Informe o **valor inicial** que já será investido.
4. Digite a **taxa de juros** e escolha se ela é **ao mês** ou **ao ano (efetiva)**.
5. Informe o **período** e selecione a unidade em **meses** ou **anos**.
6. Preencha o **investimento mensal**. Se não pretende fazer aportes, informe `0`.
7. Clique em **Calcular resultado** para exibir os totais e a evolução mês a mês.
8. Clique em **Limpar** para apagar os dados e resultados e começar outra simulação.

O período deve ser um número inteiro e não pode ultrapassar 1.200 meses (100 anos). Os campos numéricos também limitam taxas, valores e períodos a intervalos razoáveis para a simulação.

## Como os cálculos funcionam

### Conversão da taxa

O cálculo é feito mês a mês. Uma taxa mensal é usada diretamente como taxa do período. Uma taxa anual informada como **efetiva** é convertida para sua taxa mensal equivalente:

```text
taxa mensal = (1 + taxa anual)^(1/12) - 1
```

As taxas devem ser digitadas em porcentagem; antes do cálculo, são convertidas para forma decimal. Por exemplo, `1` representa `1%`.

### Juros e aportes

Em cada mês, o simulador:

1. Calcula os juros sobre o saldo acumulado no início do mês.
2. Soma os juros ao saldo e aos juros acumulados.
3. Adiciona o aporte mensal ao saldo e ao total investido.
4. Guarda esses valores para montar a linha do mês na tabela.

Assim, cada aporte é considerado no fim do mês e começa a render no mês seguinte. O valor inicial, por estar aplicado desde o início, rende já no primeiro mês. Os valores do saldo e dos juros são arredondados para centavos a cada mês.

### Totais apresentados

- **Total investido:** valor inicial mais a soma dos aportes mensais.
- **Total em juros:** valor final menos o total investido.
- **Valor total final:** saldo após a aplicação dos juros e do último aporte.

Na tabela, **total investido** é o acumulado dos valores depositados até aquele mês; **juros acumulados** é a soma dos juros contabilizados; e **valor acumulado** é o saldo após os juros do mês e o aporte daquele mês.

### Exemplo

Com valor inicial de **R$ 1.000,00**, taxa de **1% ao mês**, período de **2 meses** e aporte mensal de **R$ 100,00**:

| Mês | Juros do mês | Total investido | Juros acumulados | Valor acumulado |
|---:|---:|---:|---:|---:|
| 1 | R$ 10,00 | R$ 1.100,00 | R$ 10,00 | R$ 1.110,00 |
| 2 | R$ 11,10 | R$ 1.200,00 | R$ 21,10 | R$ 1.221,10 |

Ao final, são **R$ 1.200,00 investidos**, **R$ 21,10 em juros** e **R$ 1.221,10 de valor final**.

## Pesquisa e referências

As referências consultadas explicam a capitalização dos juros e a conversão entre taxas efetivas:

- [Calculator.net — Compound Interest Calculator](https://www.calculator.net/compound-interest-calculator.html): juros sobre o principal e sobre os juros acumulados, períodos de capitalização e fórmulas.
- [Corporate Finance Institute — Effective Annual Interest Rate Calculator](https://corporatefinanceinstitute.com/resources/financial-modeling/effective-annual-interest-rate-calculator/): definição de taxa anual efetiva e conversão de taxas.

## Limitações

Esta ferramenta é uma estimativa educativa, não uma recomendação financeira nem uma garantia de rentabilidade. O resultado não considera impostos, tarifas, inflação, mudanças na taxa, datas específicas dos aportes ou regras particulares de produtos financeiros. Para uma taxa anual, o simulador assume que o valor informado é **efetivo**, e não nominal.
