import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  IconButton
} from "@mui/material";
import Notiflix from "notiflix";
import { useEffect, useRef, useState } from "react";
import ModalTemplate from "../components/modal/modalTemplate";
import PageTitle from "../components/pageTitle";
import { baseUrl, baseUrlImage, http } from "../scripts/axiosMethods";
import Loader from "../components/loader/loader";
import UploadImage from "../components/uploadImage/uploadImage";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import SunEditor, { buttonList } from 'suneditor-react';
import moment from "moment-jalaali";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function BlogPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  // const [editor, setEditorValue] = useState("");
  const defaultRef = useRef("");
  const [imageModal, setImageModal] = useState(false);
  const [deleteWarningModal, setDeleteWarningModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState({
    current_page: 1,
    next_page_url: null,
    per_page: 10,
    prev_page_url: null,
    to: 3,
    total: 3
  });
  const editor = useRef();
  const {handleSubmit, control, reset, setValue} = useForm({
    defaultValues: {
      title: "",
      description: "",
      read_time: "",
      keywords: [],
    }
  })

  const {append,fields, remove,update } = useFieldArray({
    control,
    name: 'keywords',
    rules: { maxLength: 5 }
  })

  useEffect(() => {
    fetchList();
  }, [])

  async function fetchList(page) {
    setLoading(true);
    let urlText = 'list/blog';
    if(typeof page !== 'undefined' && !!page) {
      urlText += `?page=${page}`
    }
    try {
      const { data } = await http.get(baseUrl + urlText);
      handleCustomizeRes(data);
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  function handleCustomizeRes(data) {
    let blogs = data.Blogs.data;
    let images = data.images;
    setPage(data.Blogs.current_page)
    setPageData(data.Blogs);
    let list = blogs.map((b) => ({
      ...b,
      images: images.filter((i) => i.model_id == b.id),
    }));
    setList(list);
  }

  async function submit(values) {
    setSubLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("read_time", values.read_time);
    if (editor.current) formData.append("description", editor.current.getContents());
    if (image) formData.append("images[]", image, image.name);

    if(values.keywords.length) {
      console.log({values})
      const keywords = values.keywords.join(", ")
      console.log({keywords})
      formData.append("keywords", keywords);
    }
    
    let url = editId ? `edit/blog/${editId}` : "add/blog" 

    try {
      const {data} = await http.post(baseUrl + url, formData);
      if (!data.status) throw data;
      setModal(false);
      setEditId(null);
      fetchList();
      reset();
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

  async function handleChangePage(e, page) {
    fetchList(page)
  }

  function imageUploadHandler(xmlHttpRequest, info, core){
    console.log(xmlHttpRequest, info, core)
  }
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

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
                  {moment(row.created_at).format("jYYYY/jMM/jDD HH:mm")}
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
                        setEditId(row.id);
                        defaultRef.current = row.description;
                        setValue("title", row.title)
                        setValue("read_time", row.read_time);
                        if(row.keywords) {
                          const arrayMap = row.keywords.split(", ");
                          console.log({arrayMap})
                          arrayMap.forEach((key,i) => {
                            setValue(`keywords[${i}]`, key);
                            update(`keywords[${i}]`, key)
                          })
                        }
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

          {
            Math.ceil(Number(pageData.total) / Number(pageData.per_page)) > 1 &&
            <TableFooter>
              <TableCell colSpan={4}>
                {console.log({pageData})}
                <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
                  <Pagination 
                    disabled={loading} 
                    count={Math.ceil(Number(pageData.total) / Number(pageData.per_page))} 
                    page={page} onChange={handleChangePage} 
                  />
                </Stack>
              </TableCell>
          </TableFooter>
          }
        </Table>
        {loading && <Loader />}
      </TableContainer>

      {/* CREATE AND EDIT MODAL */}
      <ModalTemplate
        open={modal}
        onClose={() => {
          setModal(false);
          defaultRef.current = "";
          update([]);
        }}
        size={1000}
      >
        <DialogTitle>{editId ? "ویرایش" : "اضافه کردن"} مقاله</DialogTitle>
        <form
          onSubmit={handleSubmit(submit)}
        >
          <DialogContent>
            <Grid container spacing={1} columnSpacing={3}>
              <Grid item xs={12} md={6}>

                <Controller
                  control={control}
                  name="title"
                  rules={{
                    required: 'عنوان اجباری است',
                  }}
                  render={({ field, fieldState: {error} }) => (
                    <TextField 
                      {...field} 
                      label='عنوان مقاله'
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="read_time"
                  rules={{
                    required: 'مدت زمان خواندن پروژه را وارد کنید',
                  }}
                  render={({ field, fieldState: {error} }) => (
                    <TextField 
                      {...field} 
                      label='مدت زمان خواندن پروژه'
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                      type="number"
                    />
                  )}
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

              <Grid item xs={12}>
                <Grid container spacing={1} alignItems={'center'}>
                  {fields.map((field, index) => (
                    <Grid item xs={12} sm={4} md={3} key={field.id} sx={{position:'relative'}}>
                      <Controller
                        control={control}
                        name={`keywords.${index}`}
                        rules={{
                          required: 'وارد کردن حداقل یک کلمه کلیدی اجباری است',
                        }}
                        render={({ field, fieldState: {error} }) => (
                          <TextField 
                            {...field} 
                            label={`کلمه کلیدی (SEO) ${index + 1}`}
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                          />
                        )}
                      />
                      <IconButton 
                        onClick={() => remove(index)}
                        sx={{
                          position:'absolute',
                          top: 0,
                          left: 0,
                          opacity: .5,
                          color: 'error.main'
                        }}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={4} md={3}>
                    <Button onClick={()=>append("")} variant="outlined" size="large" fullWidth endIcon={<ControlPointIcon />}>اضافه کردن کلمه کلیدی</Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} mt={2}>
                {/* <TextEditor
                  setEditorValue={setEditorValue}
                  defaultValue={defaultRef.current || "<h3 style='text-align:center;'>متن مقاله را وارد کنید</h3>"}
                /> */}
                <SunEditor
                  defaultValue={defaultRef.current}
                  placeholder="متن مقاله خود را وارد کنید..."
                  imageUploadHandler={imageUploadHandler}
                  setOptions={{
                    buttonList: buttonList.complex 
                  }}
                  getSunEditorInstance={getSunEditorInstance}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ gap: 1 }}>
            <Button
              onClick={() => {
                setModal(false);
                defaultRef.current = "";
                reset();
              }}
              disabled={subLoading}
              variant="outlined"
            >
              انصراف
            </Button>

            <Button
              variant="contained"
              type={'submit'}
              style={{ minWidth: "120px" }}
              disabled={subLoading}
            >
              {editId ? "ویرایش": "ثبت"}
            </Button>
          </DialogActions>
        </form>
      </ModalTemplate>
                     
      {/* IMAGE MODAL */}
      <ModalTemplate
        open={imageModal}
        onClose={() => {
          setEditId(null);
          setImageModal(false);
        }}
        size={400}
      >
        <DialogTitle>مدیریت عکس های مقاله</DialogTitle>
        <DialogContent sx={{width:1}}>
          {!!editId && (
            <Grid container sx={{width:1}}>
              
              {!!list.find((b) => b.id == editId).images.length ?
                list.find((b) => b.id == editId).images.map((img) => (
                  <Grid
                    item
                    xs={12}
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
