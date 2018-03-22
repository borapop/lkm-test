import React, { Component } from 'react'
import moment from 'moment'

import './styles.css'

class ClientPage extends Component {
  constructor() {
    super()
    this.state = {
      time: null,
      date: null,
    }
    this.updateTime = this.updateTime.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.pushVisit = this.pushVisit.bind(this)
  }

  updateTime(e) {
    console.log(e.target.value)
    let time = moment(e.target.value, 'HH:mm')
    if (!time._isValid) {
      time = null
    }
    this.setState({
      time
    })
  }

  updateDate(e) {
    let date = moment(e.target.value)
    if (!date._isValid) {
      date = null
    }
    this.setState({
      date
    })
    console.log(this.state)
  }

  pushVisit() {
    const {
      date,
      time,
    } = this.state

    const {
      pushVisit,
      client
    } = this.props
    const dateTimeIsReady = date !== null && time !== null

    if (!dateTimeIsReady) return
    const dateTime = date.clone()
    dateTime.hours(time.hours()).minutes(time.minutes())
    pushVisit(client.id, dateTime.toISOString())
  }

  render() {
    const {
      firstName,
      lastName,
      patronymic,
      visits,
    } = this.props.client

    const {
      date,
      time,
    } = this.state

    const dateTimeIsReady = date !== null && time !== null

    return (
      <div className="client-page-container">
        <div className="client-fullname">
          {`${lastName} ${firstName} ${patronymic}`}
        </div>
        <div className="add-visit">
          <div className="add-visit-title">
            Новое посещение
          </div>
          <label htmlFor="date" className="input-label">
            Дата:
            <input
              name="date"
              className="add-visit-date"
              placeholder="2017-12-31"
              type="date"
              onChange={this.updateDate}
            />
          </label>
          <label htmlFor="time" className="input-label">
            Время:
            <input
              className="add-visit-date"
              placeholder="12:30"
              type="time"
              onChange={this.updateTime}
            />
          </label>
          <div
            onClick={this.pushVisit}
            className={`add-visit-button${dateTimeIsReady? '' : ' grayed-out'}`}
          >
            ДОБАВИТЬ
          </div>
        </div>
        <div className="visits-title">
          {
            (visits.length > 0) ?
            'Посещения:' :
            'Нет посещений'
          }
        </div>

        <ul className="client-visits">
          {visits.map(visit => {
            const {
              id,
              date,
            } = visit
            return (
              <li
                className="client-visits-item"
                key={id}
              >
                {moment(date).format('YYYY-MM-DD HH:mm')}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default ClientPage
