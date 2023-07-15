import { Box, Button, Grid, Paper, Stack } from "@mui/material";
import { useFormik } from "formik";
import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import Input from "../components/Input/Input";
import PageTitle from "../components/pageTitle";
import { baseUrl, http } from "../scripts/axiosMethods";
import { contactUsValidator } from "../scripts/validators";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const { data } = await http.get(baseUrl + "list/contactUS");
      const keys = Object.keys(data.data[0]);
      keys.forEach((x) => {
        if (x === "created_at" || x === "updated_at") return;
        console.log({ x });
        formik.setFieldValue(x, data.data[0][x]);
      });
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      id: 1,
      phone1: "",
      phone2: "",
      phone3: "",
      phone4: "",
      phone5: "",
      lat: "",
      long: "",
      address: "",
    },
    validationSchema: contactUsValidator,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setLoading(true);

    const formData = new FormData();
    const keys = Object.keys(values);
    keys.forEach(key => {
      if (key === 'id') return
      formData.append(key , values[key]);
    })

    try {
      const { data } = await http.post(baseUrl + `edit/contactUS/${values.id}`, formData);
      if (!data.status) throw data;
      Notiflix.Notify.success(data.message);
      fetch();
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ width: 1 }}>
      <PageTitle title="مدیریت تماس با ما"  />

      <Grid
        container
        sx={{
          width: 1,
          p: { xs: 1, md: 5 },
        }}
        component={Paper}
        columnSpacing={3}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"شماره تماس 1"}
            name={"phone1"}
            value={formik.values["phone1"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["phone1"] && Boolean(formik.errors["phone1"])}
            helperText={formik.touched["phone1"] && formik.errors["phone1"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"شماره تماس 2"}
            name={"phone2"}
            value={formik.values["phone2"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["phone2"] && Boolean(formik.errors["phone2"])}
            helperText={formik.touched["phone2"] && formik.errors["phone2"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"شماره تماس 3"}
            name={"phone3"}
            value={formik.values["phone3"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["phone3"] && Boolean(formik.errors["phone3"])}
            helperText={formik.touched["phone3"] && formik.errors["phone3"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"شماره تماس 4"}
            name={"phone4"}
            value={formik.values["phone4"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["phone4"] && Boolean(formik.errors["phone4"])}
            helperText={formik.touched["phone4"] && formik.errors["phone4"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"شماره تماس 5"}
            name={"phone5"}
            value={formik.values["phone5"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["phone5"] && Boolean(formik.errors["phone5"])}
            helperText={formik.touched["phone5"] && formik.errors["phone5"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"آدرس"}
            name={"address"}
            value={formik.values["address"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["address"] && Boolean(formik.errors["address"])
            }
            helperText={formik.touched["address"] && formik.errors["address"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"طول جغرافیایی"}
            name={"lat"}
            value={formik.values["lat"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["lat"] && Boolean(formik.errors["lat"])}
            helperText={formik.touched["lat"] && formik.errors["lat"]}
            required
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <Input
            label={"عرض جغرافیایی"}
            name={"long"}
            value={formik.values["long"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["long"] && Boolean(formik.errors["long"])}
            helperText={formik.touched["long"] && formik.errors["long"]}
            required
            fullWidth
          />
        </Grid>
        {/* ACTION AREA */}
        <Grid
          item
          xs={12}
        >
          <Stack
            direction={"row"}
            justifyContent={"flex-end"}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ minWidth: "220px", mt: 2 }}
              disabled={loading}
              onClick={formik.handleSubmit}
            >
              ثبت اطلاعات جدید
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
