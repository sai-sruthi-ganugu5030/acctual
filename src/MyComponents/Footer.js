import React from 'react'

export const Footer = () => {
  let footerStyle = {
    position: "relative",
    top:"100vh",
    width: "100%",
  }
  return (
    <footer className="footer" style={footerStyle}>
      <p style={{ margin: '5px 0' }}>
        Copyright &copy; {new Date().getFullYear()} | My Todos List
      </p>
      <p style={{ margin: '5px 0', fontSize: '14px', color: '#adb5bd' }}>
        All rights reserved
      </p>
    </footer>
  )
}
