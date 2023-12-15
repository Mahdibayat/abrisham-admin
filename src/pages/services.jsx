import { Button, DialogActions, DialogContent, DialogTitle, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PageTitle from "../components/pageTitle";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import ModalTemplate from "../components/modal/modalTemplate";
import moment from "moment-jalaali";
import { useFormik } from "formik";
import { serviceValidator } from "../scripts/validators";
import { baseUrl, baseUrlImage, http } from "../scripts/axiosMethods";
import Notiflix from "notiflix";
import Loader from "../components/loader/loader";
import Input from "../components/Input/Input";
import CustomSwitch from "../components/customSwitch";
import UploadImage from "../components/uploadImage/uploadImage";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { useNavigate } from "react-router-dom";


export default function ServicesPage() {
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [list, setList] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);
  const [attrModal, setAttrModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const {data} = await http.get(baseUrl + "list/service" );
      setList(data.data)
    } catch (error) {
      console.error({error});
    } finally {
      setLoading(false);
    }
  }
  
  const formik = useFormik({
    initialValues: {
      title:'',
      status: false
    },
    validationSchema: serviceValidator,
    onSubmit: handleSubmit
  });
  
  async function handleSubmit(values) {
    setSubLoading(true);
    
    const formData = new FormData();
    formData.append( "title" , values.title );
    formData.append( "status" , values.status ? "active" : "deactive");
    if (!!uploadedImage) formData.append( "icon" , uploadedImage, uploadedImage.name );

    const url = editId ? `edit/service/${editId}` : "add/service";
    
    try {
      const {data} = await http.post(baseUrl + url, formData);
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

  async function handleRemove(truest) {
    if (truest) {
      setSubLoading(true);
      try {
        const {data} = await http.get(baseUrl + `delete/service/${editId}`);
        if (!data.status) throw data;
        setDeleteWarningModal(false);
        setEditId(null);
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
      <PageTitle title="مدیریت خدمات">
        <Button variant={'contained'} endIcon={<AddIcon />} onClick={() => setModal(true)}>ایجاد</Button>
      </PageTitle>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عنوان</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">وضعیت</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">تصویر</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">
                  {moment(row.created_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.status === 'active' ? "فعال" : "غیر فعال"}</TableCell>
                <TableCell align="right">
                    <img src={baseUrlImage + row.icon} alt={row.title} style={{width:'200px', height:'120px', objectFit:'cover'}} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    onClick={() => {
                      setEditId(row.id);
                      formik.setFieldValue('title', row.title);
                      formik.setFieldValue('status', row.status === 'active');
                      setModal(true);
                    }}
                  >
                    ویرایش
                  </Button>

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
                  
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => {
                      setEditId(row.id);
                      setAttrModal(true);
                      navigate("./attr", {state : {id: row.id}})
                    }}
                  >
                    جزئیات خدمات
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <Loader />}
      </TableContainer>

      {/* EDIT & ADD MODAL */}
      <ModalTemplate open={modal} onClose={()=>{
          setModal(false);
          setEditId(false)
        }}
        size={1000}
      >
        <DialogTitle>{editId ? "ویرایش": "ثبت"} خدمت</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input
                label={"عنوان"}
                name={"title"}
                value={formik.values["title"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["title"] && Boolean(formik.errors["title"])}
                helperText={formik.touched["title"] && formik.errors["title"]}
                required
                fullWidth
              />

              <Stack direction={'row'} gap={1} alignItems={'center'} mt={5}>
                <Typography>وضعیت خدمت : </Typography>
                <CustomSwitch falseText="غیر فعال" size="lg" trueText="فعال" value={formik.values.status} setValue={(e) => formik.setFieldValue('status', e)} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <UploadImage width={'100%'} height={'230px'} emptyIcon={<WallpaperIcon />} setUploadedImage={setUploadedImage}  />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{gap:1}}>
          <Button variant="outlined" disabled={subLoading} onClick={()=>{
            setModal(false);
            setEditId(false)
          }}>انصراف</Button>
          <Button variant="contained" disabled={subLoading} onClick={formik.handleSubmit} >{editId ? "ویرایش" : "ثبت"}</Button>
        </DialogActions>

      </ModalTemplate>
      
      {/* DELETE WARNING MODAL */}
      <ModalTemplate
        open={deleteWarningModal}
        onClose={() => {
          setEditId(null);
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

      {/* ATTR MODAL */}
      <ModalTemplate
        open={attrModal}
        onClose={()=>{
          setEditId(null)
          setAttrModal(false)
        }}
        size={1000}
      >
        <DialogTitle>مدیریت زیرشاخه های خدمت</DialogTitle>

        <DialogContent>

        </DialogContent>

        <DialogActions>
          <Button 
            onClick={()=>{
              setEditId(null)
              setAttrModal(false)
            }}
            variant='outlined'
          >انصراف</Button>

          <Button variant='contained'>ثبت</Button>
        </DialogActions>

      </ModalTemplate>
    </>
  )
}