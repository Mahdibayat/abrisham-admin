import {
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import moment from "moment-jalaali";
import Notiflix from "notiflix";
import { useEffect, useState } from "react";
import Loader from "../components/loader/loader";
import PageTitle from "../components/pageTitle";
import { baseUrl, http } from "../scripts/axiosMethods";

export default function CommentPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const { data } = await http.get(baseUrl + "list/comment");
      console.log({ data });
      setList(data.data);
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }


  async function handleChangeStatus(e, id) {
    console.log({ status: e.target.value, id });

    setSubLoading(true);
    try {
      const { data } = await http.post(baseUrl + `edit/comment/${id}`, {
        status: e.target.value,
      });
      console.log({ data });
      fetch();
      Notiflix.Notify.success(data.data);
    } catch (error) {
      console.error({ error });
    } finally {
      setSubLoading(false);
    }
  }

  return (
    <>
      <PageTitle title="مدیریت نظرات" />

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
                نام نظر دهنده
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
                نظر
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
                وضعیت نظر
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">
                  {moment(row.create_at).format("jYYYY/jMM/jDD HH:mm")}
                </TableCell>
                <TableCell align="right">{row.full_name}</TableCell>
                <TableCell align="right">{row.comment}</TableCell>
                <TableCell align="right">
                    <Select
                      labelId="demo-simple-select-label"
                      value={row.status}
                      displayEmpty
                      onChange={(e) => handleChangeStatus(e, row.id)}
                      disabled={subLoading}
                      sx={{
                        minWidth: '100px',
                        "*": {
                          color: row.status === 'active' ? 'lightgreen' : row.status === 'reject' ? "#ff5050" : "yellow"
                        }
                      }}
                    >
                      <MenuItem
                        value={"pending"}
                      >
                        در انتظار
                      </MenuItem>
                      <MenuItem
                        value={"active"}
                      >
                        تایید
                      </MenuItem>
                      <MenuItem
                        value={"reject"}
                      >
                        رد
                      </MenuItem>
                    </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <Loader />}
      </TableContainer>
    </>
  );
}
