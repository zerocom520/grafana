import React from 'react';
import { connect } from 'react-redux';
import { setActive, setPaused } from 'app/store/actions';

export class ServerStats extends React.Component<any, any> {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  onClick = () => {
    if (!this.props.active) {
      this.props.setActive();
    } else {
      this.props.setPaused();
    }
  };

  render() {
    return (
      <div>
        <h1>
          {this.props.active && <span>State flags.active is true!</span>}
          {!this.props.active && <span>State flags.active is false!</span>}
        </h1>
        <button className="btn btn-large btn-success" onClick={this.onClick}>
          Click me
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log('mapStateToProps state', state);
  return {
    active: state.flags.active,
  };
};

export default connect(mapStateToProps, {
  setActive,
  setPaused,
})(ServerStats);
