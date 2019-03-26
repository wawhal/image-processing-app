const cloudinary = require('cloudinary/lib/cloudinary');

cloudinary.config({
  cloud_name: 'swaggyroar'
});

export const uploadToCloudinary = async (path) => {
  const result = await cloudinary.v2.uploader.unsigned_upload(path, "someuploadpreset");
  return result.secure_url;
}

export const insertToDatabase = async (uri) => {
  console.log(uri);
  const response = await fetch(
    'http://localhost:8080/v1alpha1/graphql',
    {
      method: 'POST',
      body: JSON.stringify({
        query: `
          mutation ($uri: String) {
            insert_images (
              objects: [{
                image_uri: $uri
              }]
            ) {
              returning {
                id
                image_uri
              }
            }
          }
        `,
        variables: {uri}
      })
    }
  );

  const responseObj = await response.json();
  window.location.replace(`${window.location.origin}?id=${responseObj.data.insert_images.returning[0].id}`);
};