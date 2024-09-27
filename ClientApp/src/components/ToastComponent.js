import React from 'react'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

const Toast = (props) => {
  const { message, color, push, refProp } = props
  return (
    <CToast
      autohide={true}
      visible={true}
      color={color}
      push={push}
      ref={refProp}
      className="align-items-center"
    >
      <div className="d-flex">
        <CToastBody>{message}</CToastBody>
        <CToastClose className="me-2 m-auto" />
      </div>
    </CToast>
  )
}

export default Toast
