import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  faPause,
  faPlay,
  faSync,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
const audio = document.getElementById('beep');

library.add(fas, faPlay, faPause, faSync, faArrowDown, faArrowUp);

// My version - class component pomodoro clock
class App extends React.Component {
  constructor(props) {
    super(props);
    this.counter = undefined;
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.updateOutput = this.updateOutput.bind(this);
  }

  state = {
    sessionTimer: 1500,
    breakTimer: 300,
    output: '25:00',
    isRunning: false,
    currentTimer: {
      name: 'Session',
      count: 1500,
    },
  };

  displayTime(timer) {
    const { count } = timer;
    console.log(count);
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    if (seconds < 10) {
      seconds = seconds.toString() ? '0' + seconds : seconds;
    }
    if (minutes < 10) {
      minutes = minutes.toString() ? '0' + minutes : minutes;
    }
    this.setState({ output: `${minutes}:${seconds}` });
  }

  handleChange(e, mode) {
    const { breakTimer, sessionTimer } = this.state;
    if (this.state.isRunning === true) {
      return;
    }
    const buttonId = e.target.id;

    let updateTimer = 0;
    if (mode === 'Break') {
      updateTimer = breakTimer;
    } else {
      updateTimer = sessionTimer;
    }
    if (buttonId.includes('increment') && updateTimer < 3600) {
      updateTimer += 60;
      this.setState(
        { [`${mode.toLowerCase()}Timer`]: updateTimer },
        this.updateOutput(mode, updateTimer)
      );
    } else if (buttonId.includes('decrement') && updateTimer > 0) {
      updateTimer -= 60;
      this.setState(
        { [`${mode.toLowerCase()}Timer`]: updateTimer },
        this.updateOutput(mode, updateTimer)
      );
    }
  }

  updateOutput = (mode, value) => {
    console.log(value);
    if (this.state.currentTimer.name !== mode) {
      return;
    }
    this.setState(
      { currentTimer: { name: mode, count: value } },
      this.displayTime({ name: mode, count: value })
    );
    // console.log(this.state.currentTimer.count);
  };

  handleReset = () => {
    const defaultState = {
      sessionTimer: 1500,
      breakTimer: 300,
      output: '25:00',
      isRunning: false,
      currentTimer: {
        name: 'Session',
        count: 1500,
      },
    };
    console.log('handleReset');
    this.setState(defaultState);
    clearInterval(this.counter);
    audio.pause();
    audio.currentTime = 0;
  };

  componentWillUnmount = () => {
    clearInterval(this.counter);
  };

  render() {
    const { output, isRunning, currentTimer, sessionTimer, breakTimer } =
      this.state;
    // console.log(currentTimer.count);
    const sessionProps = {
      title: 'Session Length',
      Id: 'session',
      timer: sessionTimer,
      mode: 'Session',
      isRunning: isRunning,
      handleChange: (e) => this.handleChange(e, 'Session'),
    };

    const breakProps = {
      title: 'Break Length',
      Id: 'break',
      timer: breakTimer,
      mode: 'Break',
      isRunning: isRunning,
      handleChange: (e) => this.handleChange(e, 'Break'),
    };

    this.handleStartStop = () => {
      console.log('start');
      if (this.state.isRunning === true) {
        clearInterval(this.counter);
        this.setState({ isRunning: false });
        return;
      }

      this.setState({ isRunning: true });

      this.counter = setInterval(() => {
        const { currentTimer, sessionTimer, breakTimer } = this.state;

        if (currentTimer.count === 0) {
          if (currentTimer.name === sessionProps.mode) {
            currentTimer.name = breakProps.mode;
            currentTimer.count = breakTimer;
            this.setState({
              currentTimer: currentTimer,
            });
          } else if (currentTimer.name === breakProps.mode) {
            currentTimer.name = sessionProps.mode;
            currentTimer.count = sessionTimer;
            this.setState({
              currentTimer: currentTimer,
            });
          }
          audio.play();
        } else {
          currentTimer.count -= 1;
          this.setState({
            currentTimer: currentTimer,
          });
        }
        this.displayTime(this.state.currentTimer);
      }, 1000);
    };

    return (
      <div className="app">
        <div className="main-title">25 + 5 Clock</div>
        <div className="controls">
          <TimeControls {...sessionProps} />
          <TimeControls {...breakProps} />
        </div>
        <div className="timer">
          <div className="timer-wrapper">
            <div id="timer-label">{currentTimer.name}</div>
            <div id="time-left">{output}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.handleStartStop}>
            <FontAwesomeIcon
              icon={`${this.state.isRunning ? 'pause' : 'play'}`}
              size="2x"
            />
          </button>
          <button id="reset" onClick={this.handleReset}>
            <FontAwesomeIcon icon="sync" size="2x" />
          </button>
        </div>
        <div className="author">Coded by Dimitar Odrinski</div>
      </div>
    );
  }
}

class TimeControls extends React.Component {
  render() {
    // console.log(this.props.timer);
    return (
      <div className="wrapper">
        <h2 className="title" id={`${this.props.Id}-label`}>
          {this.props.title}
        </h2>
        <div className="timerControl">
          <div className="buttons">
            <button
              className="btn-level"
              value="-"
              id={`${this.props.Id}-decrement`}
              onClick={this.props.handleChange}
            >
              <FontAwesomeIcon icon="arrow-down" size="2x" />
            </button>
            <h2 id={`${this.props.Id}-length`}>{this.props.timer / 60}</h2>
            <button
              className="btn-level"
              value="+"
              id={`${this.props.Id}-increment`}
              onClick={this.props.handleChange}
            >
              <FontAwesomeIcon icon="arrow-up" size="2x" />
            </button>
          </div>
          <h3 className="label">Time Controls</h3>
        </div>
      </div>
    );
  }
}

export default App;
