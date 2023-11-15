import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toggleNav } from "../scripts/app-slice";
import { toggleFullscreen } from "../scripts/helper";
import Logo from "/logo.svg";
import SideBarLinks from "./sideBarLinks/sideBarLinks";

const BasePages = () => {
  const location = useLocation();
  const { navSlide } = useSelector((state) => state.app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      typeof localStorage["access_token"] !== "undefined" &&
      !!localStorage["access_token"] &&
      JSON.parse(localStorage["access_token"]).username === "abrisham" &&
      JSON.parse(localStorage["access_token"]).password === "123456"
    ) {
      if (location.pathname === "/") {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, [location.pathname]);

  useEffect(() => {}, [location.pathname]);

  // const NavToggle = () => {
  //   return (
  //     <Navbar appearance="subtle" className="nav-toggle">
  //       <Nav>
  //         <Nav.Item style={{ width: 56, textAlign: "center" }}>
  //           <ExitIcon
  //             onClick={() => send("LOGOUT")}
  //             style={{ width: 30, height: 30, color: "#ed5f5f" }}
  //           />
  //         </Nav.Item>
  //       </Nav>
  //       <Nav pullRight>
  //         <Nav.Item
  //           onClick={() => send({ type: "TOGGLE_SIDEBAR" })}
  //           style={{ width: 56, textAlign: "center" }}
  //         >
  //           {state.context.sidebar ? <AngleLeftIcon /> : <AngleRightIcon />}
  //         </Nav.Item>
  //       </Nav>
  //     </Navbar>
  //   );
  // };

  return (
    <Box
      display="grid"
      gridTemplateColumns={navSlide ? "250px 1fr" : "60px 1fr"}
      sx={{
        transition: "grid-template-columns 300ms",
        height: "100vh",
      }}
    >
      <Stack sx={{ bgcolor: "gray.main" }}>
        <Box item xs={12}>
          {navSlide ? (
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={1}  sx={{height:'90px'}}>
              <img src={Logo} style={{ width: "70px", height: "70px" }} alt="قالیشویی ابریشم" />
              <Box>
                <Stack alignItems={"center"} sx={{whiteSpace:'nowrap'}}>
                  <Typography variant="h6">قالیشویی ابریشم</Typography>
                  <Typography>از تاریخ 1994</Typography>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Stack
              sx={{ width: 1, justifyContent: "center", alignItems: "center", height: "70px" }}
            >
              <img src={Logo} style={{ width: "40px", height: "40px" }} alt="قالیشویی ابریشم" />
            </Stack>
          )}
        </Box>

        <Box item xs={12}>
          <SideBarLinks open={navSlide} />
        </Box>
      </Stack>

      <Grid container>
        {/* HEADER */}
        <Grid
          item
          xs={12}
          sx={{
            height: "40px",
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "gray.main",
            color: "gray.light",
          }}
        >
          <IconButton onClick={() => dispatch(toggleNav())}>
            <MenuOpenIcon sx={{ color: "gray.light", transform: navSlide ? 'rotate(180deg)': "unset" }} />
          </IconButton>

          <IconButton onClick={toggleFullscreen}>
            <OpenInFullIcon sx={{ color: "gray.light" }} />
          </IconButton>
        </Grid>

        <Grid item xs={12} sx={{ mx: "5px", height: "calc(100vh - 80px)", overflow: "auto" }}>
          <Outlet />
        </Grid>

        {/* FOOTER */}
        <Grid
          item
          xs={12}
          container
          sx={{
            height: "40px",
            bgcolor: "gray.main",
            color: "gray.light",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2
          }}
        >
          <Typography>{new Date().getFullYear()} © قالیشویی ابریشم</Typography>
          <Box>
            <Typography>
              طراحی و اجرا{" "}
              <Typography component={"a"} sx={{color:'primary.main', textDecoration:'unset'}}
                href="mailto:mahdibayat72@hotmail.com"
                // target="_blank"
                rel="noreferrer"
              >
                Mahdi Bayat
                </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasePages;
