import PropTypes from 'prop-types'
import { Stack, Typography } from '@mui/material'

function PageTitle(props) {
  return (
    <Stack direction={'row'} sx={{justifyContent:'space-between', alignItems:'center', p:1, py:2}}>
      <Typography component={'h1'} variant='h5' sx={{fontSize:'2rem'}}>{props.title}</Typography>

      {props.children}
    </Stack>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default PageTitle