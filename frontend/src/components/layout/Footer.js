import styles from './Footer.module.css';

function Footer() {
  return (
    <section>
      <footer className={styles.footer}>
        <p>
          <span className="bold">Alugue Aqui</span> &copy; 2022
        </p>
      </footer>
    </section>
  )
}

export default Footer;