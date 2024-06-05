const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const { loadModel } = require('../services/inferenceOps');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  /* Load the Model and Save the Model in server.app (Uncomment once Model is Available) */
  /*
    server.app is a place to store values accessible wherever the server can access
    access values in server.app through handlers:
      request.server.app
  */
  // server.app.model = await loadModel();

  server.ext('onPreResponse', (request, h)=>{
    const response = request.response;

    if(response instanceof Error){
      console.error(`Response is an Error!`);
      const newResponse = h.response({
        status: 'fail',
        message: 'Server Error!'
      });

      console.error(response.stack);

      newResponse.code(500)

      return newResponse;
    }

    return h.continue;
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', ()=>{
  console.error(`Process caught Error!`);
  process.exit(1);
})

init();