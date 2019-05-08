import * as React from 'react';
import ReactDOM from 'react-dom';
import { TurnToDust } from '../src';
import gauntlet from './images/snap-idle.png';
import snap from './images/snap.gif';
import character from './images/iron-spider.png';
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
      <TurnToDust
        snap={this.state.snap}
        content={
          <img src={character} height='300px' />
        }
      />
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