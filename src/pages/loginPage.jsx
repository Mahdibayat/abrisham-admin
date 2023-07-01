//=== IMAGEs
import Logo from "../assets/logo.svg";

import { Container, Grid, Button, Stack } from "@mui/material";
import Input from "../components/Input/Input";
import { useFormik } from "formik";
import { useState } from "react";
import { loginValidator } from "../scripts/validators";
import { baseUrl, http } from "../scripts/axiosMethods";
import { Notify } from "notiflix";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginValidator,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setLoading(true);
    try {
      const { data } = await http.post(baseUrl + "confirm/password", values);
      if (!data.status) throw data;
      console.log("RES : ", data);
      console.log("RES : ", data.message);
      Notify.success(data.message);
      localStorage["access_token"] = JSON.stringify(values);
      navigate("/");
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: 1,
      }}
    >
      <Grid
        container
        sx={{
          boxShadow: 4,
          border: "1px solid dimgray",
          borderRadius: "10px",
          p: 2,
          w: 1,
          maxWidth: "400px",
          mx: "auto",
          backgroundImage: "linear-gradient(180deg, rgb(85 110 230 / 24%) 20%, transparent 20%)",
        }}
        spacing={1}
      >
        <Grid item xs={12}>
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <img src={Logo} style={{ width: "100px", height: "100px" }} alt="" />
            <Stack>
              <h3>خوش آمدید</h3>
              <span>پنل مدیریت منابع قالیشویی ابریشم</span>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Input
            label={"نام کاربری"}
            name={"username"}
            value={formik.values["username"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["username"] && Boolean(formik.errors["username"])}
            helperText={formik.touched["username"] && formik.errors["username"]}
            required
            width
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            label={"رمز عبور"}
            name={"password"}
            value={formik.values["password"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["password"] && Boolean(formik.errors["password"])}
            helperText={formik.touched["password"] && formik.errors["password"]}
            required
            width
            fullWidth
            type="password"
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction={"row"} justifyContent={"flex-end"} gap={1}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={formik.handleSubmit}
              sx={{ minWidth: "120px" }}
            >
              ورود
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
