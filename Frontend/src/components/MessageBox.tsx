import React from 'react'
import Alert from 'react-bootstrap/Alert'

export default function MessageBox({
    variant = "info",
    className = 'hide-on-print',
    children}:{
        variant?: string
        className?: string
        children: React.ReactNode
    }) {
    
  return <Alert variant={variant || 'info'} className={className}>{children}</Alert> 
}
