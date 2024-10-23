import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

const Pager = (props) => {
  const { itemsPerPage, totalItems, setCurrentPage, currentPage } = props
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const paginate = (pageNumber, e) => {
    e.preventDefault()
    setCurrentPage(pageNumber)
  }

  return (
    <CPagination align="center">
      <CPaginationItem
        className="cursorPointer"
        key={0}
        disabled={currentPage === 1}
        onClick={(e) => paginate(currentPage - 1, e)}
      >
        Previo
      </CPaginationItem>
      {pageNumbers.map((number) => (
        <CPaginationItem
          className="cursorPointer"
          key={number}
          active={currentPage === number}
          onClick={(e) => paginate(number, e)}
        >
          {number}
        </CPaginationItem>
      ))}
      <CPaginationItem
        className="cursorPointer"
        key={pageNumbers.length + 1}
        disabled={currentPage === pageNumbers.length}
        onClick={(e) => paginate(currentPage + 1, e)}
      >
        Siguiente
      </CPaginationItem>
    </CPagination>
  )
}

export default Pager
