import React, { Component } from 'react';

const xCount = 10;
const yCount = 15;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default class LoginBackground extends Component<any, any> {
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
  }

  onHover(y, x) {
    const elementIndexToFlip = (y*xCount) + x;
    this.setState(prevState => {
      return {
        ...prevState,
        flipIndex: elementIndexToFlip,
      };
    });
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
                    className={`login-bg__item ${this.state.flipIndex === (y * xCount + x) ? 'login-bg-flip' : ''}`}
                    key={x}
                    // style={{ background: colors[colorIndex] }}
                    onMouseOver={event => this.onHover(y, x)}
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

