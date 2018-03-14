require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.js');
console.log(imageDatas)

//利用自执行函数，将图片信息转为图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas);

//随机取得随机数
var getRangeRandom=((low,high) =>
    Math.ceil(Math.random()*(high-low)+low)
)

//单幅画组件
class ImgFigure extends React.Component {
  render() {
    let styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
        styleObj=this.props.arrange.pos;
    }
    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>,
        </figcaption>
      </figure>
    )
  }
}

//搭建图片墙舞台
let GalleryByReactApp=  React.createClass ({
// class GalleryByReactApp extends React.Component {
  //存储排布的可取值范围
  Constant:{
    centerPos:{//中心位置的坐标取值范围
      left:0,
      right:0
    },
    hPosRange:{//水平方向的取值范围
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0,0]
    },
    vPosRange:{//垂直方向的取值范围
      x:[0,0],
      topY:[0,0]
    }
  },
  //布局排列图片
/*
 *@param cnenterIndex制定居中排布哪个图片
 */
  rearrange:((centerIndex) =>{
    let imgsArrangeArr=this.state.imgsArrangeArr,
    Constant=this.Constant,
    centerPos=Constant.centerPos,
    hPosRange=Constant.hPosRange,
    vPosRange=Constant.vPosRange,
    hPosRangeLeftSecX=hPosRange.leftSecX,
    hPosRangeRightSecX=hPosRange.rightSecX,
    hPosRangeY=hPosRange.y,
    vPosRangeTopY=vPosRange.topY,
    vPosRangeX=vPosRange.x,

    imgsArrangeTopArr=[],
    topImgNum=Math.ceil(Math.random()*2),//取一个或者不取
    topImgSpliceIndex=0,
    imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);//中心图片的状态

    //首先居中centetIndex图片
    imgsArrangeCenterArr[0].pos=centerPos;

    //取出要布局在上侧的图片状态信息
    topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum))
    imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上侧图片
    imgsArrangeTopArr.forEach((value,index) => {
        imgsArrangeTopArr[index].pos={
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])

        }
    })

    //布局左右两边图片
    for (let i = 0,j=imgsArrangeArr.length,k=j/2; i < j; i++) {
        let hPosRangeLORX=null;
        //前半部分布局左边，右半部分布局右边
        if(i<k){
            hPosRangeLORX=hPosRangeLeftSecX;
        }else{
          hPosRangeLORX=hPosRangeRightSecX;
        }
        imgsArrangeArr[i].pos={
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        }

    }
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    this.setState({
       imgsArrangeArr:imgsArrangeArr
    })

  }),
  getInitialState(){//初始化state
    return{
      imgsArrangeArr:[//图片状态变化
        /*{
          pos:{
            left:'0',
            top:'0'
          }
        }*/
      ]
    }
  },
  //组件加载后，为每张图片计算其位置的范围
  componentDidMount() {
    //首先拿到舞台大小 (以前写法： React.findDOMNode(this.refs.stage)
    let stageDOM=this.refs.stage,
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);

      //拿到一个imgFigure的大小
    let imgFigureDOM=this.refs.imgFigure0,
        imgW=imgFigureDOM.scrollWidth,
        imgH=imgFigureDOM.scrollHeight,
        halfImgW=Math.ceil(imgW/2),
        halfImgH=Math.ceil(imgH/2);


    //计算各个constant值
    this.Constant.centerPos={//计算中心图片的位置点
      left:halfStageW-halfImgW,
      top: halfStageH-halfImgH
    }
    //计算左右区域的取值范围
    this.Constant.hPosRange.leftSecX[0]=0-halfImgW;
    this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW *3;
    this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
    this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
    this.Constant.hPosRange.y[0]=0-halfImgH;
    this.Constant.hPosRange.y[1]=stageH-halfImgH;
    //上侧区域的取值范围
    this.Constant.vPosRange.topY[0]=0-halfImgH;
    this.Constant.vPosRange.topY[1]=halfStageH-halfImgH *3;
    this.Constant.vPosRange.x[0]=halfStagew-imgW;
    this.Constant.vPosRange.x[1]=halfStageW;

    this.rearrange(0);

  },
  render() {
    let _self=this;
    let controllerUnits = [],
        imgFigures = [];
        imageDatas.forEach((value,index) => {
          if(!_self.state.imgsArrangeArr[index]){
              _self.state.imgsArrangeArr[index]={
                pos:{
                  left:0,
                  top:0
                }
              }
          }
          imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={_self.state.imgsArrangeArr[index]}/>);
      })

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }
})

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
