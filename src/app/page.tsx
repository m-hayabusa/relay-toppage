import styles from "./page.module.css";
import { Header } from "@/components/Header";
import { ServerList } from "@/components/ServerList";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <ServerList />
    </main>
  );
}
