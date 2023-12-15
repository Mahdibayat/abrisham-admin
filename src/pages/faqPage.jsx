import { Button, DialogActions, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PageTitle from "../components/pageTitle";
import AddIcon from '@mui/icons-material/Add';
import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import { baseUrl, http } from "../scripts/axiosMethods";
import Loader from "../components/loader/loader";
import ModalTemplate from "../components/modal/modalTemplate";
import Input from "../components/Input/Input";
import { useFormik } from "formik";
import { faqValidator } from "../scripts/validators";
import Notiflix from "notiflix";

export default function FaqPage() {

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
      const {data} = await http.get(baseUrl + "list/Fqa");
      setList(data.data)
    } catch (error) {
      console.error({error});
    } finally {
      setLoading(false);
    }
  }
  
  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
      priority: 0
    },
    validationSchema: faqValidator,
    onSubmit: handleSubmit
  });
  
  async function handleSubmit(values) {
    setSubLoading(true);

    const formData = new FormData();
    formData.append( "question" , values.question );
    formData.append( "answer" , values.answer );
    formData.append( "priority" , values.priority );

    const url = editId ? `edit/Fqa/${editId}` : "add/Fqa";

    try {
      const { data } = await http.post(baseUrl + url, formData)
      if (!data.status) throw data;
      Notiflix.Notify.success(data.message);
      setModal(false);
      setEditId(null);
      formik.resetForm();
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
        const {data} = await http.get(baseUrl + `delete/Fqa/${editId}`);
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
      <PageTitle title="مدیریت سوالات متداول">
        <Button variant={'contained'} endIcon={<AddIcon />} onClick={() => setModal(true)}>ایجاد</Button>
      </PageTitle>

      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">اولویت</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">سوال</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">جواب</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">
                  {moment(row.created_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.priority}</TableCell>
                <TableCell align="right">{row.question}</TableCell>
                <TableCell align="right">{row.answer}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    onClick={() => {
                      setEditId(row.id);
                      formik.setFieldValue('priority', row.priority)
                      formik.setFieldValue('question', row.question)
                      formik.setFieldValue('answer', row.answer)
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
        formik.resetForm();
      }}
      >
        <DialogTitle>{editId ? "ویرایش" : "ایجاد"} سوال متداول</DialogTitle>

        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Input
                label={"سوال"}
                name={"question"}
                value={formik.values["question"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["question"] && Boolean(formik.errors["question"])}
                helperText={formik.touched["question"] && formik.errors["question"]}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                label={'اولویت'}
                name={'priority'}
                value={formik.values['priority']}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['priority'] && Boolean(formik.errors['priority'])}
                helperText={formik.touched['priority'] && formik.errors['priority']}
                required
                type='number'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                label={'پاسخ'}
                name={'answer'}
                value={formik.values['answer']}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched['answer'] && Boolean(formik.errors['answer'])}
                helperText={formik.touched['answer'] && formik.errors['answer']}
                required
                type=''
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{gap:1}}>
          <Button onClick={()=>{
            setModal(false);
            setEditId(null);
            formik.resetForm();
          }} variant="outlined" disabled={subLoading} >انصراف</Button>
          <Button disabled={subLoading} onClick={formik.handleSubmit} variant="contained" sx={{minWidth:'120px'}} >{editId ? "ویرایش" : "ثبت"}</Button>
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
            onClick={() => handleRemoveBlog(true)}
          >
            حذف
          </Button>
        </DialogActions>
      </ModalTemplate>
    </>
  )
}
