import styles from './page-loader.module.css';

export default function PageLoader() {
  return (
    <div className={styles.loaderContainer}>
      <img
        src="https://galileecommerce.netlify.app/img/logo_red.png"
        alt="logo"
        className={styles.logo}
      />
      <p className={styles.text}>GalileeCommerce !</p>
      <p className={styles.textspin}></p>
      <p className={styles.textspin}></p>
      <p className={styles.textspin}></p>
      <div className={styles.dots}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}