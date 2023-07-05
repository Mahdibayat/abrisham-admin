import { useFormik } from 'formik';
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { serviceAttrValidator } from '../scripts/validators';
import { baseUrl, baseUrlImage, http } from '../scripts/axiosMethods';
import Notiflix from 'notiflix';
import PageTitle from '../components/pageTitle';
import { Button, DialogActions, DialogContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment-jalaali';
import Loader from '../components/loader/loader';
import ModalTemplate from '../components/modal/modalTemplate';
import UploadImage from '../components/uploadImage/uploadImage';
import TextEditor from '../components/textEditor/textEditor';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import Input from '../components/Input/Input';

function ServiceAttr() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  // const [services, setServices] = useState([]);
  // const [images, setImages] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [foundedService, setFoundedService] = useState(null);
  // const [setFoundedImages, setSetFoundedImages] = useState(null);
  const [editorValue, setEditorValue] = useState("");

  if(!location.state.id) navigate("/service");

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const {data} = await http.get(baseUrl + "list/service/Atrr");
      // setServices(data.serviceAtrr);
      // setImages(data.images);
      setFoundedService(data.serviceAtrr.find(a => a.service[0].id === location.state.id))
      // setSetFoundedImages(data.images.find(a => a.id === location.state.id))
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }
  
  const formik = useFormik({
    initialValues: {
      service_id: location.state.id,
      title: "",
    },
    validationSchema: serviceAttrValidator,
    onSubmit: handleSubmit
  });
  
  async function handleSubmit(values) {
    setSubLoading(true);

    const formData = new FormData();
    formData.append( "service_id" , values.service_id );
    formData.append( "title" , values.title );
    formData.append( "description" , editorValue );
    if (!!file) formData.append("image", file, file.name || "x");

    const url = editId ? `edit/service/Atrr/${editId}` : "add/service/Atrr";

    try {
      const { data } = await http.post(baseUrl + url, formData)
      if (!data.status) throw data;
      Notiflix.Notify.success(data.message);
      setModal(false);
      setEditId(null);
      fetch();
    } catch (error) {
      console.error({error});
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <>
      <PageTitle title={`مدیریت زیرشاخه های سرویس "${foundedService?.title || ""}"`}>
        <Button endIcon={<AddIcon />} variant="contained" onClick={() => setModal(true)}>
          ایجاد زیرشاخه جدید
        </Button>
      </PageTitle>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">تصویر</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">توضیحات</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[].map?.((row) => (
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
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    onClick={() => {
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
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <UploadImage
                setUploadedImage={setFile}
                width="100%"
                height="230px"
                emptyIcon={<WallpaperIcon style={{ width: "100%", height: "100%" }} />}
              />
            </Grid>

            <Grid xs={12} mt={2}>
              <TextEditor
                setEditorValue={setEditorValue}
                defaultValue={editorValue}
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
  )
}

export default ServiceAttr
