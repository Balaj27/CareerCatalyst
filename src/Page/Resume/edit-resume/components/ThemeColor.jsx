import React, { useState } from "react";
import { 
  Button,
  Popover,
  Box,
  Typography,
  Grid,
  Paper
} from "@mui/material";
import { Palette } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "../../../../features/resume/resumeFeatures";
import { updateThisResume } from "../../../../Services/resumeAPI";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF",
  ];

  const [selectedColor, setSelectedColor] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const { resume_id } = useParams();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'color-popover' : undefined;

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    dispatch(
      addResumeData({
        ...resumeInfo,
        themeColor: color,
      })
    );
    const data = {
      data: {
        themeColor: color,
      },
    };
    await updateThisResume(resume_id, data)
      .then(() => {
        toast.success("Theme Color Updated");
      })
      .catch((error) => {
        toast.error("Error updating theme color");
      });
    // handleClose(); // Optionally close popover after color selection
  };

  return (
    <>
      <Button 
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<Palette />}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          textTransform: 'none'
        }}
      >
        Theme
      </Button>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 220 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Select Theme Color
          </Typography>
          
          <Grid container spacing={1}>
            {colors.map((item, index) => (
              <Grid item key={index} xs={2.4}>
                <Box
                  onClick={() => onColorSelect(item)}
                  sx={{
                    height: 20,
                    width: 20,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    bgcolor: item,
                    border: selectedColor === item ? '2px solid black' : '1px solid #e0e0e0',
                    '&:hover': {
                      border: '1px solid black',
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  );
}

export default ThemeColor;