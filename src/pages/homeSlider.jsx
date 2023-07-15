import AddIcon from '@mui/icons-material/Add';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment-jalaali";
import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import Input from "../components/Input/Input";
import Loader from "../components/loader/loader";
import ModalTemplate from "../components/modal/modalTemplate";
import PageTitle from "../components/pageTitle";
import UploadImage from "../components/uploadImage/uploadImage";
import { baseUrl, baseUrlImage, http } from "../scripts/axiosMethods";
import { homeSliderValidator } from "../scripts/validators";


function HomeSliderPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const {data} = await http.get(baseUrl + "list/slider");
      console.log("DATA : ", data);
      setList(data.slider);
      setImages(data.image)
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: homeSliderValidator,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    if(!file)
    setSubLoading(true);
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    if (!!file) formData.append("image", file, file.name || "x");

    try {
      const {data} = await http.post(baseUrl + `add/slider`, formData);
      setModal(false);
      formik.resetForm();
      fetch();
      setFile(null)
      Notiflix.Notify.success(data.message);
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  async function handleRemove(truest) {
    if (truest) {
      setSubLoading(true);
      try {
        const {data} = await http.get(baseUrl + `delete/slider/${editId}`);
        if (!data.status) throw data;
        setDeleteWarningModal(false);
        setEditId(null);
        formik.resetForm();
        fetch();
        Notiflix.Notify.success(data.message);
      } catch (error) {
        console.error({ error });
      } finally {
        setSubLoading(false);
      }
    } else {
      setDeleteWarningModal(true);
    }
  }

  return (
    <>
      <PageTitle title="درباره ما">
        <Button variant={'contained'} endIcon={<AddIcon />} onClick={() => setModal(true)}>ایجاد</Button>
      </PageTitle>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">تصویر</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عنوان</TableCell>
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
                  {
                    typeof images.find(img => img.model_id == row.id) !== 'undefined' && 
                      <img
                        src={baseUrlImage + images.find(img => img.model_id == row.id).filename}
                        style={{ width: "250px", height: "190px", objectFit: "cover" }}
                        alt=""
                      />
                  }
                </TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      setEditId(row.id);
                      handleRemove(false);
                    }}
                  >
                    حذف
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
        size={500}
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

            <Grid xs={12} mt={2}>
              <Input
                label={'عنوان'}
                name={'title'}
                value={formik.values['title']}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['title'] && Boolean(formik.errors['title'])}
                helperText={formik.touched['title'] && formik.errors['title']}
                required
                fullWidth
              />
            </Grid>

            <Grid xs={12} mt={2}>
              <Input
                label={'مطلب'}
                name={'description'}
                value={formik.values['description']}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['description'] && Boolean(formik.errors['description'])}
                helperText={formik.touched['description'] && formik.errors['description']}
                multiline
                rows={3}
                fullWidth
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

            {/* DELETE WARNING MODAL */}
            <ModalTemplate
        open={deleteWarningModal}
        onClose={() => {
          setEditId(null);
          formik.resetForm();
          setDeleteWarningModal(false);
        }}
        size={320}
      >
        <DialogTitle>هشدار</DialogTitle>
        <DialogContent>
          <span>آیا از حذف این مقاله مطمئن هستید؟</span>
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <Button
            onClick={() => {
              setEditId(null);
              setDeleteWarningModal(false);
            }}
            disabled={subLoading}
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ minWidth: "120px" }}
            disabled={subLoading}
            onClick={() => handleRemove(true)}
          >
            حذف
          </Button>
        </DialogActions>
      </ModalTemplate>
    </>
  );
}

export default HomeSliderPage;
