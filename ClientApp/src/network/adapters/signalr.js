import * as signalR from '@microsoft/signalr'
import { useSelector, useDispatch } from 'react-redux'
import { hubUrl } from '../../defaults/model'

const SignalRConnector = () => {
  let connection
  const dispatch = useDispatch()
  const existingConnection = useSelector((state) => state.connection)
  if (existingConnection === false) {
    connection = new signalR.HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build()
    connection.start().then(() => dispatch({ type: 'connection', connection: connection }))
  } else {
    connection = existingConnection
  }
  return { connection }
}

export default SignalRConnector
