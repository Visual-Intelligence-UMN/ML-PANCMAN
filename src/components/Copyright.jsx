import {Typography, Link} from '@mui/material'
export default function Copyright(props) {
    return (
      <Typography variant="body2" color="white" align="center" {...props}>
        {'Copyright © '}
        
          University of Minnesota
        
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }