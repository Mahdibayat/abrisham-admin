import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useFormik } from "formik";
import Notiflix from "notiflix";
import { useEffect, useRef, useState } from "react";
import ModalTemplate from "../components/modal/modalTemplate";
import PageTitle from "../components/pageTitle";
import { baseUrl, baseUrlImage, http } from "../scripts/axiosMethods";
import { blogValidator } from "../scripts/validators";
import Loader from "../components/loader/loader";
import Input from "../components/Input/Input";
import UploadImage from "../components/uploadImage/uploadImage";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import TextEditor from "../components/textEditor/textEditor";
import moment from "moment-jalaali";

export default function BlogPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  const [editor, setEditorValue] = useState("");
  const defaultRef = useRef("");
  const [imageModal, setImageModal] = useState(false);
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const { data } = await http.get(baseUrl + "list/blog");
      handleCustomizeRes(data);
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  function handleCustomizeRes(data) {
    let blogs = data.Blogs;
    let images = data.images;
    let list = blogs.map((b) => ({
      ...b,
      images: images.filter((i) => i.model_id !== b.id),
    }));
    setList(list);
  }

  async function handleSubmit(values) {
    setSubLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("read_time", values.read_time);
    if (editor) formData.append("description", editor);
    if (image) formData.append("images[]", image, image.name);

    let url = editId ? `edit/blog/${editId}` : "add/blog" 

    try {
      const {data} = await http.post(baseUrl + url, formData);
      if (!data.status) throw data;
      setModal(false);
      setEditId(null);
      fetchList();
      defaultRef.current = "";
      Notiflix.Notify.success(data.message);
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  async function handleRemoveBlog(truest) {
    if (truest) {
      setSubLoading(true);
      try {
        const {data} = await http.get(baseUrl + `delete/blog/${editId}`);
        if (!data.status) throw data;
        setDeleteWarningModal(false);
        setEditId(null);
        fetchList();
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

  async function handleRemoveBlogImage(id) {
    setSubLoading(true);
    try {
      const res = await http.get(baseUrl + `delete/image/blog/${id}`);
      if (!res.status) throw res;
      setEditId(null);
      setImageModal(false);
      fetchList();
      Notiflix.Notify.success(res.message);
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      read_time: ""
    },
    validationSchema: blogValidator,
    onSubmit: handleSubmit,
  });

  return (
    <>
      {/* TITLE */}
      <PageTitle title="مدیریت مقالات">
        <Button endIcon={<AddIcon />} variant="contained" onClick={() => setModal(true)}>
          ایجاد مقاله جدید
        </Button>
      </PageTitle>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{bgcolor:'gray.dark'}}>
            <TableRow>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">ایجاد شده در</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عنوان مقاله</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">مدت زمان مطالعه</TableCell>
              <TableCell component={'th'} sx={{fontWeight:'bolder', fontSize:'1.1rem', color:'primary.light'}} align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">
                  {moment(row.create_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="center">{row.read_time || "-"}</TableCell>
                <TableCell align="right">
                  <Stack direction={"row"}>
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditId(row.id);
                        setImageModal(true);
                      }}
                      color="secondary"
                    >
                      مدیریت عکس ها
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        console.log(row);
                        setEditId(row.id);
                        defaultRef.current = row.description;
                        formik.setFieldValue("title", row.title);
                        setModal(true);
                      }}
                    >
                      ویرایش مقاله
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditId(row.id);
                        handleRemoveBlog(false);
                      }}
                      color="error"
                    >
                      حذف مقاله
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <Loader />}
      </TableContainer>

      {/* CREATE AND EDIT MODAL */}
      <ModalTemplate
        open={modal}
        onClose={() => {
          setModal(false);
          defaultRef.current = "";
        }}
        size={1000}
      >
        <DialogTitle>{editId ? "ویرایش" : "اضافه کردن"} مقاله</DialogTitle>

        <DialogContent>
          <Grid container spacing={1} columnSpacing={3}>
            <Grid item xs={12} md={6}>
              <Input
                label={"عنوان مقاله"}
                name={"title"}
                value={formik.values["title"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["title"] && Boolean(formik.errors["title"])}
                helperText={formik.touched["title"] && formik.errors["title"]}
                required
                fullWidth
              />

              <Input
                label={"مدت زمان خواندن پروژه"}
                name={"read_time"}
                value={formik.values["read_time"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["read_time"] && Boolean(formik.errors["read_time"])}
                helperText={formik.touched["read_time"] && formik.errors["read_time"]}
                placeholder={'عدد به دقیقه وارد شود'}
                type='number'
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <UploadImage
                emptyIcon={<CropOriginalIcon style={{ width: "100%", height: "100%" }} />}
                height="180px"
                width="100%"
                setUploadedImage={setImage}
              />
            </Grid>

            <Grid item xs={12} mt={2}>
              <TextEditor
                setEditorValue={setEditorValue}
                defaultValue={defaultRef.current || "<h3 style='text-align:center;'>متن مقاله را وارد کنید</h3>"}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ gap: 1 }}>
          <Button
            onClick={() => {
              setModal(false);
              defaultRef.current = "";
              formik.resetForm();
            }}
            disabled={subLoading}
            variant="outlined"
          >
            انصراف
          </Button>

          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            style={{ minWidth: "120px" }}
            disabled={subLoading}
          >
            {editId ? "ویرایش": "ثبت"}
          </Button>
        </DialogActions>
      </ModalTemplate>

      {/* IMAGE MODAL */}
      <ModalTemplate
        open={imageModal}
        onClose={() => {
          setEditId(null);
          setImageModal(false);
        }}
        size={800}
      >
        <DialogTitle>مدیریت عکس های مقاله</DialogTitle>
        <DialogContent sx={{width:1}}>
          {!!editId && (
            <Grid container sx={{width:1}} spacing={2}>
              {!!list.find((b) => b.id === editId).images.length ?
                list.find((b) => b.id === editId).images.map((img) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={img.id}
                    sx={{ height: "180px", width:1, position: "relative", border:'5px solid transparent' }}
                  >
                    <img
                      src={baseUrlImage + img.filename}
                      alt={img.filename}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "7px",
                      }}
                    />
                    <ButtonGroup style={{ position: "absolute", left: "5px", bottom: "0" }}>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleRemoveBlogImage(img.id)}
                        disabled={subLoading}
                      >
                        حذف
                      </Button>
                    </ButtonGroup>
                  </Grid>
                ))
                :
                <Grid item sx={{minHeight:'60px', width:1, display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <h5>برای این مقاله تصویری ثبت نشده است</h5>
                </Grid>
              }
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Stack style={{ justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setEditId(null);
                setImageModal(false);
              }}
              style={{ minWidth: "120px", marginTop: "5px" }}
            >
              بستن
            </Button>
          </Stack>
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
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ minWidth: "120px" }}
            loading={subLoading}
            onClick={() => handleRemoveBlog(true)}
          >
            حذف
          </Button>
        </DialogActions>
      </ModalTemplate>
    </>
  );
}
