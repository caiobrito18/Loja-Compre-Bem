# Aula 13: Responsividade com Flexbox

Versão final das correções demonstradas em aula, para consulta. Projeto `compre-bem`, arquivo `TelaListaProdutos.js`.

```jsx
// TelaListaProdutos.js
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Novidade: Permite quebra de linha em telas estreitas
    marginBottom: 16,
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  info: {
    flex: 1,
    minWidth: 150, // Novidade: Largura mínima antes de empurrar os botões para baixo
  },
  botaoAcao: {
    minWidth: 44, // Novidade: Alvo de toque mínimo na horizontal
    minHeight: 44, // Novidade: Alvo de toque mínimo na vertical
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  // ...demais estilos
});

```

## O que este código faz

* `flexWrap: 'wrap'` aplicado ao container principal do item permite que o grupo de botões "caia" para a linha de baixo caso a largura da tela seja muito estreita (como em smartphones menores), evitando que o conteúdo fique esmagado.
* `minWidth: 150` no container de informações (`info`) atua em conjunto com o `flexWrap`. Ele estabelece um limite: se o texto for espremido para menos de 150 pixels, o Flexbox obriga os elementos seguintes (os botões) a irem para a próxima linha.
* `minWidth: 44` e `minHeight: 44` transformam os botões de ação (favoritar, mais e menos) em quadrados com área de toque mínima exigida por diretrizes de acessibilidade (WCAG 2.1), independentemente do tamanho do caractere dentro deles.
* `justifyContent: 'center'` e `alignItems: 'center'` atuam juntos para garantir que o símbolo dentro do botão (`+`, `-` ou `♥`) fique perfeitamente centralizado tanto no eixo vertical quanto no horizontal dentro desse novo espaço de 44x44 pixels.