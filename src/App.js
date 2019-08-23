import React from 'react';
import './App.css';

const images = ['banana.png', 'strawberry.png', 'orange.png', 'monkey.png'];
const spinInterval = 50;
const startTimeOut = 5000;
const stopTimeOut = 10000;

const Spinner = React.forwardRef((props, ref) => {
  const defaultImage = images[0];
  const style = {
    backgroundImage: `url(img/${defaultImage})`,
    backgroundSize: 'contain'
  };

  return <div ref={ref} className={'spinner'} style={style}></div>
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Press button "Start" or wait 5 seconds.',
      showStart: true,
      showStop: false
    };

    this.intervalId = undefined;
    this.spinners = [React.createRef(), React.createRef(), React.createRef()];
  }

  get randomSymbol() {
    return Math.floor(Math.random() * 4);
  }

  componentDidMount() {
    this.spinOnce();

    setTimeout(() => {
      if (this.intervalId === undefined) {
        this.handleStart();
      }
    }, startTimeOut)
  }

  handleStart = () => {
    if (!this.intervalId) {
      this.setState({
        text: 'Press "Stop" or wait 10 seconds.',
        showStart: false,
        showStop: true
      });

      this.spin();
    }
  };

  handleStop = () => {
    if (this.intervalId) {
      this.setState({
        showStart: true,
        showStop: false
      });

      clearInterval(this.intervalId);
      this.intervalId = null;
      this.checkResult();
    }
  };

  // TODO test - maybe just check that the result has changed
  spinOnce = () => {
    this.spinners.forEach(spinner => {
      this.setImage(spinner, this.randomSymbol);
    })
  };

  spin = () => {
    this.intervalId = setInterval(this.spinOnce, spinInterval);

    setTimeout(() => {
      if (this.intervalId) {
        this.handleStop();
      }
    }, stopTimeOut);
  };

  getResults = () => {
    return this.spinners.map(item => this.getImage(item));
  };

  checkResult = () => {
    const results = this.getResults();
    let reward = 0;

    if (results[0] === results[2]) {
      reward = 10;
    }

    if (results[0] === results[1] || results[1] === results[2]) {
      reward = 20;
    }

    if (results[0] === results[1] && results[1] === results[2]) {
      reward = 100;
    }

    const resultText = reward ? `Your reward is ${reward}$!` : 'Try again!';

    this.setState({
      text: resultText
    })
  };

  setImage = (spinner, imageId) => {
    spinner.current.style['background-image'] = `url(img/${images[imageId]})`;
  };

  getImage = (spinner) => {
    return spinner.current.style['background-image'];
  };

  render() {
    const { text, showStart, showStop } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <span>{ text }</span>
          <div className={'spinner-container'}>
            {
              this.spinners.map((item, index) => (
                <Spinner key={index} ref={item}/>
              ))
            }
          </div>
          <div className={'buttons'}>
            {showStart ? <button onClick={this.handleStart}>Start</button> : null}
            {showStop ? <button onClick={this.handleStop}>Stop</button> : null}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
