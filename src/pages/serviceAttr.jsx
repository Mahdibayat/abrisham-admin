import { useFormik } from "formik";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { serviceAttrValidator } from "../scripts/validators";
import { baseUrl, baseUrlImage, http } from "../scripts/axiosMethods";
import Notiflix from "notiflix";
import PageTitle from "../components/pageTitle";
import {
  Box,
  Button,
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
import moment from "moment-jalaali";
import Loader from "../components/loader/loader";
import ModalTemplate from "../components/modal/modalTemplate";
import TextEditor from "../components/textEditor/textEditor";
import Input from "../components/Input/Input";
import UploadMultiply from "../components/uploadImage/uploadMultiply";

function ServiceAttr() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [files, setFile] = useState([]);
  const [mainServiceTitle, setMainServiceTitle] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);

  if (!location.state.id) navigate("/service");

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const { data } = await http.get(
        baseUrl + `list/service/Atrr/${location.state.id}`
      );
      setServices(data.serviceAtrr);
      setImages(data.images);
      setMainServiceTitle(data.serviceAtrr?.[0]?.service?.[0]?.title || "");
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
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setSubLoading(true);

    const formData = new FormData();
    formData.append("service_id", values.service_id);
    formData.append("title", values.title);
    formData.append("description", editorValue);
    if (!!files.length) {
      Array.from(files).forEach(file => {
        formData.append("images[]", file, file.name || "x");
      })
    } 

    const url = editId ? `edit/service/Atrr/${editId}` : "add/service/Atrr";

    try {
      const { data } = await http.post(baseUrl + url, formData);
      if (!data.status) throw data;
      Notiflix.Notify.success(data.message);
      setModal(false);
      setEditId(null);
      setEditorValue("");
      fetch();
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
        const { data } = await http.get(
          baseUrl + `delete/service/Atrr/${editId}`
        );
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
      <PageTitle title={`مدیریت جزئیات خدمات "${mainServiceTitle}"`}>
        {
          services.length < 1 &&
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              onClick={() => setModal(true)}
            >
              ایجاد زیرشاخه جدید
            </Button>
        }
      </PageTitle>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead sx={{ bgcolor: "gray.dark" }}>
            <TableRow>
              <TableCell
                component={"th"}
                sx={{
                  fontWeight: "bolder",
                  fontSize: "1.1rem",
                  color: "primary.light",
                }}
                align="right"
              >
                ایجاد شده در
              </TableCell>
              <TableCell
                component={"th"}
                sx={{
                  fontWeight: "bolder",
                  fontSize: "1.1rem",
                  color: "primary.light",
                }}
                align="right"
              >
                تصاویر
              </TableCell>
              <TableCell
                component={"th"}
                sx={{
                  fontWeight: "bolder",
                  fontSize: "1.1rem",
                  color: "primary.light",
                }}
                align="right"
              >
                عنوان
              </TableCell>
              <TableCell
                component={"th"}
                sx={{
                  fontWeight: "bolder",
                  fontSize: "1.1rem",
                  color: "primary.light",
                }}
                align="right"
              >
                توضیحات
              </TableCell>
              <TableCell
                component={"th"}
                sx={{
                  fontWeight: "bolder",
                  fontSize: "1.1rem",
                  color: "primary.light",
                }}
                align="right"
              >
                عملیات
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map?.((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">
                  {moment(row.created_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{
                    display: 'grid',
                    maxWidth: '150px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
                    gap: '10px',
                    img: {
                      transition: 'all 800ms',
                      ':hover': {
                        transform: 'scale(2)'
                      }
                    }
                  }}>
                    {
                      images.filter(img => img.model_id !== editId).map(img => {
                        console.log({img})
                        return <img  key={img.id} src={baseUrlImage + img.filename} alt='' style={{width: '100%', height: '50px', objectFit: 'cover', border: '1px solid blue', borderRadius: 1}} />  
                      })
                    }
                  </Box>
                </TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="right">
                  <Stack gap={1}>
                    {/* <Button
                      variant="text"
                      onClick={() => {
                        setEditId(row.id);
                        handleRemove(false);
                      }}
                      color="error"
                    >
                      حذف
                    </Button> */}
                    <Button
                      variant="text"
                      onClick={() => {
                        setEditId(row.id);
                        setEditorValue(row.description)
                        setModal(true);
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

      <ModalTemplate
        open={modal}
        onClose={() => {
          setModal(false);
          formik.resetForm();
          setEditorValue("");
          setFile(null);
        }}
        size={900}
      >
        <DialogContent>
          <Grid
            container
            spacing={1}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <Input
                label={"عنوان"}
                name={"title"}
                value={formik.values["title"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched["title"] && Boolean(formik.errors["title"])
                }
                helperText={formik.touched["title"] && formik.errors["title"]}
                required
                fullWidth
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
            >
              <UploadMultiply
                setUploadedImages={setFile}
              />
            </Grid>

            <Grid
              xs={12}
              mt={2}
            >
              <TextEditor
                setEditorValue={setEditorValue}
                defaultValue={editorValue}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ gap: 1 }}>
          <Button
            onClick={() => {
              formik.resetForm();
              setFile(null);
              setEditId(null);
              setEditorValue("");
              formik.resetForm();
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

export default ServiceAttr;
