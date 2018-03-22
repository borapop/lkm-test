import React, { Component } from 'react'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import ClientsList from './components/ClientsList'
import ClientPage from './components/ClientPage'
import NewClient from './components/NewClient'
import './App.css'

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjf2mwbfi0ooc01333dco3tfr' }),
  cache: new InMemoryCache()
})

class App extends Component {
  constructor() {
    super()
    this.state = {
      clients: [],
      chosenClient: null,
      newClientOpened: false,
    }
    this.queryClients = this.queryClients.bind(this)
    this.getClientVisits = this.getClientVisits.bind(this)
    this.openClientPage = this.openClientPage.bind(this)
    this.pushClientVisit = this.pushClientVisit.bind(this)
    this.setNewClientPage = this.setNewClientPage.bind(this)
    this.pushNewClient = this.pushNewClient.bind(this)
  }

  componentWillMount() {
    this.queryClients()
  }

  queryClients() {
    const query = gql`{
      allClients {
        id
        firstName
        lastName
        patronymic
      }
    }`
    client.query({ query })
      .then((res) => {
        if (res.data && res.data.allClients) {
          this.setState({
            clients: res.data.allClients
          })
        }
      })
  }

  getClientVisits(clientId) {
    const query = gql`{
      Client(id: "${clientId}") {
        id
        firstName
        lastName
        patronymic
        visits(orderBy: date_DESC) {
          id
          date
        }
      }
    }`
    client.query({ query })
      .then((res) => {
        if (res.data && res.data.Client) {
          this.setState({
            chosenClient: res.data.Client
          })
        }
      })
  }

  pushClientVisit(clientId, dateTime) {
    const mutation = gql`
      mutation createVisit {
        createVisit(clientId: "${clientId}" date: "${dateTime}"){
          client {
            id
            visits(orderBy: date_DESC) {
              id
              date
            }
          }
        }
      }
    `
    client.mutate({ mutation })
      .then((res) => {
        if (res.data && res.data.createVisit) {
          const {
            client
          } = res.data.createVisit
          this.setState({
            chosenClient: {
              ...this.state.chosenClient,
              visits: client.visits,
            }
          })
        }
      })
  }

  pushNewClient({ firstName, lastName, patronymic }) {
    const mutation = gql`
      mutation createClient {
        createClient(firstName: "${firstName}" lastName: "${lastName}" patronymic: "${patronymic}"){
          id
          firstName
          lastName
          patronymic
        }
      }
    `
    client.mutate({ mutation })
      .then((res) => {
        if (res.data && res.data.createClient) {
          const {
            id,
            firstName,
            lastName,
            patronymic,
          } = res.data.createClient
          this.setState({
            clients: [
              ...this.state.clients,
              {
                id,
                firstName,
                lastName,
                patronymic,
              }
            ]
          })
        }
      })
  }

  openClientPage(clientId) {
    this.setState({
      newClientOpened: false
    })
    this.getClientVisits(clientId)
  }

  setNewClientPage(opened) {
    if (opened) {
      this.setState({
        chosenClient: null,
      })
    }
    this.setState({
      newClientOpened: opened
    })
  }

  render() {
    const {
      clients,
      chosenClient,
      newClientOpened,
    } = this.state
    return (
      <ApolloProvider client={client}>
        <div className="container">
          <ClientsList
            openClientPage={this.openClientPage}
            openNewClientPage={() => this.setNewClientPage(true)}
            clients={clients}
          />
          { chosenClient &&
            <ClientPage
              pushVisit={this.pushClientVisit}
              client={chosenClient}
            />
          }
          {newClientOpened &&
            <NewClient
              pushNewClient={this.pushNewClient}
              close={() => this.setNewClientPage(false)}
            />
          }
        </div>
      </ApolloProvider>
    )
  }
}

export default App
