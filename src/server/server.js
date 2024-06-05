const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const { loadModel } = require('../services/inferenceOps');
const { uploadImage } = require('../services/upload');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        multipart: true // Enable multipart/form-data parsing
      }
    },
  });

  server.route(routes);

  // Route for handling image upload
  server.route({
      method: 'POST',
      path: '/upload', // Endpoint for image upload
      handler: async (request, h) => {
          const file = request.payload.file; 
          const destination = 'images/image.jpg'; 
          try {
            // Call uploadImage function
              await uploadImage(file, destination); 
              return h.response({ status: 'success', message: 'Image uploaded successfully' });
          } catch (error) {
              console.error('Error uploading image:', error);
              return h.response({ status: 'fail', message: 'Failed to upload image' }).code(500);
          }
      },
      options: {
          payload: {
              multipart: true
          }
      }
  });

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
