import React from 'react'
import Header from '../_components/Header'

export default function layout({children}:{children:React.ReactNode}) {
  return (
    <div>
        <Header params='create' />
      {children}
    </div>
  )
}
