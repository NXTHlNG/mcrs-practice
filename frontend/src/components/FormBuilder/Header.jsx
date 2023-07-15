import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { Fragment } from "react";

const Header = ({ title, description, setTitle, setDescription }) => {
  return (
    <Fragment>
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderTop: "8px solid #9C27B0" }}>
          <TextField
            defaultValue={title}
            onBlur={(e) => setTitle(e.target.value)}
            variant="standard"
            placeholder="Новая форма"
            name="title"
            sx={{ mb: 3 }}
            fullWidth
          />
          <TextField
            name="description"
            defaultValue={description}
            onBlur={(e) => setDescription(e.target.value)}
            variant="standard"
            placeholder="Описание формы"
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
        </Paper>
      </Box>
    </Fragment>
  );
};

export default Header;
