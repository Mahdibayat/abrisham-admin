import { Button, DialogActions, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PageTitle from "../components/pageTitle";
import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import { baseUrl, http } from "../scripts/axiosMethods";
import Loader from "../components/loader/loader";
import ModalTemplate from "../components/modal/modalTemplate";
import Input from "../components/Input/Input";
import { useFormik } from "formik";
import { contactUsValidator } from "../scripts/validators";
import Notiflix from "notiflix";

export default function CommentPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);

  useEffect(() => {
    fetch()
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const {data} = await http.get(baseUrl + "list/comment");
      setList(data.data)
    } catch (error) {
      console.error({error});
    } finally {
      setLoading(false);
    }
  }
  
  const formik = useFormik({
    initialValues: {
      key: "",
      value: ""
    },
    validationSchema: contactUsValidator,
    onSubmit: handleSubmit
  });
  
  async function handleSubmit(values) {
    setSubLoading(true);

    const formData = new FormData();
    formData.append( "key" , values.key );
    formData.append( "value" , values.value );

    const url = editId ? `edit/comment/${editId}` : "add/contactUS";

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
  
  async function handleRemoveBlog(truest) {
    if (truest) {
      setSubLoading(true);
      try {
        const {data} = await http.get(baseUrl + `delete/contactUS/${editId}`);
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
      <PageTitle title="مدیریت تماس با ما">
        {/* <Button variant={'contained'} endIcon={<AddIcon />} onClick={() => setModal(true)}>ایجاد</Button> */}
      </PageTitle>

      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عنوان</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">مقدار</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">
                  {moment(row.create_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.key}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    onClick={() => {
                      setEditId(row.id);
                      formik.setFieldValue('key', row.key)
                      formik.setFieldValue('value', row.value)
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
                      handleRemoveBlog(false);
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

      <ModalTemplate open={modal} size={600} onClose={()=>{
        setModal(false);
        setEditId(null);
      }}
      >
        <DialogTitle>{editId ? "ویرایش" : "ایجاد"} فیلد جدید تماس با ما</DialogTitle>

        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Input
                label={"عنوان"}
                name={"key"}
                value={formik.values["key"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["key"] && Boolean(formik.errors["key"])}
                helperText={formik.touched["key"] && formik.errors["key"]}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                label={"مقدار"}
                name={"value"}
                value={formik.values["value"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["value"] && Boolean(formik.errors["value"])}
                helperText={formik.touched["value"] && formik.errors["value"]}
                required
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{gap:1}}>
          <Button onClick={()=>{
            setModal(false);
            setEditId(null);
          }} variant="outlined" disabled={subLoading} >انصراف</Button>
          <Button disabled={subLoading} onClick={formik.handleSubmit} variant="contained" sx={{minWidth:'120px'}} >{editId ? "ویرایش" : "ثبت"}</Button>
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
            onClick={() => handleRemoveBlog(true)}
          >
            حذف
          </Button>
        </DialogActions>
      </ModalTemplate>
    </>
  )
}
