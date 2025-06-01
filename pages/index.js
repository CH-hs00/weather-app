import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  const cities = ['Seoul', 'Tokyo', 'Paris', 'London'];

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Check weather in cities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <br />
          <span className={styles.highlight}>Weather App!</span>
        </h1>

        <p className={styles.description}>
          Choose a city from the list below to check the weather.
        </p>

        <div className={styles.topSection}>
          <div className={styles.hoverSelectBox}>
            <div>
              <p className={styles.label}>Hover</p>
              <button className={styles.stateButton}>Seoul</button>
            </div>
            <div>
              <p className={styles.label}>Select</p>
              <button className={`${styles.stateButton} ${styles.selected}`}>Seoul</button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            {cities.map((city) => (
              <Link key={city} href={`/${city}`}>
                <button className={styles.cityButton}>{city}</button>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.earthImageWrapper}>
          <Image
            src="/earth.png"
            alt="Earth Illustration"
            width={380}
            height={380}
            className={styles.earthImage}
          />
        </div>
      </main>
    </div>
  );
}

