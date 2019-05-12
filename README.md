# react-turn-to-dust

Simple React component to turn any HTML to dust (like the infinity gauntlet snap)

## Installation

Install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```bash
npm install --save react-turn-to-dust
```

## Usage

```jsx static
import * as React from 'react';
import ReactDOM from 'react-dom';
import { TurnToDust } from '../src';

class App extends React.Component {
  constructor() {
    super();
    this.state = { snap: false }
  }

  snap = () => {
    this.setState({ snap: true });
  }

  render = () => {
    return <React.Fragment>
      <div style={{ display: 'flex' }}>
        <TurnToDust
          dustIntensity={20}
          snap={this.state.snap}
          content={
            <h1>Hello world!</h1>
          }
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={this.snap}>
        Snap
        </button>
      </div>
    </React.Fragment>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## Prop definitions

| Prop          | Type    | Default | Usage                                                       |   |
|---------------|---------|---------|-------------------------------------------------------------|---|
| content       | Element | empty   | Pass the element you want to turn to dust                   |   |
| snap          | Boolean | false   | Set to true when you want the content to turn to dust       |   |
| dustIntensity | Number  | 35      | Increase and reduce to see what works best for your content |   |