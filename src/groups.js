import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  // Autocomplete,
  OutlinedInput,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

const AddGroupPrompt = ({ open, close, allUsers, roster, client }) => {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("private");

  const onAdd = () => {
    users.forEach((u) => {
      // add this group to this user's existing groups
      const groups = roster.find(i => i.jid.includes(u))?.groups?.concat([title]) || [title];
      client.updateRosterItem({ jid: u, groups });
    });
    setUsers([]);
    setTitle("");
    close();
  }

  const handleUserChange = (event) => {
    const {
      target: { value },
    } = event;
    setUsers(typeof value === 'string' ? value.split(',') : value);
  };

  const removeUser = (e) => {
    // TODO
    console.log("removeUser", e.target.value);
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>New Group</DialogTitle>

      <DialogContent>
        <TextField
          type="text"
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ my: 1 }}
          />

        <FormControl sx={{ my: 1 }}>
          <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
            <FormControlLabel value="private" control={<Radio />} label="Private" />
            <FormControlLabel disabled value="public" control={<Radio />} label="Public" />
          </RadioGroup>
        </FormControl>

        <Select
          sx={{ my: 1 }}
          fullWidth
          multiple
          value={users}
          onChange={handleUserChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} onDelete={() => removeUser(value)} />
              ))}
            </Box>
          )}
        >
          {roster.filter(i => !i.isRoom).map((user) => (
            <MenuItem
              key={user.jid}
              value={user.jid}
            >
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>

      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={onAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

const Group = ({ group }) => {
  if (!group) { return null; }
  return <div>
    <Stack sx={{ flexGrow: 1 }}>
      <Stack direction="row" sx={{ px: 2, background: "white", alignItems: "center" }}>
        <h2>{group.name}</h2>
      </Stack>

      <Stack sx={{ background: "#eee", flexGrow: 1, overflow: "auto", px: "10%" }}>
        <List>
          {group.users.map(u => (
            <ListItem>
              {u.name}
            </ListItem>
          ))}
        </List>
      </Stack>
    </Stack>
  </div>;
}

const Groups = ({ client, allUsers, roster, jwt, API_BASE, privateGroups }) => {
  const [search, setSearch] = useState("");
  const [subNav, setSubNav] = useState(null);
  const [tab, setTab] = useState(0);
  const [showAddGroup, setShowAddGroup] = useState(false);

  const filteredGroups = privateGroups?.filter((u) => { // filter by search
    const s = search.toLowerCase();
    return u.name?.toLowerCase().includes(s);
  });

  return (
    <>
      <AddGroupPrompt
        close={() => setShowAddGroup(false)}
        open={showAddGroup}
        allUsers={allUsers}
        roster={roster}
        client={client}
      />

      <Paper className="scroll-list-container" sx={{ width: 300 }}>
        <Box sx={{ px: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <h2>Groups</h2>

            <IconButton sx={{ ml: "auto" }} onClick={() => setShowAddGroup(true)}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Stack>

          <TextField
            type="search"
            label="Search"
            variant="filled"
            size="small"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, idx) => setTab(idx)} aria-label="basic tabs example">
            <Tab label="Private" index={0} />
          </Tabs>
        </Box>

        <List className="scroll-list">
          {filteredGroups.map((g) => (
            <ListItem key={g.name} disablePadding>
              <ListItemButton onClick={() => setSubNav(g)}>
                <ListItemAvatar>
                  <Avatar>
                    {initials(g)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={g.name}
                  primaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                  secondary={g.user?.email}
                  secondaryTypographyProps={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                  title={g.jid}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper className="right-section">
        <Group group={subNav} />
      </Paper>
    </>
  );
};

// TODO put this is allUsers state
function initials(u) {
  return u.name?.split(" ")?.slice(0, 2)?.map(n => n.substr(0, 1));
}

export default Groups;
