import * as React from 'react';
import html2canvas from 'html2canvas';
import Chance from 'chance';
import $ from 'jquery';
import 'jquery-ui-bundle';
import dust from '../static/dust.wav';

export class TurnToDust extends React.Component {
  constructor() {
    super();
    this.setCanvasRef = element => { this.canvasRef = element; };
    this.setContentRef = element => { this.contentRef = element; };
    this.canvasCount = 15;
    this.imageDataArray = []
    this.chance = new Chance();
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.snap && this.props.snap) {
      this.turnToDust();
    }
  }

  turnToDust() {
    const _this = this;

    html2canvas(this.contentRef)
    .then(canvas => {
      // Dust dispersing sound before animation starts
      const snd = new Audio(dust);
      snd.play();
      
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArr = imageData.data;
      this.createBlankImageData(imageData);
        //put pixel info to imageDataArray (Weighted Distributed)
      for (let i = 0; i < pixelArr.length; i+=4) {
        //find the highest probability canvas the pixel should be in
        const p = Math.floor((i / pixelArr.length) * this.canvasCount);
        const a = this.imageDataArray[this.weightedRandomDistribution(p)];
        a[i] = pixelArr[i];
        a[i + 1] = pixelArr[i + 1];
        a[i + 2] = pixelArr[i + 2];
        a[i + 3] = pixelArr[i + 3];
      }
      //create canvas for each imageData and append to target element
      for (let i = 0; i < this.canvasCount; i++) {
        const c = this.newCanvasFromImageData(this.imageDataArray[i], canvas.width, canvas.height, canvas.style);
        $(this.contentRef).append(c);
      }

      // clear all children except the canvas
      $(this.contentRef).children().not('canvas').animate({ opacity: 0 }, 2000);

      //apply animation
      this.contentRef.querySelectorAll('canvas').forEach((elem, index) => {
        _this.animateBlur($(elem), 0.8, 800);
        setTimeout(() => _this.animateTransform($(elem), 100, -100, this.chance.integer({ min: -15, max: 15 }), 800 + (110 * index)), 70 * index);
        //remove the canvas from DOM tree when faded
        $(elem).delay(70 * index).fadeOut((110 * index) + 800, 'easeInQuint', () => $(elem).remove());
      })
    })
  }

  weightedRandomDistribution(peak) {
    const prob = [];
    const seq = [];
    for(let i = 0; i < this.canvasCount; i++) {
      prob.push(Math.pow(this.canvasCount-Math.abs(peak-i), 3));
      seq.push(i);
    }
    return this.chance.weighted(seq, prob);
  }

  createBlankImageData(imageData) {
    for(let i = 0; i<this.canvasCount; i++) {
      const arr = new Uint8ClampedArray(imageData.data);
      for (let j = 0; j < arr.length; j++) {
        arr[j] = 0;
      }
      this.imageDataArray.push(arr);
    }
  }

  newCanvasFromImageData(imageDataArray, w, h, style) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = style.width
    canvas.style.height = style.height
    canvas.style.position = 'absolute';
    canvas.getContext('2d').putImageData(new ImageData(imageDataArray, w, h), 0, 0);
    return canvas;
  }

  animateBlur(elem, radius, duration) {
    $({ rad: 0 }).animate({ rad: radius }, {
      duration: duration,
      easing: 'easeOutQuad',
      step: now => elem.css({ filter: 'blur(' + now + 'px)' })
    });
  }

  animateTransform(elem, sx, sy, angle, duration) {
    let td = 0;
    let tx = 0;
    let ty = 0;
    $({ x: 0, y: 0, deg: 0 }).animate({ x: sx, y: sy, deg: angle }, {
      duration: duration,
      easing: 'easeInQuad',
      step: (now, fx) => {
        if (fx.prop == 'x')
          tx = now;
        else if (fx.prop == 'y')
          ty = now;
        else if (fx.prop == 'deg')
          td = now;
        elem.css({ transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,'+ ty +'px)', filter: 'grayscale(100%)' });
      }
    });
  }

  render() {
    return <React.Fragment>
      <div ref={this.setContentRef} style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        background: '#FFF'
      }}>
        {this.props.content}
      </div>
    </React.Fragment>;
  }
};