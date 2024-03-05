// doc do fastify para subir o servidor: https://fastify.dev/docs/latest/Guides/Getting-Started/
import Fastify from "fastify";
import { produtos } from "./db/produtos.js";

const PORT = 5005;
const HOST = "localhost";

function buscarProdutoPorId(id){
   let produto = produtos.filter(produto => produto.id == id )
   return produto
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

// o metodo listen()  é responsável por subir o servidor
fastify.listen({ port: PORT, host: HOST }, (error, address) => {
  if (error) {
    console.error(`Erro ao subir o servidor: ${error}`);
    return;
  }
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
