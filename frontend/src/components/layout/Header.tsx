import logo from '../../assets/img/logo-lg-white.svg'

export default function Header() {
  return (
    <header className="page-header">
      <h1 className="logo">
        <img
          src={logo} 
          alt="SailTell – Your boat at a glance" 
        />
      </h1>
    </header>
  )
}