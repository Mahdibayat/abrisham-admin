import { ThemeProvider, createTheme } from "@mui/material";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import BasePages from "./components/basePages";

const Dashboard = lazy(() => import("./pages/dashboard"));
const LoginPage = lazy(() => import("./pages/loginPage"));
const Page404 = lazy(() => import("./pages/Page404"));
const BlogPage = lazy(() => import("./pages/blog"));
// const SocialMediaPage = lazy(() => import("./pages/socialMedia"));

function App() {
  function suspenseWarper(element) {
    return (
      <Suspense
        fallback={
          <div className="suspense-loading">
            <h1>در حال بارگذاری ...</h1>
          </div>
        }
      >
        {element}
      </Suspense>
    );
  }

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1000,
        lg: 1500,
        xl: 2000,
      },
    },
    direction: "rtl",
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: "#db3131",
            "&$error": {
              color: "#db3131",
            },
          },
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          noOptionsText: "موردی یافت نشد",
        },
      },
    },
    typography: {
      fontFamily: "IRANSans",
    },
    palette: {
      mode:'dark',
      primary: {
        main: "#00b3ff",
        dark: "#145ea8",
        light: "#7fd1f3",
      },
      gray: {
        main: "#262b3c",
        dark: "#a6b0cf",
        light: "#a6b0cf"
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<BasePages />}>
          <Route path="/dashboard" element={suspenseWarper(<Dashboard />)} />
          <Route path="/blogs" element={suspenseWarper(<BlogPage />)} />
          {/* <Route path="/social-media" element={suspenseWarper(<SocialMediaPage />)} />
        <Route path="/about-us" element={suspenseWarper(<AboutUsPage />)} /> */}
          <Route path="*" element={suspenseWarper(<Page404 />)} />
        </Route>
        <Route path="/login" element={suspenseWarper(<LoginPage />)} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
