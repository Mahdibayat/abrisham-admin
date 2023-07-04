import moment from "moment-jalaali";
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Notiflix from "notiflix";
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { baseUrl, http } from "../scripts/axiosMethods";
import { socialValidator } from "../scripts/validators";
import PageTitle from "../components/pageTitle";
import ModalTemplate from "../components/modal/modalTemplate";
import Input from "../components/Input/Input";
import Loader from "../components/loader/loader";

const SocialMediaPage = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const {data} = await http.get(baseUrl + "list/social");
      setList(data.data);
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      link: "",
    },
    validationSchema: socialValidator,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    if(!editId && !file){
      Notiflix.Notify.failure("شبکه اجتماعی باید تصویر داشته باشد")
      return
    }
    setSubLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("link", values.link);
    if (!!file) formData.append("icon", file.target.files[0], file.target.files[0].name);

    let action = !!editId ? `edit/social/${editId}` : "add/social";

    try {
      const {data} = await http.post(baseUrl + action, formData);
      console.log("DATA  : ", data);
      setModal(false);
      formik.resetForm();
      fetch();
      Notiflix.Notify.success(data.message);
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  async function handleRemove(id) {
    setSubLoading(true);
    try {
      const {data} = await http.get(baseUrl + `delete/social/${id}`);
      console.log("DATA : ", data);
      fetch();
      Notiflix.Notify.success(data.message);
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <>
      <PageTitle title="مدیریت شبکه های اجتماعی">
        <Button variant="contained" onClick={() => setModal(true)} disabled={loading} endIcon={<AddIcon />}>
          افزودن
        </Button>
      </PageTitle>

      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عنوان</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">لینک</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">
                  {moment(row.create_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.link}</TableCell>
                <TableCell align="right">
                  <Stack direction='row' gap={1} alignItems={'center'}>
                    <Button
                      variant="text"
                      onClick={() => handleRemove(row.id)}
                      disabled={subLoading}
                      color="error"
                    >
                      حذف
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => {
                        setEditId(row.id);
                        setModal(true);
                        let founded = list.find(x => x.id === row.id);
                        if (typeof founded !== "undefined") {
                          formik.setFieldValue("name", founded.name);
                          formik.setFieldValue("link", founded.link);
                        }
                      }}
                    >
                      ویرایش
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <Loader />}
      </TableContainer>


      <ModalTemplate open={modal} onClose={() => setModal(false)}>
        <DialogTitle>افزودن شبکه اجتماعی</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} width={1}>
            <Grid item xs={12} sm={6}>
              <Input
                label={"عنوان"}
                name={"name"}
                value={formik.values["name"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["name"] && Boolean(formik.errors["name"])}
                helperText={formik.touched["name"] && formik.errors["name"]}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                label={"آدرس (لینک)"}
                name={"link"}
                value={formik.values["link"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["link"] && Boolean(formik.errors["link"])}
                helperText={formik.touched["link"] && formik.errors["link"]}
                required
                fullWidth
              />
            </Grid>
          </Grid>

          <input type="file" onChange={(file) => setFile(file)} />
        </DialogContent>

        <DialogActions sx={{gap:1}}>
            <Button
              variant="outlined"
              onClick={() => {
                setModal(false);
                setEditId(null);
                formik.resetForm();
              }}
              disabled={subLoading}
            >
              انصراف
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={subLoading}
              sx={{minWidth:'120px'}}
              onClick={() => formik.handleSubmit()}
            >
              {editId ? "ویرایش" : "ثبت"}
            </Button>
        </DialogActions>
      </ModalTemplate>
    </>
  );
};

export default SocialMediaPage;
