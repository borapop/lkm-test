import React from 'react'

import './styles.css'

const ClientList = (props) => {
  const {
    clients,
    openClientPage,
    openNewClientPage,
  } = props
  return (
    <div className="client-list-container">
      <div onClick={openNewClientPage} className="add-client">
        ДОБАВИТЬ КЛИЕТА
      </div>
      <ul className="client-list">
        {clients.map(client => {
          const {
            id,
            firstName,
            lastName,
            patronymic,
          } = client
          return (
            <li
              className="client-list-item"
              key={id}
              onClick={() => openClientPage(id)}
            >
              {`${lastName} ${firstName} ${patronymic}`}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ClientList
