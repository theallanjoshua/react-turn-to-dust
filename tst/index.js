import * as React from 'react';
import ReactDOM from 'react-dom';
import { TurnToDust } from '../src';
import snapIdle from './static/snap-idle.png';
import snapGif from './static/snap.gif';
import ironSpider from './static/iron-spider.png';
import blackPanther from './static/black-panther.png';
import ironMan from './static/iron-man.png';
import thor from './static/thor.png';
import cap from './static/captain-america.png';
import falcon from './static/falcon.png';
import scarletWitch from './static/scarlet-witch.png';
import hulk from './static/hulk.png';
import snapSound from './static/snap.mp3';
import './index.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      snap: []
    }
    this.snap = this.snap.bind(this);
  }

  snap() {
    const snd = new Audio(snapSound);
    snd.play();
    this.commenceDusting(4)
  }

  commenceDusting(remaining) {
    if(remaining) {
      const { snap } = { ...this.state };
      this.setState({ snap: [ ...snap, true ] });
      setTimeout(() => this.commenceDusting(remaining - 1), 4000);
    }
  }

  render = () => {
    return <React.Fragment>
      <div style={{ display: 'flex' }}>
        <TurnToDust
          dustIntensity={15}
          snap={this.state.snap[0]}
          content={
            <img src={ironSpider} height='170px' style={{ marginTop: '140px' }} />
          }
        />
        <img src={thor} height='340px' />
        <TurnToDust
          dustIntensity={15}
          snap={this.state.snap[1]}
          content={
            <img src={blackPanther} height='250px' style={{ marginTop: '50px' }} />
          }
        />
        <img src={ironMan} height='180px' style={{ marginTop: '120px' }} />
        <img src={cap} height='230px' style={{ marginTop: '60px' }} />
        <TurnToDust
          dustIntensity={15}
          snap={this.state.snap[2]}
          content={
            <img src={falcon} height='260px' style={{ marginTop: '40px' }} />
          }
        />
        <TurnToDust
          dustIntensity={15}
          snap={this.state.snap[3]}
          content={
            <img src={scarletWitch} height='260px' style={{ marginTop: '40px' }} />
          }
        />
        <img src={hulk} height='380px' style={{ marginTop: '-60px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      {this.state.snap.length ?
        <img src={snapGif} />
        :
        <img
          src={snapIdle}
          height='80px'
          style={{ cursor: 'pointer' }}
          onClick={this.snap}
        />
      }
      </div>
    </React.Fragment>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));