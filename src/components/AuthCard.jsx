import Logo from './Logo'

export default function AuthCard({ subtitulo, rodape, children }) {
  return (
    <main className="auth">
      <div className="auth__card">
        <Logo grande link={false} />
        <h1 className="auth__titulo">Bem vindo(a) ao Cupcake Store</h1>
        {subtitulo && <p className="auth__subtitulo">{subtitulo}</p>}
        {children}
        {rodape && <p className="auth__rodape">{rodape}</p>}
      </div>
    </main>
  )
}
