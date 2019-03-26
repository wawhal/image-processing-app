const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.json());

const jimp = require('jimp');
const cloudinary = require('cloudinary/lib/cloudinary');

cloudinary.config({
  cloud_name: 'swaggyroar'
});

function convertImage(image) {
    return jimp.read(image.image_uri).then(function(i) {
      return i.sepia().writeAsync(`/tmp/${image.id}.png`)
    })
}

function uploadToCloud(path) {
  return cloudinary.v2.uploader.unsigned_upload(path, "demopresetupload").then(function(result) {
    return result.secure_url;
  });
}

function updateConvertedImage(image) {
  convertImage(image).then(function() {
    uploadToCloud(`/tmp/${image.id}.png`).then(function(uri) {
      fetch(
        'http://localhost:8080/v1alpha1/graphql',
        {
          method: 'POST',
          body: JSON.stringify({
            query: `
              mutation ($id: Int, $converted: String) {
                update_images (
                  _set: { converted_image_uri: $converted }
                  where: { id: { _eq: $id } }
                ) {
                  returning {
                    converted_image_uri
                    id
                  }
                }
              }
            `,
            variables: {
              converted: uri,
              id: image.id
            }
          })
        }
      ).then(function(response) { return response.json() })
      .then(function(responseObj) { console.log(responseObj) })
    }).catch(function (e) {
      console.log(e);
    })
  })
};

app.post('/', function(request, response) {
  const body = request.body;
  const image = body.event.data.new;
  convertImage(image).then(function() {
    updateConvertedImage(image);
  })
});

app.listen(4000, function() {
  console.log('Listening on 4000');
});
