import React, { Component } from 'react'

import './styles.css'

class NewClient extends Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      patronymic: '',
    }
    this.updateStateProperty = this.updateStateProperty.bind(this)
    this.pushNewClient = this.pushNewClient.bind(this)
  }

  updateStateProperty(e) {
    const {
      value,
      name,
    } = e.target
    console.log(e.target)
    const newState = {}
    newState[name] = value
    this.setState(newState)
  }

  pushNewClient() {
    const {
      firstName,
      lastName,
      patronymic
    } = this.state
    const dataIsReady = firstName && lastName && patronymic
    if (!dataIsReady) return
    this.props.pushNewClient({
      firstName,
      lastName,
      patronymic,
    })
  }

  render() {
    const {
      firstName,
      lastName,
      patronymic,
    } = this.state
    const {
      close,
    } = this.props
    const dataIsReady = firstName && lastName && patronymic
    return (
      <div className="new-client-container">
        <div className="add-visit-title">
          Новый клиент
          <span
            onClick={close}
            className="close-new-client"
          >
            ОТМЕНА
          </span>
        </div>
        <label htmlFor="last-name" className="new-client-input-label">
          Фамилия:
          <input
            name="lastName"
            className="new-client-input"
            placeholder="Иванов"
            onChange={this.updateStateProperty}
          />
        </label>
        <label htmlFor="first-name" className="new-client-input-label">
          Имя:
          <input
            name="firstName"
            className="new-client-input"
            placeholder="Иван"
            onChange={this.updateStateProperty}
          />
        </label>
        <label htmlFor="patronymic" className="new-client-input-label">
          Отчество:
          <input
            name="patronymic"
            className="new-client-input"
            placeholder="Иванович"
            onChange={this.updateStateProperty}
          />
        </label>
        <div
          onClick={this.pushNewClient}
          className={`add-client-button${dataIsReady? '' : ' add-client-grayed-out'}`}
        >
          ДОБАВИТЬ
        </div>
      </div>
    )
  }
}

export default NewClient
