import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';


export default function Header() {
  const router = useRouter();

  return (
    <AppBar position="static" className={styles.navBar}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Crypto Portfolio
        </Typography>
        <Button color="inherit" onClick={() => router.push("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>
        <Button color="inherit" onClick={() => router.push("/auth/login")}>
          Login
        </Button>
        <Button color="inherit" onClick={() => router.push("/auth/signup")}>
          Signup
        </Button>
      </Toolbar>
    </AppBar>
  );
}
