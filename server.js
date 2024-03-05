 import Fastify from 'fastify'

 const PORT = 5005
 const HOST = 'localhost'
 
  // criando o object fastify a partir da classe fastify que foi importada
 const fastify = Fastify({
    logger: true
 })

 // declarando a primeira rota, neste caso, um get a partir do objeto fastify instanciado na linha 5
 fastify.get('/', ( req, res ) =>{
    res.send('Servidor rodando')
 })

 // o metodo listen()  é responsável por subir o servidor
fastify.listen({port: PORT, host: HOST}, (error, address )=>{
   if(error){
      console.error(`Erro ao subir o servidor: ${error}`);
      return;
   }
   console.log(`Servidor rodando em http://${HOST}:${PORT}`);
})

