import React from 'react'
import { CCallout, CTable } from '@coreui/react'

const DependencyComponent = (props) => {
  const { name, dependencies, isEditing } = props
  const noDependencies =
    dependencies === undefined ||
    dependencies?.length === 0 ||
    Array.isArray(dependencies) === false
  let items, columns
  if (!noDependencies) {
    items = dependencies.map((dependency) => {
      return {
        name: dependency.Name,
        category: dependency.Category,
      }
    })
    columns = [
      {
        key: 'name',
        label: 'Nombre',
        _props: { scope: 'col' },
      },
      {
        key: 'category',
        label: 'Categoría',
        _props: { scope: 'col' },
      },
    ]
  }
  const modalBody = noDependencies ? (
    <CCallout color="light">{`${name} no está asignado a ningún elemento`}</CCallout>
  ) : (
    <CTable
      striped
      bordered
      columns={columns}
      items={items}
      captionTop={`${name} está asignado a los siguientes elementos`}
    />
  )

  return isEditing && modalBody
}

export default DependencyComponent
