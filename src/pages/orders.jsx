import { MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import  { useEffect, useState } from "react";
import Loader from "../components/loader/loader";
import PageTitle from "../components/pageTitle";
import { baseUrl, http } from "../scripts/axiosMethods";
import moment from "moment-jalaali";
import { Notify } from "notiflix";

export default function OrdersPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    setLoading(true);
    try {
      const { data } = await http.get(baseUrl + "list/order");
      setList(data.data);
    } catch (error) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  async function changeNavStatus(id, value) {
    setLoading(true);
    try {
      const {data} = await http.post(baseUrl + "edit/order/" + id , {
        status: value
      });
      console.log({data})
      if(!data.status) throw data
      Notify.success(data.message)
    } catch (error) {
      console.error({error});
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageTitle title="سفارشات">
        
      </PageTitle>

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
               نام و نام خانوادگی
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
                شماره تماس
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
                سرویس درخواستی
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
                تغییر وضعیت
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
                <TableCell align="right">{row.mobile}</TableCell>
                <TableCell align="right">{row.service}</TableCell>
                <TableCell align="right">
                  <Select onChange={e => changeNavStatus(row.id, e.target.value)} defaultValue={row.status}
                    sx={{
                      minWidth:'150px'
                    }}
                  >
                    <MenuItem value={'confirm'}>تایید شده</MenuItem>
                    <MenuItem value={"pending"}>انتظار برسی</MenuItem>
                    <MenuItem value={"reject"}>رد شده</MenuItem>
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
