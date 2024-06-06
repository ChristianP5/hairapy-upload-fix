// const { modelPredict } = require('../services/inferenceOps');
const { uploadImage, createBucket } = require('../services/upload');

const getRootHandler = (request, h)=>{
    return h.response({
        status: 'success',
        message: 'Welcome to Root!'
    })
};

const customNotFound = (request, h)=>{
    const response = h.response({
        status: 'fail',
        message: 'You seem to be lost!',
    });

    response.code(404);
    return response;
}

/*
const postPredictHandler = async (request, h)=>{

    const { image } = request.payload;

    let result, ingredients, recomendations

    // Default Values
    result = 'classification-value';
    ingredients = [
        "ingredient-1",
        "ingredient-2",
        "ingredient-3"
    ];
    recomendations = [
        {
            image: 'rec1-image-url',
            name: 'rec1-name'
        },
        {
            image: 'rec2-image-url',
            name: 'rec2-name'
        },
    ]

    //Use the Loaded Model
    // const { model } = request.server.app;

    // const { result, ingredients, recomendations } = await modelPredict(image) 

    const response = h.response({
        status: 'success',
        message: 'Prediction Success!',
        data: {
            result: result,
            ingredients: ingredients,
            recomendations: recomendations,

        }
    })

    response.code(200);
    return response;
}
*/

// CHANGED : This is how to Upload Image
/*
    1) Receive the Image
    2) Get the Image's Information (name and path)
    3) Create a New Image Path thats usable for Cloud Storage
        Example:
        - example-folder/example.png
    4) Upload Image to Cloud Storage
*/
const postUploadHandler = async (request, h) => {

    // 1) Receive the Image
    const { image } = request.payload;

    // 2) Get the Image's Information (name and path)
    /*
        if you use:
        console.log(request.payload);

        you will see the image's name and path

        you can extract that information using the following:
    */
    const { filename: imageName, path: imagePath } = image;

    // 3) Create a New Image Path thats usable for Cloud Storage
    const destinationPath = `${process.env.BUCKET_UPLOAD_PATH}${imageName}`

    // 4) Upload Image to Cloud Storage
    await createBucket();
    await uploadImage(imagePath, destinationPath);


    return 1;
}

module.exports = {
    getRootHandler, customNotFound, // postPredictHandler
    postUploadHandler
};