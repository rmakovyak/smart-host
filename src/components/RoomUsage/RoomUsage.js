import React, { Component } from 'react';
import {
  generateCustomers,
  settleCustomers,
  calculateRoomUsage
} from './RoomUsage.helper';

const initState = {
  premium: {
    total: 0,
    value: 0
  },
  economy: {
    total: 0,
    value: 0
  },
  economyCount: 0,
  premiumCount: 0
};

class RoomUsage extends Component {
  constructor(props) {
    super(props);

    this.state = initState;

    this.handleCountChange = this.handleCountChange.bind(this);
    this.calculateRoomUsage = this.calculateRoomUsage.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    return fetch('payments.json')
      .then(response => response.json())
      .then(payments => {
        this.setState({
          payments
        });
      })
      .catch(e => e);
  }

  handleCountChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  calculateRoomUsage(e) {
    e.preventDefault();
    const customers = generateCustomers(this.state.payments.data);
    const settledCustomers = settleCustomers(customers, {
      premium: this.state.premiumCount,
      economy: this.state.economyCount
    });
    const roomUsage = calculateRoomUsage(settledCustomers);
    this.setState({
      ...roomUsage
    });
  }

  handleReset(e) {
    e.preventDefault();
    this.setState({ ...initState });
  }

  render() {
    return (
      <div className="RoomUsage">
        <h1 className="title">Room usage calculator</h1>
        <form style={{ marginBottom: '20px' }}>
          <div className="field">
            <label className="label">Premium rooms count</label>
            <div className="control">
              <input
                placeholder="Premium rooms count"
                class="input"
                type="number"
                name="premiumCount"
                value={this.state.premiumCount}
                onChange={this.handleCountChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Economy rooms count</label>
            <div className="control">
              <input
                placeholder="Economy rooms count"
                class="input"
                type="number"
                name="economyCount"
                value={this.state.economyCount}
                onChange={this.handleCountChange}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                className="button is-link"
                onClick={this.calculateRoomUsage}
              >
                Calculate room usage
              </button>
            </div>
            <div className="control">
              <button className="button is-text" onClick={this.handleReset}>
                Reset
              </button>
            </div>
          </div>
        </form>
        <h1 className="subtitle">Report</h1>
        <p>
          Usage premium: {this.state.premium.total} (€{' '}
          {this.state.premium.value})
        </p>
        <p>
          Usage economy: {this.state.economy.total} (€{' '}
          {this.state.economy.value})
        </p>
      </div>
    );
  }
}

export default RoomUsage;
