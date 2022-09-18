import { useState } from 'react';
import PropTypes from 'prop-types';
import {
   Box,
   IconButton,
   TextField,
   Snackbar,
   Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  json,
  LoaderFunction, 
  useSubmit, 
  useLoaderData,
  Form,
  useTransition,
  ActionFunction
} from 'remix';
import { getData, getHeaders, updateJewel, updateSkill } from '~/services';


type LoaderData = {
   columns: GridColDef[],
   rows: any
}

export const action: ActionFunction = async ({request})=>{
  const formData = await request.formData();

  const type = formData.get('type');
  const data: any = formData.get('data');
  const dataForm = JSON.parse(data);

  if(type === 'jewel'){
    await updateJewel(dataForm.id, dataForm.values);
  } else {
    await updateSkill(dataForm.id, dataForm.values);
  }

  return null;
}

export const loader: LoaderFunction = async ()=>{
  const columns: GridColDef[] = await getHeaders();
  const data: any = await getData();
  const loaderData: LoaderData = {
    columns ,
    rows: data
  };
  return json(loaderData);
}

function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props: any) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
    </Box>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default function index() {
  const data = useLoaderData<LoaderData>(); 
  const submit = useSubmit();
  const transition = useTransition();

  async function requestData(params: any){
    const {field, id, value} = params;
    const type = field.includes('skill')?'skill':'jewel';
    const label = field.replace('skill_', '');
    const values = {[label]:value}
    const formData = {
      data:  JSON.stringify({id, values}),
      type
    }

    submit(
      formData, 
      { method: 'post' }
    );
}

  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(data.rows);

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.rows.filter((row: any) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  return (
    <>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical:"top", horizontal:"right" }}
        open={transition.state == 'submitting'}
        key={'topright'}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          Actualizando tabla
        </Alert>
      </Snackbar>
      <Box component={Form} action='post' sx={{ height: 800, width: '100%' }}>
        <DataGrid
          isCellEditable={()=>false}
          onCellEditCommit={requestData}
          rowHeight={25}
          components={{ Toolbar: QuickSearchToolbar }}
          rows={rows}
          columns={data.columns}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event: any) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
        />
      </Box>
    </>
  );
}