import React, { useState, useEffect } from 'react';
import { uploadToCloudinary, insertToDatabase } from './utils';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import upload from './upload.svg';
import './App.css';
const loadingImage = "https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/VCHXZQKsxil3lhgr4/animation-loading-circle-icon-on-white-background-with-alpha-channel-4k-video_signndt9ox_thumbnail-small01.jpg";

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idFromparams = urlParams.get('id')
  if (idFromparams) {
    return <Screen2 id={idFromparams} />
  }
  return <Screen1 />;
}

const Screen1 = () => {

  const [file, setFile] = useState(null);

  const fileInputHandler = (e) => {
    e.preventDefault();
    const selection = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result)
    };
    reader.readAsDataURL(selection);
  }

  useEffect(
    () => {
      if (file) {
        uploadToCloudinary(file).then(uri => {
          insertToDatabase(uri);
        })
      }
    },
    [file]
  )

  return (
    <div className="uploadImg">
      <label htmlFor="file-input" style={{cursor: 'pointer'}}>
        {
          !file ?
          <img src={upload} alt={'Upload'}/> :
          <h3>Please wait...</h3> 
        }
      </label>
      <input id="file-input" type="file" disabled={Boolean(file)} onChange={fileInputHandler}/>
    </div>
  );
}

const Screen2 = ({id}) => {
  return (
    <Subscription
      subscription={gql`
        subscription ($id: Int) {
          images (
            where: {
              id: {
                _eq: $id
              }
            }
          ) {
            id
            image_uri
            converted_image_uri
          }
        }
      `}
      variables={{id}}
    >
      {
        ({data, error, loading}) => {
          if (error) {
            console.error(error);
            return <div className="displayflex">Error</div>;
          }
          if (loading) {
            return <div className="displayflex">Loading</div>;
          }
          if (data.images.length === 0) {
            return <div className="displayflex">Invalid image id</div>;
          }
          const image = data.images[0];
          return (
            <div className="mainWrapper">
              <div className="wd50">
                <div className="title">
                  Original image
                </div>
                <div className="mainImg">
                  <img src={image.image_uri} alt={'Original'}/>
                </div>
              </div>
              <div className="wd50">
                <div className="title">
                  Converted image
                </div>
                <div className="mainImg">
                  <img src={image.converted_image_uri || loadingImage} alt={'Converted'}/>
                </div>
              </div>
            </div>
          );
        }
      }
    </Subscription>
  )
};

export default App;
