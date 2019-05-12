import * as React from 'react';
import html2canvas from 'html2canvas';
import Chance from 'chance';
import $ from 'jquery';
import 'jquery-ui-bundle';
import dust from './dust.wav';

export class TurnToDust extends React.Component {
  constructor(props) {
    super(props);
    this.setContentParentRef = element => { this.contentParentRef = element; };
    this.setContentRef = element => { this.contentRef = element; };
    this.canvasCount = props.dustIntensity || 35;
    this.imageDataArray = [];
    this.chance = new Chance();
  }

  componentDidUpdate = prevProps => {
    if(!prevProps.snap && this.props.snap) {
      this.turnToDust();
    }
  }

  turnToDust = async () => {
    const canvas = await html2canvas(this.contentRef, { logging: false, backgroundColor: null });

    // Dust dispersing sound before animation starts
    const dustSound = new Audio(dust);
    dustSound.play();

    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    this.createBlankImageData(imageData);

    // put pixel info to imageDataArray (Weighted Distributed)
    for (let i = 0; i < pixels.length; i+=4) {
      // find the highest probability canvas the pixel should be in
      const p = Math.floor((i / pixels.length) * this.canvasCount);
      const a = this.imageDataArray[this.weightedRandomDistribution(p)];
      a[i] = pixels[i];
      a[i + 1] = pixels[i + 1];
      a[i + 2] = pixels[i + 2];
      a[i + 3] = pixels[i + 3];
    }

    // create canvas for each imageData and append to target element
    for (let i = 0; i < this.canvasCount; i++) {
      const newCanvas = this.newCanvasFromImageData(this.imageDataArray[i], canvas.width, canvas.height, canvas.style);
      $(this.contentParentRef).append(newCanvas);
    }

    // clear all children except the canvas
    this.contentRef.style.opacity = 0;

    // apply animation
    Array.from(this.contentParentRef.children).filter((child, index) => index > 0).forEach((element, index) => {
      this.animateBlur(element, 0.8, 800);
      setTimeout(() => this.animateTransform(element, 100, -100, this.chance.integer({ min: -15, max: 15 }), 800 + (110 * index)), 70 * index);
      // remove the canvas from DOM tree when faded
      $(element).delay(70 * index).fadeOut((110 * index) + 800, 'easeInQuint', () => $(element).remove());
    });
  }

  weightedRandomDistribution = peak => {
    const prob = [];
    const seq = [];
    for(let i = 0; i < this.canvasCount; i++) {
      prob.push(Math.pow(this.canvasCount - Math.abs(peak - i), 3));
      seq.push(i);
    }
    return this.chance.weighted(seq, prob);
  }

  createBlankImageData = imageData => {
    for(let i = 0; i<this.canvasCount; i++) {
      const arr = new Uint8ClampedArray(imageData.data);
      for (let j = 0; j < arr.length; j++) {
        arr[j] = 0;
      }
      this.imageDataArray.push(arr);
    }
  }

  newCanvasFromImageData = (imageDataArray, w, h, style) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = style.width
    canvas.style.height = style.height
    canvas.style.position = 'absolute';
    canvas.getContext('2d').putImageData(new ImageData(imageDataArray, w, h), 0, 0);
    return canvas;
  }

  animateBlur = (element, radius, duration) => {
    $({ rad: 0 }).animate({ rad: radius }, {
      duration: duration,
      easing: 'easeOutQuad',
      step: now => $(element).css({ filter: 'blur(' + now + 'px)' })
    });
  }

  animateTransform = (element, sx, sy, angle, duration) => {
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
        $(element).css({ transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,'+ ty +'px)', filter: 'grayscale(100%)' });
      }
    });
  }

  render = () => {
    return <React.Fragment>
      <div ref={this.setContentParentRef} style={{ display: 'flex', flexDirection: 'column' }}>
        <div ref={this.setContentRef}>
          {this.props.content}
        </div>
      </div>
    </React.Fragment>;
  }
};