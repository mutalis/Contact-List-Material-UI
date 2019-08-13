import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Loading from "./Loading";
import UpdateIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import "./styles.css";

// const initialUsers = [
//   {
//     id: 1,
//     username: "doug",
//     email: "doug@gmail.com"
//   },
//   {
//     id: 2,
//     username: "fred",
//     email: "fred@yahoo.com"
//   },
//   {
//     id: 3,
//     username: "amy",
//     email: "amy@hotmail.com"
//   }
// ];

const BASE_URL = "https://crud-api.reed-barger.now.sh/users";

function App() {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    axios.get(BASE_URL).then(res => {
      console.log("USERS FETCHED", res);
      setUsers(res.data);
    });
    // setTimeout(() => setUsers(initialUsers), 1000);
  }, []);

  function handleChange(event) {
    event.persist();
    setUser(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const userId = users.findIndex(u => u.id === user.id);
    const userExists = userId > -1;
    // if user exists, update it
    if (userExists) {
      axios.put(`${BASE_URL}/${user.id}`, user).then(res => {
        console.log("USER UPDATED", res);
        const updatedUsers = users.map(u => {
          return u.id === user.id ? user : u;
        });
        setUsers(updatedUsers);
      });
      // if user doesn't exist, create it
    } else {
      const newUser = { ...user, id: Date.now() };
      axios.post(BASE_URL, newUser).then(res => {
        console.log("USER CREATED", res);
        setUsers([...users, newUser]);
      });
    }
    setUser({ username: "", email: "" });
  }

  function clearUser() {
    setUser({ username: "", email: "" });
  }

  function deleteUser(user) {
    axios.delete(`${BASE_URL}/${user.id}`).then(res => {
      console.log("USER DELETED", res);
      setUsers(users.filter(u => u.id !== user.id));
    });
  }

  return (
    <div className="container">
      <Typography align="center" component="h1" variant="h5">
        Contact List
      </Typography>
      <form onSubmit={handleSubmit} className="form">
        <TextField
          autoComplete="off"
          name="username"
          onChange={handleChange}
          label="Insert name"
          fullWidth
          value={user.username}
        />
        <TextField
          autoComplete="off"
          name="email"
          onChange={handleChange}
          label="Insert email"
          fullWidth
          value={user.email}
        />
        <div style={{ display: "flex" }}>
          <Button className="button-submit" type="submit">
            Submit
          </Button>
          <Button onClick={clearUser} className="button-clear" type="button">
            Clear
          </Button>
        </div>
      </form>
      {users ? (
        users.map(user => (
          <Card key={user.id} className="card">
            <CardContent>
              <Typography component="h5" variant="h5" className="username">
                {user.username}
              </Typography>
              <Typography variant="subtitle1" className="email">
                {user.email}
              </Typography>
            </CardContent>
            <div style={{ margin: "1em" }}>
              <UpdateIcon
                style={{ color: "orange" }}
                onClick={() => setUser(user)}
              />
              <DeleteIcon
                style={{ color: "red" }}
                onClick={() => deleteUser(user)}
              />
            </div>
          </Card>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
