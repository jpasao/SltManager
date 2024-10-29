import React from 'react'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

const Toast = (props) => {
  const { message, color, push, refProp } = props
  const hide = color !== 'danger'
  return (
    <CToast
      autohide={hide}
      visible={true}
      color={color}
      push={push}
      ref={refProp}
      className="align-items-center"
    >
      <div className="d-flex">
        <CToastBody>
          <div className="text-white">{message}</div>
        </CToastBody>
        <CToastClose className="me-2 m-auto" />
      </div>
    </CToast>
  )
}

export default Toast
