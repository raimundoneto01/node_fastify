// doc do fastify para subir o servidor: https://fastify.dev/docs/latest/Guides/Getting-Started/
import Fastify from "fastify";
import { produtos } from "./db/produtos.js";

//let produtos = []

const PORT = 5005;
const HOST = "localhost";

function buscarProdutoPorId(id) {
  let produto = produtos.filter(produto => produto.id == id)

  // O metodo filter retorna sempre uma lista, assim se o produto existir pegar sempre o primeiro elemento da lista, neste caso -->[0]
  return produto[0]
}

function buscarIndexDoProduto(id) {
  return produtos.findIndex(produto => produto.id == id)
}


// criando o object fastify a partir da classe fastify que foi importada
const fastify = Fastify({
  logger: true,
});

// declarando a primeira rota, neste caso, um get a partir do objeto fastify instanciado na linha 5
fastify.get("/", (req, res) => {
  res.send("Servidor rodando");
});


fastify.get("/produtos", (req, res) => {
  res.send({
    qtd: produtos.length,
    data: produtos
  })
});

fastify.get("/produto/:id", (req, res) => {
  // let produto = buscarProdutoPorId(req.params.id)
  res.send(buscarProdutoPorId(req.params.id))

});


fastify.post("/produto", (req, res) => {
  const { nome, preco, desconto, estoque } = req.body;
  const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco,
    desconto,
    estoque,
  };
  produtos.push(novoProduto);
  res.send("Produto cadastrado com sucesso!");
});

fastify.post('/produtos', (req, res) => {

  let id =produtos.length + 1

  //pega o numero randomico de 0, 90
  let desconto = Math.floor(Math.random() * 90+1)

  // pega randomicamente true ou false
  let estoque = Math.random() < 0.5

/*   let produto = {
    id: id,
    nome: `Produto ${id}`,
    preco: 100.20,
    desconto: desconto,
    estoque,
  } */

  const novosProdutos = Array.from({ length: req.body.quantidade }, () => {
    return {
      id: id,
      nome: `Produto ${id}`,
      preco: 100.20,
      desconto: desconto,
      estoque: true,
    }
  })

  res.status(201).send({
    qtd: novosProdutos.length,
    data: novosProdutos
  })
})

fastify.put("/produto/:id", (req, res) => {
  let produtoBd = buscarProdutoPorId(req.params.id)

  if (!produtoBd) {
    res.status(404).send("Produto nao encontrado")
    return
  }
  const { nome, preco, desconto, estoque } = req.body;


  produtoBd.nome = nome,
    produtoBd.preco = preco,
    produtoBd.desconto = desconto,
    produtoBd.estoque = estoque

  res.status(201).send(produtoBd)

})

fastify.delete('/produto/:id', (req, res) => {
  let index = buscarIndexDoProduto(req.params.id)

  const produto = produtos[index];

  if (index === -1) {
    res.status(404).send('produto não encontrado')
    return
  }
  produtos.splice(index, 1)
  //  res.status(200).send(`O produto que tem o index: ${req.params.id},foi removido com sucesso!`)
  res.status(200).send(`O produto de id: ${produto.id},foi removido com sucesso!`)
})

fastify.delete('/produtos', (req, res) => {
  // produtos=[]
  if (produtos.length === 0) {
    res.status(400).send('A lista está vazia. Nenhum produto foi deletado')
    return
  }


  // da posição inicial da lista até o último elemento da lista será removiso ultilizando o slice() 
  produtos.splice(0, produtos.length)
  res.status(200).send(`A lista de produtos está vazia: ${produtos.length} produtos.`)

})

// o metodo listen()  é responsável por subir o servidor
fastify.listen({ port: PORT, host: HOST }, (error, address) => {
  if (error) {
    console.error(`Erro ao subir o servidor: ${error}`);
    return;
  }
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
