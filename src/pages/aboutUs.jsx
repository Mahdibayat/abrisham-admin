import { Button, DialogActions, DialogContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import moment from "moment-jalaali";
import { useFormik } from "formik";
import Notiflix from "notiflix";
import { baseUrl, baseUrlImage, http } from "../scripts/axiosMethods";
import { aboutUsValidator } from "../scripts/validators";
import PageTitle from "../components/pageTitle";
import UploadImage from "../components/uploadImage/uploadImage";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import TextEditor from "../components/textEditor/textEditor";
import ModalTemplate from "../components/modal/modalTemplate";
import Loader from "../components/loader/loader";
import Input from "../components/Input/Input";


function AboutUsPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const defaultRef = useRef("");

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const {data} = await http.get(baseUrl + "list/AboutUs");
      console.log("DATA : ", data);
      setList(data.data);
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      description: "",
      short_description: "",
    },
    validationSchema: aboutUsValidator,
    onSubmit: handleSubmit,
  });

  async function handleSubmit() {
    setSubLoading(true);
    const formData = new FormData();

    formData.append("description", !!editorValue ? editorValue : !!defaultRef.current ? defaultRef.current : "");
    formData.append("short_description", formik.values.short_description);

    if (!!file) formData.append("image", file, file.name || "x");

    try {
      const res = await http.post(baseUrl + `edit/AboutUs/${editId}`, formData);
      console.log(2);
      setModal(false);
      console.log(3);
      formik.resetForm();
      fetch();
      Notiflix.Notify.success(String(res.message));
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <>
      <PageTitle title="درباره ما" />

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">تصویر</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">توضیحات کوتاه</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">توضیحات</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">
                  {moment(row.create_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">
                  <img
                    src={baseUrlImage + row.image}
                    style={{ width: "250px", height: "190px", objectFit: "cover" }}
                    alt=""
                  />
                </TableCell>
                <TableCell align="center">{row.short_description}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    onClick={() => {
                      defaultRef.current = row.description;

                      setEditId(row.id);
                      setModal(true);
                    }}
                  >
                    ویرایش
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <Loader />}
      </TableContainer>

      <ModalTemplate
        open={modal}
        onClose={() => {
          setModal(false);
          formik.resetForm();
          setFile(null);
        }}
        size={900}
      >
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <UploadImage
                setUploadedImage={setFile}
                width="100%"
                height="260px"
                emptyIcon={<WallpaperIcon style={{ width: "100%", height: "100%" }} />}
              />
            </Grid>

            <Grid item xs={12} sx={{mt: 3}}>
              <Input
                label={'توضیح کوتاه'}
                name={'short_description'}
                value={formik.values['short_description']}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['short_description'] && Boolean(formik.errors['short_description'])}
                helperText={formik.touched['short_description'] && formik.errors['short_description']}
                required
                fullWidth
              />
            </Grid>

            <Grid xs={12} mt={2}>
              <TextEditor
                setEditorValue={setEditorValue}
                defaultValue={defaultRef.current}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{gap:1}}>
            <Button
              onClick={() => {
                formik.resetForm();
                setFile(null);
                setModal(false);
              }}
              disabled={subLoading}
              variant="outlined"
            >
              انصراف
            </Button>
            <Button
              disabled={subLoading}
              onClick={() => formik.handleSubmit()}
              style={{ minWidth: "120px" }}
              variant="contained"
            >
              ثبت
            </Button>
        </DialogActions>
      </ModalTemplate>
    </>
  );
}

export default AboutUsPage;
