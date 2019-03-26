import React, { useState } from 'react';
import logo from './logo.svg';
import upload from './upload.svg';
import sample from './sample.jpg';
import './App.css';

const Screen1 = () => {

  const [file, setFile] = useState(null);

  return (
    <div className="uploadImg">
      <label for="file-input" style={{cursor: 'pointer'}}>
        <img src={upload} alt={'Upload'}/>
      </label>
      <input id="file-input" type="file" />
    </div>
  );
}

const Screen2 = () => {
  return (
    <div className="mainWrapper">
      <div className="wd50">
        <div className="title">
          Original image
        </div>
        <div className="mainImg">
          <img src={sample} alt={'Original'}/>
        </div>
      </div>
      <div className="wd50">
        <div className="title">
          Converted image
        </div>
        <div className="mainImg">
          <img src={sample} alt={'Converted'}/>
        </div>
      </div>
    </div>
  )
};

export default Screen1;
