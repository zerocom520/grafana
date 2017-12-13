import React, { Component } from 'react';

const xCount = 30;
const yCount = 50;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default class LoginBackground extends Component<any, any> {
  cancelInterval: any;
  matrix: any;

  constructor(props) {
    super(props);

    this.state = {
      flipIndex: null,
    };

    this.matrix = [];
    for (let y = 0; y < yCount; y++) {
      let row = [];
      this.matrix.push(row);
      for (let x = 0; x < xCount; x++) {
        row.push(0);
      }
    }

    this.flipElements = this.flipElements.bind(this);
  }

  flipElements() {
    const elementIndexToFlip = getRandomInt(0, xCount * yCount - 1);
    this.setState(prevState => {
      return {
        ...prevState,
        flipIndex: elementIndexToFlip,
      };
    });
  }

  componentWillMount() {
    this.cancelInterval = setInterval(this.flipElements, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.cancelInterval);
  }

  onHover = (x, y, event) => {
    let current = this.matrix[x][y];
    if (current === 0) {
      this.matrix[x][y] += 3;
      if (x > 1) {
        this.matrix[x-1][y] += 2;
      }

      if (x > 2) {
        this.matrix[x-2][y] += 1;
      }

      if (x + 1 < xCount) {
        this.matrix[x+1][y] += 2;
      }

      if (x + 2 < xCount) {
        this.matrix[x+2][y] += 1;
      }

      if (y > 1) {
        this.matrix[x][y-1] += 2;
      }

      if (y > 2) {
        this.matrix[x][y-2] += 1;
      }

      if (y + 1 > yCount) {
        this.matrix[x][y+1] += 2;
      }

      if (y + 2 > yCount) {
        this.matrix[x][y+2] += 1;
      }
    } else {
      this.matrix[x][y] += event.shiftKey ? -1 : 1;
    }

    this.matrix[x][y] = Math.min(this.matrix[x][y], colors.length-1);

    console.log(this.matrix);
    this.forceUpdate();
  }

  render() {
    console.log('re-render!', this.state.flipIndex);

    return (
      <div className="login-bg">
      {this.matrix.map((row, y) => {
        return (
          <div className="login-bg__row" key={y}>
          {row.map((colorIndex, x) => {
            return (
              <div
              className={`login-bg__item ${false ? 'login-bg-flip' : ''}`}
              key={x}
              style={{ background: colors[colorIndex] }}
              onMouseOver={(event) => this.onHover(y, x, event)}
              />
            );
          })}
          </div>
        );
      })}
      </div>
    );
  }
}

const colors = [
  '#000f20',
  '#001835',
  '#011126',
  '#011735',
  '#001a3a',
  '#021e3f',
  '#002045',
  '#01264f',
  '#002d59',
  '#013364',
  '#003b72',
  '#014b8d',
  '#016abd',
  '#0168bc',
  '#00aedb',
  '#00d3e2',
  '#00d9e2',
  '#05dce2'
];
