require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//获取图片相关的数据
let imageDatas = require('../../data/imageDatas.json');
//利用自执行函数，将图片信息转为图片URL路径信息
imageDatas=( function getImageURL(imageDataArr) {
  for(let i=0,j=imageDataArr.length;i<j;i++){
    let singleImageData=imageDataArr[i];
    singleImageData.imageURL=require('../images/'+singleImageData.fileName);
    imageDataArr[i]=singleImageData;
  }
return imageDataArr;
})(imageDatas)

//搭建图片墙舞台
class GalleryByReactApp extends React.Component{
  render(){
    return(
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav">123q4t</nav>
      </section>
    )
  }
}

// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         <img src={yeomanImage} alt="Yeoman Generator" />
//         <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
//       </div>
//     );
//   }
// }

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
