import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import * as React from 'react';
import { styled } from '@mui/material/styles';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 23,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 23,
    backgroundImage: 'linear-gradient(47deg, #888384 0%, rgb(88, 138, 100) 1%, #0fe983 100%)',
    border: 'none',
  },
}));

export default BorderLinearProgress