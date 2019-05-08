import * as React from 'react';
import ReactDOM from 'react-dom';
import { TurnToDust } from '../src';
import gauntlet from './images/snap-idle.png';
import snap from './images/snap.gif';
import ironSpider from './images/iron-spider.png';
import blackPanther from './images/black-panther.png';
import ironMan from './images/iron-man.png';
import thor from './images/thor.png';
import cap from './images/captain-america.png';
import falcon from './images/falcon.png';
import scarletWitch from './images/scarlet-witch.png';
import hulk from './images/hulk.png';
import './index.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      snap: false
    }
  }
  render() {
    return <React.Fragment>
      <div style={{ display: 'flex' }}>
        <TurnToDust
          snap={this.state.snap}
          content={
            <img src={ironSpider} height='170px' style={{ marginTop: '140px' }} />
          }
        />
        <img src={thor} height='340px' />
        <TurnToDust
          snap={this.state.snap}
          content={
            <img src={blackPanther} height='250px' style={{ marginTop: '50px' }} />
          }
        />
        <img src={ironMan} height='180px' style={{ marginTop: '120px' }} />
        <img src={cap} height='230px' style={{ marginTop: '60px' }} />
        <TurnToDust
          snap={this.state.snap}
          content={
            <img src={falcon} height='250px' style={{ marginTop: '50px' }} />
          }
        />
        <TurnToDust
          snap={this.state.snap}
          content={
            <img src={scarletWitch} height='250px' style={{ marginTop: '50px' }} />
          }
        />
        <img src={hulk} height='380px' style={{ marginTop: '-70px' }} />
      </div>
      {this.state.snap ?
        <img src={snap} />
        :
        <img
          src={gauntlet}
          height='80px'
          style={{ cursor: 'pointer' }}
          onClick={() => this.setState({ snap: true })}
        />
      }
    </React.Fragment>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));