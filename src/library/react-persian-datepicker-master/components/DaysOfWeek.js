import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/basic.css';

// Day of week names for use in date-picker heading
const dayOfWeekNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export default class DaysOfWeek extends Component {
  static propTypes = {
    styles: PropTypes.object
  };

  render() {
    const { styles } = this.props;

    return (
      <div className={"calendarContainer days_of_week"}>
        { dayOfWeekNames.map((name, key) => <div key={key}>{name}</div>) }
      </div>
    );
  }
}
