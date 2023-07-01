import { Button, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <Grid container justifyContent={'center'} alignItems={'center'} minHeight={"80vh"}>
      <Stack alignItems={'center'} gap={3}>
        <Typography variant={"h5"}>صفحه مورد نظر پیدا نشد</Typography>
        <Link to={'/'}>
          <Button variant="contained">
            بازگشت به داشبورد
          </Button>
        </Link>
      </Stack>
    </Grid>
  )
}
